import React, {useState, useEffect} from 'react';
import { useHistory } from "react-router-dom";
import Card from '../../components/card/card';
import './dash.css';
import axios from 'axios';
import { getAggregratedData } from '../../data/dash.js';
import Scatter from '../graph/graph';
import _ from 'underscore';


const DashBoard = (props) => {
    const [aggregateData, setAggregateData] = useState([]);
    const [yactive, setYactive] = useState("1")
    const [color, setColor] = useState("0")
    const [labelX, setLabelX] = useState("Duration of term")
    const [xData, setxData] = useState(0)
    const [yData, setyData] = useState(0)
    const [graphData, setGraphData] = useState([])
    let history = useHistory();
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();

    useEffect(() => {
        getAggregratedData().then(data => {
            setAggregateData(data);
        })
    }, [])

    useEffect(() => {
        console.log('datataatatas', props.url)
        if(props.url.length == 0){
            history.push('')
        }
    }, [])

    const toggleX = (e) => {
        const id = e.target.id;
        setLabelX(e.target.value);
        setYactive(id);
    }

    const toggleColor = (e) => {
        const id = e.target.id;
        setColor(id);
    }


    // const changeColumns = ( searchTerm, changeObject ) => {
    //     let tempURLData = [...graphData]
    //     for (var i in tempURLData) {
    //         if (tempURLData[i].url === searchTerm) {
    //             tempURLData[i].columns = JSON.parse(changeObject);
    //             setGraphData(tempURLData)
    //             break; //Stop this loop, we found it!
    //         }
    //     }
    // }
    
    const loadColumnData = () => {
        let promises = []
        // props.url.forEach(async (item) => {
        //     let apiurl = 'http://localhost:8000/api/columns/'
        //     let payload = {
        //         url: item.url
        //     }
        //     promises.push(
        //         axios.post(apiurl, payload, {
        //             cancelToken: source.token
        //         })
        //     )
        // })
        // Promise.all(promises).then(function (results) {
        //     results.forEach(function (res) {
        //         if(res.status === 200) {
        //             // changeColumns(url, res.data);
        //             console.log('graph data', res.data);
        //             // let temp = [...urlData];
        //             // seturlData(res.data);
        //         }
        //     });
        // });
    }

    // Graph Data
    useEffect(() => {
        if(labelX === "Duration of term") {
            const url = "http://frontend-exercise-api.herokuapp.com/justices/";
            axios.get(url).then((res) => {
                const data = res.data;
                console.log('graphData',data);
                setGraphData(data);
            });
        } else {
            loadColumnData()
        }
    }, [labelX])

    return (
        <div>
            <div className="division">
                <div className="division-header">
                    <h3>Aggregate Summary Stats</h3>
                    <button className="details-button">View Details</button>
                </div>
                <div className="division-body">
                    {
                        aggregateData.map((data, id) => {
                            return <Card data={data} key={id}/>
                        })
                    }
                </div>
            </div>
            <div className="division">
                <div className="division-header">
                    <h3>Scatter Plot</h3>
                    <div className="flex">
                        <h3>y-axis: </h3>
                        <span className="button-group">
                            <button className={"toggle-button " + (yactive === "0"? "active": "")} id="0" onClick={toggleX} value="# of cases judged"># of cases judged</button>
                            <button className={"toggle-button " + (yactive === "1"? "active": "")} id="1" onClick={toggleX} value="Duration of term">Duration of term</button>
                        </span>
                        <h3>Color: </h3>
                        <span className="button-group">
                            <button className={"toggle-button " + (color === "0"? "active": "")} id="0" onClick={toggleColor}>Millitary Experience</button>
                            <button className={"toggle-button " + (color === "1"? "active": "")} id="1" onClick={toggleColor}>Law School</button>
                            <button className={"toggle-button " + (color === "2"? "active": "")} id="2" onClick={toggleColor}>Party Appointed By</button>
                        </span>
                    </div>
                </div>
                <div className="division-body">
                    <Scatter xLabel={labelX} yLabel={"Date Joined"} data={graphData}/>
                </div>
            </div>
            <div className="division">
                <div className="division-header">
                    <h3>Cascading timeline</h3>
                </div>
                <div className="division-body">
                </div>
            </div>
        </div>
    );
};
 
export default DashBoard;