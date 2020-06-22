import React, {useState, useEffect} from 'react';
import NavBar from '../../components/navbar/navbar';
import Card from '../../components/card/card';
import './dash.css';
import axios from 'axios';
import { aggregatedData } from '../../data/dash.js';
import Scatter from '../graph/graph';
import _ from 'underscore';


const DashBoard = (props) => {
    const [data, setData] = useState(aggregatedData);
    const [yactive, setYactive] = useState("1")
    const [color, setColor] = useState("0")
    const [labelX, setLabelX] = useState("Duration of term")

    const prepareAggregatedData = async () => {
        await axios.get('http://localhost:8000/api/justices_data/')
        .then((response) => {
            const res = response.data.data
            var stateCopy = Object.assign([], data);
            Object.keys(res).forEach(key => {
                let value = res[key];
                // Filter the item from aggregateddata to b edited
                stateCopy.forEach(obj => {
                    if(obj['id'] === key) {
                        if(typeof value === 'number') {
                            obj.value = value
                        } else {
                            obj.value = (_.invert(value.data))[value.max]
                        }
                    }
                })
            });
            setData(stateCopy)
        });
    }
    
    useEffect(() => {
        
        prepareAggregatedData();
    }, []);

    const toggleX = (e) => {
        const id = e.target.id;
        setLabelX(e.target.value);
        setYactive(id);
    }

    const toggleColor = (e) => {
        const id = e.target.id;
        setColor(id);
    }

    return (
        <div>
            <NavBar title={props.title} />
            <div className="division">
                <div className="division-header">
                    <h3>Aggregate Summary Stats</h3>
                    <button className="details-button">View Details</button>
                </div>
                <div className="division-body">
                    {
                        data.map((data, id) => {
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
                    <Scatter xLabel={labelX} yLabel={"Date Joined"}/>
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