import React from 'react'
import Ratings from '../Ratings/Ratings'

import productImg from '../../images/fortnite-dance.gif'

const ProductCard = (props) => {

    return (
<div class="card">
    <p>{props.name}</p>
    <p>username</p> <Ratings count={5}/>
        <img src={productImg}></img>
        <p>{props.price} </p>
        <button class="btn"> Purchase</button>
</div>

    )

}
export default ProductCard