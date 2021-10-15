import React, { useEffect, useState } from "react";
import { FaStar } from 'react-icons/fa';
import api from "../../api";

const Ratings = (props) => {
    const [reviewRating, setReviewRating] = useState(null)
    const [ratingLoaded, setRatingLoaded] = useState(false)

    useEffect(() => {
        if (props.count) return
        api.getReviews({ params: { seller: props.user_id  }}).then((response) => {
            if (response.data.length > 1) {
                console.log(response.data)
                let start = response.data.map((a) => a.rating / 5).reduce((a, b) => a + b) / response.data.length * 100
                setReviewRating(start)
            } else if (response.data.length) {
                setReviewRating(response.data[0] / 5 * 100)
            } 

            setRatingLoaded(true)
        }).catch((error) => {
            setRatingLoaded(true)
        })
    }, [])

    let count = reviewRating ? Math.round(reviewRating/20) : props.count

    const generateStars = (count) => {
        let arr = []
        for (var i = 0; i < count; i++) {
            arr[i] = <FaStar/>
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