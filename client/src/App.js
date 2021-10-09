import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import logo from "./logo.svg";
import "./App.css";

import Home from "./pages/Home";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/login" />
        <Route path="/logout" />
        <Route path="/game" />
        <Route path="/user" />
        {/* path="/" must be the last route, before closing Switch tag */}
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
