import React, { useContext, useEffect, useState } from "react";
import api from '../api'
import ProductCard from './../components/ProductCard/ProductCard';
import AuthContext from "../context/auth-context";
import { Ratings } from "../components";

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
            <h5 style={{ marginBottom: '20px' }}> Reviews </h5>
            {
                reviews.map((review, i) => {
                    return (
                        <div key={i} style={{ padding: '10px', backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: '10px', margin: '5px', cursor: 'pointer' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <p style={{ marginBottom: '0px', width: '70px', textOverflow: 'ellipsis', overflow: 'hidden' }}> {review._id} </p>
                                <p style={{ marginBottom: '0px', marginLeft: '20px' }}> {review.content} </p>
                                <div style={{ marginLeft: 'auto'}}>
                                    <Ratings count={review.rating}/>
                                </div>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default Reviews;