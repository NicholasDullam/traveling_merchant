import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import React, { useState, useCallback, useEffect } from 'react';
import api from './api'
import "./App.css";

import { Home, Login, Signup, Product, Checkout, Admin, Game, User, Games } from './pages'
import AuthContext from "./context/auth-context";
import Messages from "./pages/Messages";
import Profile from './pages/Profile';

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

      <Route path="/messages" >
        <Messages/>
        </Route>

      {/* If (token) to restrict access to routes from unlogged users */}
      { !isLogging ? <Switch>
          <Route path="/login" component={Login}/>
          <Route path="/signup" component={Signup}/>
          <Route path="/profile" component={Profile}/>
          <Route path="/checkout/:order_id" component={Checkout}/>
          <Route path="/games/:game_id" component={Game}/>
          <Route path="/users/:user_id" component={User}/>
          <Route path="/products/:product_id" component={Product} />
          <Route path="/games" component={Games}/>
          <Route path="/admin" component={Admin}/>
          <Route path="/" component={Home}/>
          </Switch>
       : null }
       </Switch>
      </Router> :
    
    </AuthContext.Provider>
  );
}

export default App;
