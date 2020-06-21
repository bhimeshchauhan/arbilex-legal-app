import React from 'react';
import NavBar from '../../components/navbar/navbar';
import Card from '../../components/card/card';

const DashBoard = (props) => {
  return (
    <div>
        <NavBar title={props.title} />
        <Card />
    </div>
  );
};
 
export default DashBoard;