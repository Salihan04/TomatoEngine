import * as ReactDOM from "react-dom";
import * as React from "react";
import {App} from "./app/src/App.tsx";
import {MovieApp} from "./app/src/MovieApp.tsx";
import {StatsApp} from "./app/src/StatsApp.tsx";

import {Router, Route, IndexRoute} from "react-router";
const createBrowserHistory = require('history/lib/createBrowserHistory')

ReactDOM.render((
  <Router history={createBrowserHistory()}>
    <Route component={MovieApp} path="/"/>
    <Route component={MovieApp} path="movie"/>
    <Route component={App} path="review"/>
    <Route component={StatsApp} path="stats"/>
  </Router>
), document.getElementById('root'));
