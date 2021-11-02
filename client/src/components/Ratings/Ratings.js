import React, { useEffect, useState } from "react";
import { FaStar } from 'react-icons/fa';
import api from "../../api";

const Ratings = (props) => {
    const [reviewRating, setReviewRating] = useState(null)

    useEffect(() => {
        if (props.count) return
        api.getReviewRating(props.user_id).then((response) => {
            setReviewRating(response.data.avg ? response.data.avg / 5 * 100 : null)
        }).catch((error) => {
            console.log('error')
        })
    }, [props.user_id])

    let count = reviewRating ? Math.round(reviewRating/20) : props.count

    const generateStars = (count) => {
        let arr = []
        for (let i = 0; i < count; i++) {
            arr[i] = <FaStar key={i}/>
        }

        for (let i = count; i < 5; i++) {
            arr[i] = <FaStar key={i} style={{ opacity: '.2' }}/>
        }

        return arr
    }

    let arr = generateStars(count)

    if (props.count) return <div> {arr} </div>

    return (
        reviewRating !== null ? <div style={{ display: 'flex', alignItems: 'center' }}>
            <div>
                {arr}
            </div>
            <p style={{ marginLeft: '5px', marginBottom: '-3px' }}> {reviewRating}% </p>
        </div> : <p style={{ marginBottom: '0px' }}> No Reviews </p>
    )

}
export default Ratings;