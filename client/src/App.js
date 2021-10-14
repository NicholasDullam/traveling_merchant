import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import React, { useState, useCallback, useEffect } from 'react';
import api from './api'
import "./App.css";

import { Home, Login, Signup, ProductListing, Checkout } from './pages'
import AuthContext from "./context/auth-context";
import Messages from "./pages/Messages";
import Profile from './pages/Profile';
import Settings from "./components/Settings/Settings";
import AccountInfo from "./pages/AccountInfo";
import Favorites from "./pages/Favorites";
import Reviews from './pages/Reviews';
import ViewingHistory from './pages/ViewingHistory';
import Orders from "./pages/Orders";
import Billing from './pages/Billing';
import Preferences from "./pages/Preferences";
import QueryResultsPage from "./pages/QueryResultsPage";

let logoutTimer;

var logged = false;


function App() {
  const [token, setToken] = useState(null)
  const [user, setUser] = useState(null)
  const [userId, setUserId] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLogging, setIsLogging] = useState(true)

  const login = useCallback((token, user) => {
      console.log(token, user)
      setToken(token)
      setUser(user)
      setUserId(user._id)
      setIsLoggedIn(true)
  }, []);

  const logout = useCallback(() => {
      setToken(null)
      setUser(null)
      setUserId(null)
      setIsLoggedIn(false)
  }, []);

  useEffect(() => {
    setIsLogging(true)
    api.verifyToken().then((response) => {
        let { token, user } = response.data
        login(token, user)
        setIsLogging(false)
    }).catch((error) => {
        setIsLogging(false)
    })
  }, []);

  return (
    <AuthContext.Provider
    value={{
      token,
      user,
      userId,
      isLoggedIn,
      login,
      logout
    }}>
      {/* If (token) to restrict access to routes from unlogged users */}
    <Router>
      <Switch>

       <Route path="/favorites" >
        <Favorites/>
        </Route> 

        <Route path="/query_results" >
        <QueryResultsPage/>
        </Route> 
        <Route path="/reviews" >
        <Reviews/>
        </Route>
        <Route path="/viewing_history" >
        <ViewingHistory/>
        </Route>
        <Route path="/orders" >
        <Orders/>
        </Route>
        <Route path="/billing" >
        <Billing/>
        </Route>
        <Route path="/preferences" >
        <Preferences/>
        </Route>
      <Route path="/account_info" >
        <AccountInfo/>
        </Route>
      <Route path="/messages" >
        <Messages/>
        </Route>
        <Route path="/profile" >
        <Profile/>
        </Route>

      {/* If (token) to restrict access to routes from unlogged users */}
      { !isLogging ? <Switch>
          <Route path="/login" component={Login}/>
          <Route path="/signup" component={Signup}/>
          <Route path="/listing" component={ProductListing}/>
          <Route path="/checkout/:order_id" component={Checkout}/>
          <Route path="/logout" />
          <Route path="/game" />
          <Route path="/user" />
          <Route path="/" component={Home}/>
          </Switch>
       : null }
       </Switch>
      </Router> :
    
    </AuthContext.Provider>
  );
}

export default App;
