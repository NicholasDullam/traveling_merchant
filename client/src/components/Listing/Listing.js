import React from 'react'
import Layout from '../Layout/Layout';

import listingImg from '../../images/listing_img.png'
import Ratings from '../Ratings/Ratings';

const Listing = (props) => {

return (
  <div class="row">
      <div class="col-md-7">
        <img src= {listingImg} ></img>
      </div>
      <div class="col-md-7">
          <p> {props.name}</p>
            <p> <span>icon</span>{props.type}</p>
            <p>${props.price} USD</p>
        <button className="btn">Add to cart</button>

        <table class="table">
 
  <tbody>
    <tr>
      <th scope="row">ITEM ID</th>
      <td>#19304795038</td>
    </tr>
    <tr>
      <th scope="row">Platform</th>
      <td>PC</td>
    </tr>
    <tr>
      <th scope="row">Region</th>
      <td>Global</td>
    </tr>
    <tr>
      <th scope="row">Delivery</th>
      <td>Auto delivery</td>
    </tr>
  </tbody>

</table>
<p> Sold by GamerDu92</p>
<Ratings count = {4}/>

      </div>

  </div>
)

}

export default Listing;