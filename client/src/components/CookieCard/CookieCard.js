import React, {useState} from 'react'
import { Link } from "react-router-dom";

import './CookieCard.css'

const CookieCard = (props) => {

    const [isVisible, setIsVisible] = useState(true);

const handleButton = () => {
    setIsVisible(false);



}

    return (
        <>
       { isVisible ? 
        <div class="cookie-card">
<p> We use cookies to improve your experience. </p>
<div class="row">
<div class="col"><Link to="/profile/preferences">Manage cookies</Link>
</div>
<div class="col">
<button class="btn btn-primary" onClick={handleButton}>Accept & Continue
    </button> 
    </div>
           </div>
           </div> : null}
    </>
    )

}

export default CookieCard;