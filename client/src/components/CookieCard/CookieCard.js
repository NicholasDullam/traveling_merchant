import React, {useState, useContext} from 'react'
import { Link } from "react-router-dom";
import AuthContext from "../../context/auth-context"




import './CookieCard.css'

const CookieCard = (props) => {
    const auth = useContext(AuthContext)

const handleButton = () => {
    // setIsVisible(false);
    auth.changeCookies()



}

    const CookieCard =  <div class="cookie-card">
    <p> We use cookies to improve your experience. </p>
    <div class="row">
    <div class="col"><Link to="/profile/preferences">Manage cookies</Link>
    </div>
    <div class="col">
    <button class="btn btn-primary" onClick={handleButton}>Accept & Continue
        </button> 
        </div>
               </div>
               </div>




    return (
        <>
       { !auth.hasCookies ? 
       CookieCard: null}
    </>
    )

}

export default CookieCard;