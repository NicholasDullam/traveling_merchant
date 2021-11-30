import React from 'react'
import { Link } from "react-router-dom";

import './CookieCard.css'

const CookieCard = (props) => {
    return (

        <div class="cookie-card">
<p> We use cookies to improve your experience. </p>
<div class="row">
<div class="col"><Link to="/profile/preferences">Manage cookies</Link>
</div>
<div class="col">
<button class="btn btn-primary">Accept & Continue
    </button> 
    </div>
           </div>
           </div>
    )
}

export default CookieCard;