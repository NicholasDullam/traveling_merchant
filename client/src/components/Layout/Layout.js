import React from "react";

import "bootstrap/dist/css/bootstrap.css";

import "../Layout/Layout.css";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";

const Layout = (props) => {
    return (
        <div>
            <div>
                { props.navbar ? <Navbar/> : null }
                <div className="container" style={{ paddingTop: '40px', paddingBottom: '40px', minHeight: 'calc(100vh - 100px)'}}>{props.children}</div>
            </div>
            <Footer/>
        </div>
    )
}

export default Layout;
