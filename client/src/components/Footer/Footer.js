import React from "react";
import { Link } from "react-router-dom";

import '../Footer/Footer.css'
import { ReactComponent as Logo } from '../../images/logo.svg'

const Footer = (props) => {

    return (
        <div className="footer" style={{ padding: '40px' }}>   
            <div className="row">
                <div>
                    <h1>
                        <Link to="/">
                            <Logo style={{ width: '65px', marginBottom: '15px' }}/>
                        </Link>
                    </h1>
                </div>
                <div>
                    <p><b>Games</b></p>
                    <p>League of Legends</p>
                    <p>World of Warcraft</p>
                </div>
            </div>
        </div>
    )

}

export default Footer