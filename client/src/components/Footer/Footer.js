import React from "react";
import { Link } from "react-router-dom";

import '../Footer/Footer.css'

const Footer = (props) => {

    return (
        <div className="footer">
        
        <div clas="row">
            <div class="col">
          <h1 className="brand">
          <Link to="/" className="navbar-brand">TM</Link>
        </h1>
        </div>
        <div class="col">
            <p>Games</p>
            <p>Escape from Tarkov</p>
        </div>
        </div>




        <p> Traveling Merchant. All rights reserved.</p>
        </div>
    )

}

export default Footer