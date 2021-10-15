import React from 'react'
import Ratings from '../Ratings/Ratings'

const ProductCard = (props) => {
    return (
        props.product ? <div class="card" style={{ borderRadius: '10px' }}>
            <p> {props.product.name} </p>
            <p> {props.product.seller.first} {props.product.seller.last} </p> <Ratings count={5}/>
            <img src={props.product.media.length ? props.product.media[0] : null}/>
            <p> {props.product.unit_price / 100} </p>
            <button class="btn"> Purchase </button>
        </div> : null 
    )

}
export default ProductCard