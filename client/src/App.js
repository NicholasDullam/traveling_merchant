import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import logo from "./logo.svg";
import "./App.css";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProductListing from "./pages/ProductListing";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/login" >
        <Login></Login>
          </Route>
        <Route path="/signup">
    <Signup></Signup>
          </Route>

        <Route path="/listing">
          {/* ^ this is a dummy route path */}
          <ProductListing/>
          </Route>
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
