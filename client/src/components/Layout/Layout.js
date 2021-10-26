import React from "react";

import "bootstrap/dist/css/bootstrap.css";

import "../Layout/Layout.css";
import $ from "jquery";
import Popper from "popper.js";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";

const Layout = (props) => {
  return (
    <div>
      <div>
        { props.navbar ? <Navbar/> : null }
        <div className="container" style={{ paddingTop: '104px', paddingBottom: '40px', minHeight: 'calc(100vh - 65px)'}}>{props.children}</div>
      </div>
      <Footer/>
    </div>
  );
};

export default Layout;
