import React from 'react';


import 'bootstrap/dist/css/bootstrap.css';
import $ from 'jquery';
import Popper from 'popper.js';

const Layout = (props) => {

   return (
       <div className="container">
           <h1> Hey you </h1>
           {props.children}
       </div>
   ) 
}