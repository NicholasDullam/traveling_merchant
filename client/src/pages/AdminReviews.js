import React, { useEffect, useState } from 'react'
import api from '../api'
import { Pagination, Ratings } from '../components'
import { GoVerified } from 'react-icons/go' 
import { FaTrashAlt } from 'react-icons/fa'

const AdminReviews = (props) => {
    const [reviews, setReviews] = useState([])
    const [hasMore, setHasMore] = useState(false)
    const [limit, setLimit] = useState(5)
    const [page, setPage] = useState(1)

    useEffect(() => {
        api.getReviews({ params: { limit, skip: (page - 1) ? (page - 1) * limit : 0 }}).then((response) => {
            setHasMore(response.data.has_more)
            setReviews(response.data.data)
        }).catch((error) => {
            console.log(error)
        })
    }, [page, limit])

    const verify = (review_id) => {
        api.updateReviewById(review_id, { verified: true }).then((response) => {
            let newReviews = [...reviews]
            let verifiedReviewer = newReviews.findIndex((review) => review._id === review_id)
            newReviews[verifiedReviewer] = response.data
            setReviews(newReviews)
        }).catch((error) => {
            console.log(error)
        })
    }

    const unverify = (review_id) => {
        api.updateReviewById(review_id, { verified: false }).then((response) => {
            let newReviews = [...reviews]
            let verifiedReviewer = newReviews.findIndex((review) => review._id === review_id)
            newReviews[verifiedReviewer] = response.data
            setReviews(newReviews)
        }).catch((error) => {
            console.log(error)
        })
    }

    const deleteReview = (review_id) => {
        api.deleteReviewById(review_id).then((response) => {
            setReviews(reviews.filter((review) => review._id !== review_id))
        }).catch((error) => {
            console.log(error)
        })
    }

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <h5 style={{ marginBottom: '10px' }}> Reviews </h5>
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {
                    reviews.map((review, i) => {
                        return ( <div key={i} style={{ padding: '10px', backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: '10px', margin: '5px 0px 5px 0px', cursor: 'pointer' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Ratings count={review.rating}/>
                                <h6 style={{ marginBottom: '-3px' , marginLeft: '10px'}}> {review.content} </h6>
                                <div style={{ display: 'flex', marginLeft: 'auto' }}>
                                    <GoVerified style={{ opacity: review.verified ? '1' : '.5' }} onClick={() => review.verified ? unverify(review._id) : verify(review._id)}/>
                                    <FaTrashAlt style={{ marginLeft: '10px', marginRight: '10px'}} onClick={() => deleteReview(review._id)}/>
                                </div>
                            </div>
                        </div> )
                    })
                }
                <div style={{ marginTop: 'auto' }}>
                    <Pagination page={page} limit={limit} hasMore={hasMore} handlePageChange={setPage} handleLimitChange={setLimit}/>
                </div>
            </div>
        </div>
    )
}

export default AdminReviews