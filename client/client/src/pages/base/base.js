import React, {useState, useEffect} from 'react';
import './base.css';
import { instruction } from '../../data/instruction';
import { useHistory } from "react-router-dom";
import Loader from '../../components/loader/loader';
import PercentLoader from '../../components/percent/percent';
import Error from '../../components/error/error';
import axios from 'axios';


const BaseTemplate = (props) => {
  let[isLoading, setLoading] = useState(false)
  let[url, setUrl] = useState("http://scdb.wustl.edu/index.php")
  let[isError, setError] = useState(false)
  let[urlData, seturlData] = useState([])
  let[progress, updateProgress] = useState(null)
  let[count, updateCount] = useState(0)
  let[loopURL, loopURLData] = useState([])

  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();
  let history = useHistory();

  // Cancel requests
  useEffect(() => {
    source.cancel('Operations cancelled on reload.');
  }, [])

  const retrieveData = async () => {
    let apiurl = 'http://localhost:8000/api/case_urls/'
    await axios.get(apiurl).then((res) => {
      if(res.status === 200) {
        seturlData(res.data)
      }
    })
  }

  useEffect(() => {
    retrieveData()
  }, [isLoading])

  useEffect(() => {
    props.updateURL(urlData);
  }, [urlData])

  const changeColumns = ( searchTerm, changeObject ) => {
    let tempURLData = [...urlData]
    for (var i in tempURLData) {
      if (tempURLData[i].url === searchTerm) {
          tempURLData[i].columns = JSON.parse(changeObject);
          seturlData(tempURLData)
          break; //Stop this loop, we found it!
      }
    }
  }

  const loadColumnData = (e) => {
    e.preventDefault();
    updateProgress(1);
    if(urlData.length !== 0){
      let promises = []
      urlData.forEach(async (item) => {
        let apiurl = 'http://localhost:8000/api/columns/'
        let payload = {
          url: item.url
        }
        promises.push(
          axios.post(apiurl, payload, {
            cancelToken: source.token
          })
        )
      })
      Promise.all(promises).then(function (results) {
        results.forEach(function (res) {
          updateCount(count += 1);
          if(res.status === 200) {
            updateProgress(Math.floor((count / urlData.length)*100));
            changeColumns(url, res.data);
            props.updateCol(res.data);
            // let temp = [...urlData];
            // seturlData(res.data);
          }
        });
        history.push('/dash');
      });
    }
  }

  const loadData = (e) => {
    e.preventDefault();
    setLoading(true);
    let apiurl = 'http://localhost:8000/api/scrape_urls/'
    let payload = {
      url: url
    }
    axios.post(apiurl, payload).then((res) => {
      console.log(res);
      if(res.status === 200) {
        setLoading(false);
        // seturlData(res.data);
      }
    })
  }

  const updateDataSource = (e) => {
    const val = parseInt(e.target.id.split('-')[1]);
    const exists = loopURL.includes(val)
    console.log(loopURL, val, exists);
    if(!exists) {
      loopURLData(prev => [...prev, val]);
    } else {
      var temp = [...loopURL];
      const index = temp.indexOf(val);
      if (index !== -1) temp.splice(index, 1);
      loopURLData(temp)
    }
    retrieveData();
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
      {isLoading ? <Loader />: null}
      {progress < 100 && progress >= 0 && progress != null ? <PercentLoader percent={progress.toString()}/>: null}
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
              <button className="load-btn">{urlData ? 'Reload Data' : 'Load Data'}</button>
            </form>
            {isError ? <Error message="url invalid"/>: null}
          </div>
        </div>
        <div className="instructions">
          <div className="header">
            <h3>Data</h3>
          </div>
          <div className="load-data"><button className="load-btn" onClick={loadColumnData}>Load Sheet Data</button></div>
          <ul className="link-list">
            { urlData ? 
              urlData.map((data, id) => {
                const name = data.url.split('/')
                return <div className="url" key={id}>
                  <input 
                    type="checkbox" 
                    id={'check-'+id} 
                    className="select"
                    value={data.url} 
                    onChange={updateDataSource}
                    checked={data.active}
                  >
                  </input>
                  <li className={'check-'+id}>
                    <a 
                      href={data.url} 
                      target="_blank" 
                      className="link"
                      rel="noopener noreferrer"
                    >
                      {name[name.length-1]}
                    </a>
                  </li>
                  </div>
              }) : <p>Scrape data source first.</p>
            }
          </ul>
        </div>
      </div>
    </div>
  );
};
 
export default BaseTemplate;