import React, { useContext, useState } from "react";
import { useHistory } from "react-router";
import api from "../api";
import AuthContext from "../context/auth-context";

const Info = (props) => {
    const auth = useContext(AuthContext)
    const history = useHistory()

    const [first, setFirst] = useState(auth.user.first)
    const [last, setLast] = useState(auth.user.last)
    const [email, setEmail] = useState(auth.user.email)

    function handleFirst(e) {
        setFirst(e.target.value)
    }

    function handleLast(e) {
        setLast(e.target.value)
    }

    function handleEmail(e) {
        setEmail(e.target.value)
    }

    function handleSubmit(e) {
        api.updateUserById(auth.user._id, { first, last, email }).then((response) => {
            auth.login(auth.token, response.data)
        }).catch((error) => {
            console.log(error)
        })
    }

    const handleSeller = () => {
        api.createAccount().then(async(response) => {
            let onboarding = await api.getAccountOnboarding(response.data.acct_id)
            window.location.href = onboarding.data.url
        }).catch((error) => {
            console.log(error)
        })
    }

    const handleContinueSeller = () => {
        api.getAccountOnboarding(auth.user.acct_id).then((response) => {
            window.location.href = response.data.url
        }).catch((error) => {
            console.log(error)
        })
    }

    return (
        <div>
            <div style={{ maxWidth: '600px'}}>
                <h5 style={{ marginBottom: '20px' }}> Account Info </h5>
                <div style={{ display: 'flex'}}>
                    <div style={{ marginRight: '10px', width: '100%' }}>
                        <label for="usernameInput" className="form-label">First Name</label>
                        <input value={first} type="text" className="form-control" id="usernameInput" placeholder="John"
                        onChange={handleFirst}/>
                    </div>
                    <div style={{ width: '100%' }}>
                        <label for="usernameInput" className="form-label">Last Name</label>
                        <input value={last} type="text" className="form-control" id="usernameInput" placeholder="Doe"
                        onChange={handleLast}/>
                    </div>
                </div>

                <label style={{ marginTop: '10px' }} for="emailInput" className="form-label">E-mail</label>
                <input type="email" value={email} className="form-control" id="emailInput" placeholder="name@domain.com"
                onChange={handleEmail}></input>
            </div>
            <div style={{ display: 'flex', marginTop: '20px' }}>
                <button type="button" className="btn btn-primary" onClick={handleSubmit} style={{ marginRight: '10px' }}>Save</button>
                { !auth.user.acct_id ? <button type="button" className="btn btn-primary" onClick={handleSeller}> Become a Seller </button> : null }
                { auth.user.acct_id && !auth.user.acct_details_submitted ? <button type="button" className="btn btn-primary" onClick={handleContinueSeller}> Continue Onboarding </button> : null }
            </div>
        </div>
    )
}
export default Info