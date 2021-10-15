import React, { useState, useContext } from 'react'
import Layout from '../components/Layout/Layout';
import { Link, useHistory } from "react-router-dom";
import AuthContext from "../context/auth-context"
import api from '../api'

import gamer1 from '../images/gamer_1.png'

const Signup = (props) => {
    const auth = useContext(AuthContext);
    const history = useHistory()

    var [first, setFirst] = useState('')
    var [last, setLast] = useState('')
    var [email, setEmail] = useState('')
    var [password, setPassword] = useState('')
    var [verifyPassword, setVerifyPassword] = useState('')

    function handleFirst (e) {
        setFirst(e.target.value)
    }

    function handleLast (e) {
        setLast(e.target.value)
    }

    function handleEmail (e) {
        setEmail(e.target.value)
    }
      
    function handlePassword (e) {
        setPassword(e.target.value)
    }

    function handleVerifyPassword (e) {
        setVerifyPassword(e.target.value)
    }

    const handleSubmit = () => {
        if (password !== verifyPassword) return
        api.createUser({ first, last, email, password }).then((response) => {
            let { token, user } = response.data
            auth.login(token, user)
            handleRedirect()
        }).catch((error) => {
            console.log(error)
        })
    }

    const handleRedirect = () => {
        history.push(getRedirect() || '/')
    }

    const getRedirect = () => {
        return new URLSearchParams(props.location.search).get("redirect_uri")
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
            <div style={{ marginTop: '10px', display: 'flex' }}>
                <div style={{ width: '100%', marginRight: '10px' }}>
                    <label for="nameInput" className="form-label">First Name</label>
                    <input type="text" className="form-control" id="nameInput" placeholder="John" onChange={handleFirst}></input>
                </div>
                <div style={{ width: '100%' }}>
                    <label for="nameInput" className="form-label">Last Name</label>
                    <input type="text" className="form-control" id="nameInput" placeholder="Doe" onChange={handleLast}></input>
                </div>
            </div>
            <label for="emailInput" className="form-label" style={{ marginTop: '10px' }}>E-mail</label>
            <input type="email" className="form-control" id="emailInput" placeholder="name@domain.com" onChange={handleEmail}></input>
            
            <label for="passwordInput" className="form-label" style={{ marginTop: '10px' }}>Password</label>
            <input type="password" className="form-control" id="passwordInput" placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;" onChange={handlePassword}></input>

            <label for="reenterPasswordInput" className="form-label" style={{ marginTop: '10px' }}>Re-enter password</label>
            <input type="password" className="form-control" id="reenterPasswordInput" placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;" onChange={handleVerifyPassword}></input>

            {/*<input type="checkbox" className="form-check-input" ></input>
            <label> Agree to Terms and Conditions</label>
            <input type="checkbox" className="form-check-input" id=""/>
    <label>Sign up for newsletter and exclusive discounts</label>*/}
            <button  type="button" className="btn btn-primary" onClick={handleSubmit} style={{ marginTop: '20px' }}>Sign up</button>
            <p style={{ marginTop: '10px' }}> Already have an account? <Link to={`/login${getRedirect() ? `?redirect_uri=${getRedirect()}` : ''}`}>Log in</Link></p>
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