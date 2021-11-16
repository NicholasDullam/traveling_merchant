import {React, useState, useContext} from 'react'
import { Link, useHistory } from "react-router-dom";
import api from '../api'

import gamer2 from '../images/gamer_2.png'

import AuthContext from "../context/auth-context"

const Login = (props) => {
    const history = useHistory()
    const auth = useContext(AuthContext);

    var [email, setEmail] = useState("")
    var [password, setPassword] = useState("")

    function handleEmail(event) {
        setEmail(event.target.value)
    }

    function handlePassword(event) {
        setPassword(event.target.value)
    }

    function handleSubmit(e) {
        e.preventDefault()
        api.login({ email, password }).then((response) => {
            let { token, user } = response.data
            auth.login(token, user)
            handleRedirect()
        }).catch((error) => console.log("error: " + error))
    }

    const handleRedirect = () => {
        history.push(getRedirect() || '/')
    }

    const getRedirect = () => {
        return new URLSearchParams(props.location.search).get("redirect_uri")
    }

    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <div className="col" style={{ width: '50%', minWidth: '300px', padding: '5%', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', borderRadius: '0px 50px 50px 0px', zIndex: '1', boxShadow: '0 0px 20px 10px rgba(255,255,255,.1)'}}>
                <Link to="/" style={{ textDecoration: 'none', position: 'absolute', top: '50px', left: '50px', backgroundColor: 'black', padding: '12px', borderRadius: '15px' }}>
                    <h1 style={{ margin: '0px', padding: '0px' }} className="navbar-brand">
                        TM
                    </h1>
                </Link>
                <h1 style={{ marginBottom: '0px' }}>Login</h1>
                <form style={{ width: '100%', padding: '0% 10% 10% 10%' }}>
                    <label for="emailInput" className="form-label" style={{ marginTop: '10px' }}>E-mail</label>
                    <input type="email" className="form-control" id="emailInput" placeholder="name@domain.com" onChange={handleEmail}/>
                    
                    <label for="passwordInput" className="form-label" style={{ marginTop: '10px' }}>Password</label>
                    <input type="password" className="form-control" id="passwordInput" placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;" onChange={handlePassword}/>

                    <button type="button" className="btn btn-primary" onClick={handleSubmit} style={{ marginTop: '20px', width: '100%', borderRadius: '10px' }}>Sign In</button>
                    <p style={{ marginTop: '40px', marginBottom: '0px', textAlign: 'center' }}> <span style={{ opacity: '.5' }}>Don't have an account?</span> <Link style={{ highlight: 'none', color: 'inherit', textDecoration: 'none', marginLeft: '5px' }} to={`/signup${getRedirect() ? `?redirect_uri=${getRedirect()}` : ''}`}>Sign up</Link></p>
                </form>
            </div>
            <div style={{ width: 'calc(50% + 50px)', marginLeft: '-50px' }}>
                <img alt='gamer sidebar' src={gamer2} style={{ width: '100%', height: '100vh', objectFit: 'cover' }}/>
            </div>
        </div>
    )
}

export default Login;