import React, { useState, useEffect } from 'react';
import { Route } from "react-router-dom";
import BaseTemplate from "./pages/base/base";
import DashBoard from "./pages/dash/dash";
import NavBar from './components/navbar/navbar';

const Routes = () => {
  const[mainData, setMainData] = useState([])
  const[url, setURL] = useState([])


  const updateCol = (columns) => {
    console.log('columns', columns);
    setMainData(prevState => [...prevState, JSON.parse(columns)]);
  };


  const updateURL = (url) => {
    console.log('url', url)
    setURL(url);
  };
 
  return (
    <div className="home">
      <NavBar title={'ArbiLex'} />
      <Route exact path="/" render={() => <BaseTemplate updateCol={updateCol} updateURL={updateURL}/>} />
      <Route exact path="/dash" render={() => <DashBoard mainData={mainData} url={url}/>} />
    </div>
  )
};

export default Routes