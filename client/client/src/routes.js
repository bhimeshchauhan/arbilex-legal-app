import React from "react"
import { Route, useLocation } from "react-router-dom";
import BaseTemplate from "./pages/base/base";
import DashBoard from "./pages/dash/dash";

const Routes = () => {
  return (
    <div>
      <Route exact path="/" component={() => <BaseTemplate title={'ArbiLex'} useLocation={useLocation.pathname} />} />
      <Route exact path="/dash" component={() => <DashBoard title={'ArbiLex'} useLocation={useLocation.pathname} />} />
    </div>
  )
}

export default Routes