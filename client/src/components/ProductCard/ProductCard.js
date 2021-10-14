import React from 'react'
import Ratings from '../Ratings/Ratings'

import productImg from '../../images/fortnite-dance.gif'

const ProductCard = (props) => {

    return (
<div class="card">
    <p>Fortnite duct tape (400)</p>
    <p> Username</p> <Ratings count={5}/>
        <img src={productImg}></img>
        <p> $5.00 </p>
        <button class="btn"> Purchase</button>
</div>

    )

}
export default ProductCard