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
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ width: window.innerWidth < 600 ? '100%' : '800px', padding: '5%', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', borderRadius: '0px 50px 50px 0px', zIndex: '1', boxShadow: '0 0px 20px 10px rgba(255,255,255,.1)'}}>
                <Link to="/" style={{ textDecoration: 'none', position: 'absolute', top: '50px', left: '50px', backgroundColor: 'black', padding: '12px', borderRadius: '15px' }}>
                    <h1 style={{ margin: '0px', padding: '0px' }} className="navbar-brand">
                        TM
                    </h1>
                </Link>
                <h1 style={{ marginBottom: '20px' }}> Sign Up </h1>
                <form style={{ width: '100%', padding: '0% 10% 10% 10%' }}>
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
                    <label for="emailInput" className="form-label" style={{ marginTop: '10px' }}>Email</label>
                    <input type="email" className="form-control" id="emailInput" placeholder="name@domain.com" onChange={handleEmail}></input>
                    
                    <label for="passwordInput" className="form-label" style={{ marginTop: '10px' }}>Password</label>
                    <input type="password" className="form-control" id="passwordInput" placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;" onChange={handlePassword}></input>

                    <label for="reenterPasswordInput" className="form-label" style={{ marginTop: '10px' }}>Confirm password</label>
                    <input type="password" className="form-control" id="reenterPasswordInput" placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;" onChange={handleVerifyPassword}></input>

                    <button type="button" className="btn btn-primary" onClick={handleSubmit} style={{ marginTop: '20px', width: '100%', borderRadius: '10px' }}>Create Account</button>
                    <p style={{ marginTop: '40px', marginBottom: '0px', textAlign: 'center' }}> <span style={{ opacity: '.5' }}>Already have an account?</span> <Link style={{ highlight: 'none', color: 'inherit', textDecoration: 'none', marginLeft: '5px' }} to={`/login${getRedirect() ? `?redirect_uri=${getRedirect()}` : ''}`}>Login</Link></p>
                </form>
            </div>
            { window.innerWidth >= 600 ? <div style={{ width: 'calc(100%)', marginLeft: '-50px' }}>
                <img alt='gamer sidebar' src={gamer1} style={{ width: '100%', height: '100vh', objectFit: 'cover' }}/>
            </div> : null }
        </div>
    )
}

export default Signup;