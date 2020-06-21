import React from "react"
import { Route } from "react-router-dom"
import BaseTemplate from "./pages/base/base";
import DashBoard from "./pages/dash/dash";

const Routes = () => {
  return (
    <div>
      <Route exact path="/" component={() => <BaseTemplate title={'ArbiLex'} />} />
      <Route exact path="/dash" component={() => <DashBoard title={'ArbiLex'} />} />
    </div>
  )
}

export default Routes