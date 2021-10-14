import {React, useState, useContext} from 'react'
import Layout from '../components/Layout/Layout';
import { Link } from "react-router-dom";
import api from '../api'

import gamer2 from '../images/gamer_2.png'

import AuthContext from "../context/auth-context"

const Login = () => {
    const auth = useContext(AuthContext);
    // let user = JSON.parse(sessionStorage.getItem('data'));
    // const token = user.data.id;
    console.log(localStorage);

    var [email, setEmail] = useState("")
    var [password, setPassword] = useState("")

    function handleEmail(event) {
        console.log(email);
        setEmail(event.target.value)
    }

    function handlePassword(event) {
        console.log(password);
        setPassword(event.target.value)
    }

    function handleSubmit(e) {
        console.log("handle submit!")
        e.preventDefault()
        api.login({ email, password }).then((response) => {
            if(response.status == 200) auth.login()
        }).catch((error) => console.log("error: " + error))
    }

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
            <input type="email" className="form-control" id="emailInput" placeholder="name@domain.com"
            onChange={handleEmail}></input>
            
            <label for="passwordInput" className="form-label">Password</label>
            <input type="password" className="form-control" id="passwordInput" placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
             onChange={handlePassword}></input>

         
            <input type="checkbox" className="form-check-input" id=""/>
                <label>Keep me logged in</label>
            <button  type="button" className="btn btn-primary" onClick={handleSubmit}>Log in</button>
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