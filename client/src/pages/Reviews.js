import React, { useContext, useEffect, useState } from "react";
import api from '../api'
import ProductCard from './../components/ProductCard/ProductCard';
import AuthContext from "../context/auth-context";

const Reviews = (props) => {
    const auth = useContext(AuthContext)
    const [reviews, setReviews] = useState([])

    useEffect(() => {
        api.getReviews({ params: { reviewer: auth.user._id }}).then((response) => {
            setReviews(response.data)
        }).catch((error) => {
            console.log(error)
        })
    }, [])

    return (
        <div>
            {
                reviews.map((review, i) => {
                    return (
                        <div style={{ padding: '10px', borderBottom: i < reviews.length - 1 ? '1px solid rgba(0,0,0,.1)' : ''}}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <p style={{ marginBottom: '0px' }}> {review.seller} </p>
                                <p style={{ marginBottom: '0px', marginLeft: '20px' }}> {review.rating}/5 </p>
                                <p style={{ marginBottom: '0px', marginLeft: '20px' }}> {review.content} </p>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default Reviews;