import React, {useState, useEffect} from 'react';
import { useHistory } from "react-router-dom";
import Card from '../../components/card/card';
import './dash.css';
import axios from 'axios';
import Loader from '../../components/loader/loader';
import { getAggregratedData, colorData } from '../../data/dash.js';
import Scatter from '../graph/graph';
import _, { filter } from 'underscore';
import { interpolate } from 'd3';


const DashBoard = (props) => {
    let[isLoading, setLoading] = useState(false)
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
            // history.push('')
        }
    }, [props.url])

    const toggleX = (e) => {
        const id = e.target.id;
        setLabelX(e.target.value);
        setYactive(id);
    }

    const toggleColor = (e) => {
        const id = e.target.id;
        setColor(id);
    }

    // Graph Data
    useEffect(() => {
        setLoading(true);
        if(labelX === "Duration of term") {
            const url = "http://frontend-exercise-api.herokuapp.com/justices/";
            axios.get(url).then((res) => {
                const data = res.data;
                let graphData = []
                data.forEach(element => {
                    let tempData = {}
                    let duration = Math.round((new Date(element.finish_date).getTime() - new Date(element.start_date).getTime())/(1000*365.25*24*60*60))
                    let start_date = element.start_date
                    if(duration < 0) {
                        tempData[start_date] = [0, element.name, element.military_service, element.law_school, element.nominating_party]
                    } else {
                        tempData[start_date] = [duration, element.name, element.military_service, element.law_school, element.nominating_party]
                    }
                    graphData.push(tempData)
                    setLoading(false);
                });
                console.log(graphData)
                setGraphData(graphData);
            });
        } else {
            const url = "http://localhost:8000/api/columns_graph_data/";
            const getGraphData = async () => {
                return await axios.get(url).then((res) => {
                    const data = res.data;
                    const dataArr = []
                    const filterData = data.map(a => a.fields);
                    // console.log(filterData)
                    const freq = filterData.reduce((a, { dateArgument }) => (
                        Object.assign(a, { [dateArgument]: (a[dateArgument] || 0) + 1 })
                    ), {})
                    console.log('freq   ' ,freq)
                    for (const [key, value] of Object.entries(freq)) {
                        const newData = {};
                        newData[new Date(key).toISOString().split('.')[0].toString()] = [value];
                        dataArr.push(newData);
                    }
                    delete dataArr.splice(0, 1)
                    console.log('dataArr   ' ,dataArr)
                    return dataArr
                });
            }
            getGraphData().then((data) => {
                setGraphData(data);
                setLoading(false);
            })
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
                        { 
                            labelX === "Duration of term" ?
                            <div className="colorSection">
                            <h3>Color: </h3>
                            <span className="button-group">
                                <button className={"toggle-button" + (color === "0"? "active millitary": "")} id="0" onClick={toggleColor}>Millitary Experience</button>
                                <button className={"toggle-button" + (color === "1"? "active law": "")} id="1" onClick={toggleColor}>Law School</button>
                                <button className={"toggle-button" + (color === "2"? "active party": "")} id="2" onClick={toggleColor}>Party Appointed By</button>
                            </span> 
                            </div>:
                            null
                        }
                    </div>
                </div>
                <div className="division-body">
                    {
                        isLoading ? <Loader /> :
                        <Scatter xLabel={labelX} yLabel={"Date Joined"} data={graphData} colorActive={colorData[color]} colorIndex={parseInt(color)+2}/>
                    }
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