import * as ReactDOM from "react-dom";
import * as React from "react";
import {App} from "./app/src/App.tsx";

import {Router, Route, IndexRoute} from "react-router";
const createBrowserHistory = require('history/lib/createBrowserHistory')

ReactDOM.render((
  <Router history={createBrowserHistory()}>
    <Route component={App} path="/"/>
    <Route component={App} path="imdb"/>
  </Router>
), document.getElementById('root'));
