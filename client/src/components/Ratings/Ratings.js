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
            arr[i] = <FaStar key={i} style={{ display: 'block' }}/>
        }

        for (let i = count; i < 5; i++) {
            arr[i] = <FaStar key={i} style={{ opacity: '.2', display: 'block' }}/>
        }

        return arr
    }

    let arr = generateStars(count)

    if (props.count) return <div style={{ display: 'flex' }}> {arr} </div>

    return (
        reviewRating !== null ? <div style={{ display: 'flex', alignItems: 'center', ...props.style }}>
            <div style={{ display: 'flex' }}>
                {arr}
            </div>
            <p style={{ marginLeft: '5px', marginBottom: '-3px' }}> {reviewRating}% </p>
        </div> : <p style={{ marginBottom: '0px', ...props.style }}> No Reviews </p>
    )

}
export default Ratings;