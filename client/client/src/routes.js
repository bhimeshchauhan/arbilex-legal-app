import React, { useState, useEffect } from 'react';
import { Route } from "react-router-dom";
import BaseTemplate from "./pages/base/base";
import DashBoard from "./pages/dash/dash";
import NavBar from './components/navbar/navbar';

const Routes = () => {
  const[mainData, setMainData] = useState([])


  const updateData = (columns) => {
    setMainData(prevState => [...prevState, JSON.parse(columns)]);
  };
 
  return (
    <div className="home">
      <NavBar title={'ArbiLex'} />
      <Route exact path="/" render={() => <BaseTemplate updateData={updateData}/>} />
      <Route exact path="/dash" render={() => <DashBoard mainData={mainData}/>} />
    </div>
  )
};

export default Routes