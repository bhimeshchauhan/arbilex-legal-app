import React, { useState, useEffect } from 'react';
import { Route } from "react-router-dom";
import BaseTemplate from "./pages/base/base";
import DashBoard from "./pages/dash/dash";
import NavBar from './components/navbar/navbar';

const Routes = () => {
  const[url, setURL] = useState([])

  const updateURL = (url) => {
    console.log('url', url)
    setURL(url);
  };
 
  return (
    <div className="home">
      <NavBar title={'ArbiLex'} />
      <Route exact path="/" render={() => <BaseTemplate updateURL={updateURL}/>} />
      <Route exact path="/dash" render={() => <DashBoard url={url}/>} />
    </div>
  )
};

export default Routes