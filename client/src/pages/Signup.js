import React, { useState } from 'react'
import Layout from '../components/Layout/Layout';
import { Link } from "react-router-dom";


import gamer1 from '../images/gamer_1.png'

const Signup = () => {
    var [username, setUsername] = useState("")
    var [email, setEmail] = useState("")
    var [password, setPassword] = useState("")

    function handleUsername (e) {
setUsername(e.target.value)
    }

    function handleEmail (e) {
        setEmail(e.target.value)

    }
      
    function handlePassword (e) {
        setPassword(e.target.value)
    }

    function verifyPassword (e) {
            if(password == e) {
                //they match
            }
            else {
                //error message
            }

    }


    

    function handleSubmit(e) {
   }



    return (
        <Layout>
            <div className="row">
            <div className="col">
        <h1 className="brand">
          <Link to="/" className="navbar-brand navbar-brand-black">TM</Link>
        </h1> 
        <h1>Sign up</h1>
        <form>
            <label for="nameInput" className="form-label">username</label>
            <input type="text" className="form-control" id="nameInput" placeholder="John_Doe" onChange={handleUsername}></input>

            <label for="emailInput" className="form-label">E-mail</label>
            <input type="email" className="form-control" id="emailInput" placeholder="name@domain.com" onChange={handleEmail}></input>
            
            <label for="passwordInput" className="form-label">Password</label>
            <input type="password" className="form-control" id="passwordInput" placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;" onChange={handlePassword}></input>

            <label for="reenterPasswordInput" className="form-label">Re-enter password</label>
            <input type="password" className="form-control" id="reenterPasswordInput" placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;" onChange={verifyPassword}></input>

            <input type="checkbox" className="form-check-input" ></input>
            <label> Agree to Terms and Conditions</label>
            <input type="checkbox" className="form-check-input" id=""/>
                <label>Sign up for newsletter and exclusive discounts</label>
            <button  type="button" className="btn btn-primary" onClick={handleSubmit}>Sign up</button>
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