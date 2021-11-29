import React from "react";

import "bootstrap/dist/css/bootstrap.css";

import "../Layout/Layout.css";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import CookieCard from "../CookieCard/CookieCard";

const Layout = (props) => {
    return (
        <div>
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', width: '100%' }}>
                { props.navbar ? <Navbar/> : null }
                <div className="container" style={{ paddingTop: '40px', marginBottom: '40px', height: '100%', display: 'flex', flexDirection: 'column', flexGrow: '1' }}>
                    {props.children}
                </div>
                <CookieCard/>
                <Footer/>
            </div>
        </div>
    )
}

export default Layout;
