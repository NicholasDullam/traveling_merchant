import React from "react";

import "bootstrap/dist/css/bootstrap.css";

import "../Layout/Layout.css";
import $ from "jquery";
import Popper from "popper.js";
import Navbar from "../Navbar/Navbar";

const Layout = (props) => {
  return (
    <div>
      <Navbar />
      <div className="container">{props.children}</div>
    </div>
  );
};

export default Layout;
