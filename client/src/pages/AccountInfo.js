import React from "react";
import Settings from "../components/Settings/Settings";
import ProfileIcon from '../images/profile_icon.png'

const AccountInfo = (props) => {

    function handleUsername(e) {

    }
    function handleSubmit(e) {

    }

    function handleEmail(e) {
        
    }

    function handlePassword(e) {
        
    }

    return (
        <Settings>
            Account information
        <img src={ProfileIcon}></img>
        <button>Upload</button>
        <button>Remove</button>
<form>
        <label for="usernameInput" className="form-label">Username</label>
            <input type="text" className="form-control" id="usernameInput" placeholder="username"
            onChange={handleUsername}></input>

        <label for="emailInput" className="form-label">E-mail</label>
            <input type="email" className="form-control" id="emailInput" placeholder="name@domain.com"
            onChange={handleEmail}></input>


        <p> Change password</p>
        <label for="passwordInput" className="form-label">Password</label>
            <input type="password" className="form-control" id="passwordInput" placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
             onChange={handlePassword}></input>

<button  type="button" className="btn btn-primary" onClick={handleSubmit}>Submit</button>
        

</form>

        </Settings>
    )
}
export default AccountInfo