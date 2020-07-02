import React, {useState, useEffect} from 'react';
import { useHistory } from "react-router-dom";
import Card from '../../components/card/card';
import './dash.css';
import axios from 'axios';
import Loader from '../../components/loader/loader';
import { getAggregratedData, colorData } from '../../data/dash.js';
import Scatter from '../graph/graph';
import Cascade from '../cascade/cascade';


const DashBoard = (props) => {
    let[isLoading, setLoading] = useState(false)
    const [aggregateData, setAggregateData] = useState([]);
    const [yactive, setYactive] = useState("1")
    const [color, setColor] = useState("0")
    const [labelX, setLabelX] = useState("Duration of term")
    const [justiceData, setJusticeData] = useState([])
    const [caseFreqData, setCaseFreqData] = useState([])
    const [caseData, setCaseData] = useState([])
    let history = useHistory();
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();

    useEffect(() => {
        getAggregratedData().then(data => {
            setAggregateData(data);
        })
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

    // Graph Data
    useEffect(() => {
        setLoading(true);
        const url = "http://localhost:8000/api/columns_graph_data/";
        const getGraphData = async () => {
            return await axios.get(url).then((res) => {
                const data = res.data;
                setCaseData(data);
                const dataArr = []
                const filterData = data.map(a => a.fields);
                const freq = filterData.reduce((a, { dateArgument }) => (
                    Object.assign(a, { [dateArgument]: (a[dateArgument] || 0) + 1 })
                ), {})
                for (const [key, value] of Object.entries(freq)) {
                    const newData = {};
                    newData[new Date(key).toISOString().split('.')[0].toString()] = [value];
                    dataArr.push(newData);
                }
                delete dataArr.splice(0, 1)
                return dataArr
            });
        }
        getGraphData().then((data) => {
            setCaseFreqData(data);
            setLoading(false);
        })
    }, [])

    useEffect(() => {
        setLoading(true);
        const url = "http://frontend-exercise-api.herokuapp.com/justices/";
        axios.get(url).then((res) => {
            const data = res.data;
            let justiceData = []
            data.forEach(element => {
                let tempData = {}
                let duration = Math.round((new Date(element.finish_date).getTime() - new Date(element.start_date).getTime())/(1000*365.25*24*60*60))
                let start_date = element.start_date
                if(duration < 0) {
                    tempData[start_date] = [0, element.name, element.military_service, element.law_school, element.nominating_party]
                } else {
                    tempData[start_date] = [duration, element.name, element.military_service, element.law_school, element.nominating_party]
                }
                justiceData.push(tempData)
            });
            setJusticeData(justiceData);
        });
    }, [])

    // Loader
    useEffect(() => {
        if(justiceData.length !== 0 && caseData.length !== 0){
            setLoading(false);
        }
    }, [justiceData, caseData])

    return (
        <div>
            <div className="division">
                <div className="division-header">
                    <h3>Aggregate Summary Stats</h3>
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
                        <div className="colorSection" style={labelX !== "Duration of term" ?{'visibility': 'hidden'}:{'visibility': 'visible'}}>
                            <h3>Color: </h3>
                            <span className="button-group">
                                <button className={"toggle-button" + (color === "0"? "active millitary": "")} id="0" onClick={toggleColor}>Millitary Experience</button>
                                <button className={"toggle-button" + (color === "1"? "active law": "")} id="1" onClick={toggleColor}>Law School</button>
                                <button className={"toggle-button" + (color === "2"? "active party": "")} id="2" onClick={toggleColor}>Party Appointed By</button>
                            </span> 
                        </div>
                    </div>
                </div>
                <div className="division-body">
                    {
                        isLoading ? <Loader /> :
                        <Scatter xLabel={labelX} yLabel={"Date Joined"} data={labelX === "Duration of term" ? justiceData: caseFreqData} colorActive={colorData[color]} colorIndex={parseInt(color)+2}/>
                    }
                </div>
            </div>
            <div className="division">
                <div className="division-header">
                    <h3>Cascading timeline</h3>
                </div>
                <div className="division-body">
                    {
                        isLoading ? <Loader /> :
                        <Cascade xLabel={labelX} yLabel={"Date Joined"} data={caseData} colorActive={colorData[color]} colorIndex={parseInt(color)+2}/>
                    }
                </div>
            </div>
        </div>
    );
};
 
export default DashBoard;