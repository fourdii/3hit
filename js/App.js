import React from "react";
import MainPage from "./MainPage.js";

import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";


export function App() {
  return (
    <div  className={'mainPage'}>
      <Router>       
        <Switch>
          <Route exact path="/">            
            <MainPage />
          </Route>               
        </Switch>
      </Router>
    </div>);
}


