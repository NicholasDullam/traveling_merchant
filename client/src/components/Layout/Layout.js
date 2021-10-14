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
      {props.navbar?<Navbar />:null}
      <div className="container">{props.children}</div>
      <Footer></Footer>
    
    </div>
  );
};

export default Layout;
