import React, { useContext, useEffect, useState } from 'react'
import api from '../../api'
import AuthContext from '../../context/auth-context'
import { ProductCard } from '..'

const ViewGallery = (props) => {
    const auth = useContext(AuthContext)

    const [views, setViews] = useState([])

    useEffect(() => {
        api.getViews({ user_id: auth.user_id, limit: 5 }).then((response) => {
            setViews(response.data)
        }).catch((error) => {
            console.log(error)
        })
    }, [])

    return (
        <div class="row" style={{ display: 'flex' }}>
            {
                views.map((view) => {
                    return (
                        <div class="col-md-2 col-sm-12">
                            <ProductCard product={{ seller: { first: 'Nich', last: 'Dullam' }, media: [], unit_price: '$10'}}/>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default ViewGallery