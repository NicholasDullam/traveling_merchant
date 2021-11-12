import React, { useContext } from 'react'
import { useHistory, useLocation } from 'react-router'
import api from '../../api'
import AuthContext from '../../context/auth-context'
import Ratings from '../Ratings/Ratings'

import './ProductCard.scss'

const ProductCard = (props) => {
    const auth = useContext(AuthContext)
    const history = useHistory()
    const location = useLocation()

    const handlePurchase = (e) => {
        e.stopPropagation()
        if (!auth.isLoggedIn) history.push(`/login?redirect_uri=${location.pathname}`)
        api.createOrder({ quantity: props.product.min_quantity, product: props.product._id }).then((response) => {
            history.push(`/orders/${response.data._id}/checkout`)
        }).catch((error) => {
            console.log(error)
        })
    }

    const handleClick = (e) => {
        e.stopPropagation()
        history.push(`/products/${props.product._id}`)
    }

    return (
        props.product ? <div style={{ borderRadius: '25px', cursor: 'pointer', marginBottom: '10px', backgroundColor: 'rgba(0,0,0,.05)' }} onClick={handleClick}>
            <div style={{ padding: '25px', display: 'flex', alignItems: 'center' }}>
                <img src={props.product.media.length ? props.product.media[0] : null} style={{ backgroundColor: 'grey', height: '70px', width: '70px', borderRadius: '15px' }} />
                <div style={{ marginLeft: '20px' }}>
                    <h5 style={{ marginBottom: '0px' }}> {props.product.name} ({props.product.type}) </h5>
                    <h6 style={{ marginBottom: '0px'}}> ${props.product.unit_price / 100} per unit </h6>
                </div>
                {/*<p> {props.product.seller.first} {props.product.seller.last} </p> <Ratings count={5}/>*/}
                <button style={{ marginLeft: 'auto' }} class="btn btn-primary" onClick={handlePurchase}> Buy Now </button>
            </div>
        </div> : null 
    )

}
export default ProductCard