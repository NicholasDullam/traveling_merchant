import React from 'react'
import Layout from '../Layout/Layout';

import listingImg from '../../images/listing_img.png'

const Listing = (props) => {

return (
  <div class="row">
      <div class="col-md-7">
        <img src= {listingImg} ></img>
      </div>
      <div class="col-md-7">
          <p> SURVIVING MARS (2018)</p>
            <p> <span>Icon</span>Game key </p>
            <p>$29.99 USD</p>
        
</div>

  </div>
)

}

export default Listing;