import React, {useState, useEffect} from 'react';
import NavBar from '../../components/navbar/navbar';
import Card from '../../components/card/card';
import './dash.css';
import axios from 'axios';
import { aggregatedData } from '../../data/dash.js';


const DashBoard = (props) => {
    const [data, setData] = useState(aggregatedData);

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
                            obj.value = value.max
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
        </div>
    );
};
 
export default DashBoard;