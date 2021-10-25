import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import React, { useState, useCallback, useEffect } from 'react';
import api from './api'
import "./App.scss";

import { Home, Login, Signup, Product, Checkout, Admin, Game, User, Games, Order } from './pages'
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
        <Router>
          <Switch>
            { !isLogging ? <Switch>
                {/* Do not contain sub-routes */}
                <Route path="/login" exact component={Login}/>
                <Route path="/signup" exact component={Signup}/>
                <Route path="/messages" exact component={Messages}/>
                <Route path="/games/:game_id" exact component={Game}/>
                <Route path="/orders/:order_id" exact component={Order}/>
                <Route path="/orders/:order_id/checkout" exact component={Checkout}/>
                <Route path="/users/:user_id" exact component={User}/>
                <Route path="/products/:product_id" exact component={Product}/>
                <Route path="/games" exact component={Games}/>

                {/* Contain sub-routes */}
                <Route path="/profile" component={Profile}/>
                <Route path="/admin" component={Admin}/>
                <Route path="/" component={Home}/>
              </Switch> : null }
          </Switch>
        </Router>
      </AuthContext.Provider>
  );
}

export default App;
