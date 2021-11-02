import React, { useEffect, useState } from "react";
import { FaStar } from 'react-icons/fa';
import api from "../../api";

const Ratings = (props) => {
    const [reviewRating, setReviewRating] = useState(null)
    const [ratingLoaded, setRatingLoaded] = useState(false)

    useEffect(() => {
        if (props.count) return
        api.getReviewRating(props.user_id).then((response) => {
            setReviewRating(response.data.avg ? response.data.avg / 5 * 100 : null)
            setRatingLoaded(true)
        }).catch((error) => {
            setRatingLoaded(true)
        })
    }, [])

    let count = reviewRating ? Math.round(reviewRating/20) : props.count

    const generateStars = (count) => {
        let arr = []
        for (let i = 0; i < count; i++) {
            arr[i] = <FaStar/>
        }

        for (let i = count; i < 5; i++) {
            arr[i] = <FaStar style={{ opacity: '.2' }}/>
        }

        return arr
    }

    let arr = generateStars(count)

    if (props.count) return <div> {arr} </div>

    return (
        reviewRating !== null && ratingLoaded ? <div style={{ display: 'flex', alignItems: 'center' }}>
            <div>
                {arr}
            </div>
            <p style={{ marginLeft: '5px', marginBottom: '-3px' }}> {reviewRating}% </p>
        </div> : <p style={{ marginBottom: '0px' }}> No Reviews </p>
    )

}
export default Ratings;