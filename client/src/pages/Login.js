import React from 'react'
import Layout from '../components/Layout/Layout';
import { Link } from "react-router-dom";


import gamer2 from '../images/gamer_2.png'

const Login = () => {
    
    return (
        <Layout>
            <div className="row">
            <div className="col">
        <h1 className="brand">
          <Link to="/" className="navbar-brand navbar-brand-black">TM</Link>
        </h1> 
        <h1>Login</h1>
        <form>
      
            <label for="emailInput" className="form-label">E-mail</label>
            <input type="email" className="form-control" id="emailInput" placeholder="name@domain.com"></input>
            
            <label for="passwordInput" className="form-label">Password</label>
            <input type="password" className="form-control" id="passwordInput" placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"></input>

         
            <input type="checkbox" className="form-check-input" id=""/>
                <label>Keep me logged in</label>
            <button  type="submit" className="btn btn-primary">Log in</button>
            <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
        </form>
        </div>
        <div className="col col-picture">
            <img src={gamer2} className="img-fluid"></img>
            </div>
        </div>
        </Layout>
    )
}

export default Login;