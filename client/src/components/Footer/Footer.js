import React from "react";
import { Link } from "react-router-dom";

import '../Footer/Footer.css'

const Footer = (props) => {

    return (
        <div className="footer" style={{ padding: '40px' }}>   
            <div clas="row">
                <div class="col">
                    <h1 className="brand">
                        <Link to="/" className="navbar-brand">TM</Link>
                    </h1>
                </div>
                <div class="col">
                    <p><b>Games</b></p>
                    <p>League of Legends</p>
                    <p>World of Warcraft</p>
                </div>
            </div>
        </div>
    )

}

export default Footer