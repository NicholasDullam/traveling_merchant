import React from 'react'
import Layout from '../components/Layout/Layout';
import { Link } from "react-router-dom";


import gamer1 from '../images/gamer_1.png'

const Signup = () => {
    
    return (
        <Layout>
            <div className="row">
            <div className="col">
        <h1 className="brand">
          <Link to="/" className="navbar-brand navbar-brand-black">TM</Link>
        </h1> 
        <h1>Sign up</h1>
        <form>
            <label for="nameInput" className="form-label">Name</label>
            <input type="text" className="form-control" id="nameInput" placeholder="John Doe"></input>

            <label for="emailInput" className="form-label">E-mail</label>
            <input type="email" className="form-control" id="emailInput" placeholder="name@domain.com"></input>
            
            <label for="passwordInput" className="form-label">Password</label>
            <input type="password" className="form-control" id="passwordInput" placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"></input>

            <label for="reenterPasswordInput" className="form-label">Re-enter password</label>
            <input type="password" className="form-control" id="reenterPasswordInput" placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;" ></input>

            <input type="checkbox" className="form-check-input" ></input>
            <label> Agree to Terms and Conditions</label>
            <input type="checkbox" className="form-check-input" id=""/>
                <label>Sign up for newsletter and exclusive discounts</label>
            <button  type="submit" className="btn btn-primary">Sign up</button>
            <p>Already have an account? <Link to="/login">Log in</Link></p>
        </form>
        </div>
        <div className="col col-picture">
            <img src={gamer1} className="img-fluid"></img>
            </div>
        </div>
        </Layout>
    )
}

export default Signup;