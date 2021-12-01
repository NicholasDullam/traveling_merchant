import react from 'react';
import { AnimatePresence } from 'framer-motion';
import { BrowserRouter as Router, Switch, Route, useLocation  } from "react-router-dom";
import { Messenger, Notifications } from '../../components'
import NotFoundPage from "../../pages/404";
import Profile from '../../pages/Profile';

import { Home, Login, Signup, Product, Checkout, Admin, Game, User, Games, Order, Messages } from '../../pages'


const MyRouter = (props) =>{

    const location= useLocation();

    return (
        <div>
        { props.isLoggedIn ? <Messenger/> : null }
        { props.isLoggedIn ? <Notifications/> : null }
        <Switch location={location}>
          { !props.isLogging ? <Switch>
              {/* Do not contain sub-routes */}
              <Route path="/login" exact component={Login}/>
              <Route path="/signup" exact component={Signup}/>
              <Route path="/messages" exact component={Messages}/>
              <Route path="/games/:game_id" exact component={Game}/>
              <Route path="/orders/:order_id" exact component={Order}/>
              <Route path="/orders/:order_id/checkout" exact component={Checkout}/>
              <Route path="/users/:user_id" component={User}/>
              <Route path="/products/:product_id" exact component={Product}/>
              <Route path="/games" exact component={Games}/>

              {/* Contain sub-routes */}
              <Route path="/profile" component={Profile}/>
              <Route path="/admin" component={Admin}/>
              <Route exact path="/" component={Home}/>
              <Route component={NotFoundPage} />
            </Switch> : null }
        </Switch>
        </div>
    )
}

export default MyRouter;