import React from 'react';
import NavBar from '../../components/navbar/navbar';
import Card from '../../components/card/card';
import './dash.css';

const DashBoard = (props) => {
  return (
    <div>
        <NavBar title={props.title} />
        <div className="division">
            <div className="division-header">
                <h3>Aggregate Summary Stats</h3>
                <button className="details-button">View Details</button>
            </div>
            <div className="division-body">
                <Card />
                <Card />
                <Card />
                <Card />
                <Card />
            </div>
        </div>
    </div>
  );
};
 
export default DashBoard;