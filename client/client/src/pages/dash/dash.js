import React from 'react';
import NavBar from '../../components/navbar/navbar';

const DashBoard = (props) => {
  return (
    <div>
        <NavBar title={props.title} />
        <h1>Dash</h1>
    </div>
  );
};
 
export default DashBoard;