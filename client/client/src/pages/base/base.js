import React, {useState, useEffect} from 'react';
import NavBar from '../../components/navbar/navbar';
import './base.css';
import { instruction } from '../../data/instruction';
import Loader from '../../components/loader/loader';
import Error from '../../components/error/error';
import axios from 'axios';

const BaseTemplate = (props) => {
  const[isLoading, setLoading] = useState(false)
  const[url, setUrl] = useState("http://scdb.wustl.edu/index.php")
  const[isError, setError] = useState(false)
  const[urlData, seturlData] = useState([])


  const loadData = (e) => {
    e.preventDefault();
    setLoading(true);
    let apiurl = 'http://localhost:8000/api/urls/'
    let payload = {
      url: url
    }
    axios.post(apiurl, payload).then((res) => {
      console.log(res);
      if(res.status === 200) {
        setLoading(false);
        seturlData(res.data);
      }
    })
  }

  const isValidURL = (url) => {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(url);
  }
  const handleURLChange = (e) => {
    const value = e.target.value;
    if (isValidURL(value)) {
      setUrl(value);
      setError(false);
    } else {
      setError(true);
    }
    if(value.length === 0){
      setError(false);
    }
  }
  return (
    <div>
      <NavBar title={props.title} />
      {isLoading ? <Loader />: null}
      <div className="container-instruction">
        <div className="header">
          <h2>ArbiLex-Justice Data Representation</h2>
        </div>
        <div className="instructions">
          <div className="header">
            <h3>Instruction</h3>
          </div>
          <ul>
            {
              instruction.map((data, id) => {
                return <li key={id}>{data}</li>
              })
            }
          </ul>
        </div>
        <div className="instructions">
          <div className="header">
            <h3>Control Panel</h3>
          </div>
          <div className="controls-div">
            <form className="controls" onSubmit={loadData}>
              <label htmlFor="url">URL</label>
              <input className="url" type="text" name="url" onChange={handleURLChange} placeholder="http://scdb.wustl.edu/index.php" />
              <button className="load-btn">Load Data</button>
            </form>
            {isError ? <Error message="email invalid"/>: null}
          </div>
        </div>
        <div className="instructions">
          <div className="header">
            <h3>Data</h3>
          </div>
          <ul className="link-list">
            { urlData ? 
              urlData.map((data, id) => {
                const name = data.split('/')
                return <li key={id}><a href={data} target="_blank">{name[name.length-1]}</a></li>
              }) : null
            }
          </ul>
        </div>
      </div>
    </div>
  );
};
 
export default BaseTemplate;