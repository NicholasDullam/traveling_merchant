import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import React, { useState, useCallback, useEffect } from 'react';
import api from './api'
import "./App.scss";

import { Home, Login, Signup, Product, Checkout, Admin, Game, User, Games, Order, Messages } from './pages'
import { Messenger, Notifications } from './components'
import AuthContext from "./context/auth-context";
import Profile from './pages/Profile';
import MessengerContext from "./context/messenger-context";
import NotificationContext from "./context/notification-context";

function App() {
  // Auth attributes
  const [token, setToken] = useState(null)
  const [user, setUser] = useState(null)
  const [userId, setUserId] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLogging, setIsLogging] = useState(true)

  // Messenger attributes
  const [messengerOpen, setMessengerOpen] = useState(false)
  const [messengerThread, setMessengerThread] = useState(null)
  const [messengerThreadId, setMessengerThreadId] = useState(null)
  const [messengerThreads, setMessengerThreads] = useState([])
  const [messengerMessages, setMessengerMessages] = useState({})
  const [isConnected, setIsConnected] = useState(false)

  // Notification attributes
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [notifications, setNotifications] = useState([])

  const login = useCallback((token, user) => {
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

  const setActiveThreadId = (thread_id) => {
    let active = messengerThreads.find((thread) => thread.user._id === thread_id)
    setMessengerThread(active)
    setMessengerThreadId(active.user._id)
  }

  const setActiveThread = (thread) => {
    setMessengerThread(thread)
    setMessengerThreadId(thread.user._id)
  }

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
        <NotificationContext.Provider value={{
          isOpen: notificationsOpen,
          notifications: notifications,
          open: () => {
            setNotificationsOpen(true)
          },
          close: () => {
            setNotificationsOpen(false)
          },
          setNotifications
        }}>
          <MessengerContext.Provider value={{
            isOpen: messengerOpen,
            isConnected,
            threads: messengerThreads,
            activeThread: messengerThread,
            activeThreadId: messengerThreadId,
            messages: messengerMessages,
            connect: () => {
              setIsConnected(true)
            },
            open: (thread_id) => {
              setMessengerOpen(true)
              if (thread_id) {
                setActiveThreadId(thread_id)
              }
            },
            close: () => {
              setMessengerOpen(false)
            },
            setActiveThread: setActiveThread,
            setActiveThreadId: setActiveThreadId,
            setThreads: setMessengerThreads,
            setMessages: setMessengerMessages
          }}>
            <Router>
              { isLoggedIn ? <Messenger/> : null }
              { isLoggedIn ? <Notifications/> : null }
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
          </MessengerContext.Provider>
        </NotificationContext.Provider>
      </AuthContext.Provider>
  );
}

export default App;
