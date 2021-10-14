import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import React, { useState, useCallback, useEffect } from 'react';
import api from './api'
import "./App.css";

import { Home, Login, Signup, ProductListing, Checkout, Admin } from './pages'
import AuthContext from "./context/auth-context";

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
      { !isLogging ? <Router>
        <Switch>
          <Route path="/login" component={Login}/>
          <Route path="/signup" component={Signup}/>
          <Route path="/listing" component={ProductListing}/>
          <Route path="/checkout/:order_id" component={Checkout}/>
          <Route path="/admin" component={Admin}/>
          <Route path="/logout" />
          <Route path="/game" />
          <Route path="/user" />
          {/* path="/" must be the last route, before closing Switch tag */}
          <Route path="/" component={Home}/>
        </Switch>
      </Router> : null }
    </AuthContext.Provider>
  );
}

export default App;
