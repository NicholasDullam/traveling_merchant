import React, { useContext, useEffect, useState } from 'react'
import api from '../../api'
import AuthContext from '../../context/auth-context'
import { ProductCard } from '..'

const ViewGallery = (props) => {
    const auth = useContext(AuthContext)
    const [views, setViews] = useState([])
    const [productsLoaded, setProductsLoaded] = useState(false)

    useEffect(() => {
        let params = { limit: 3, sort: '-created_at' }
        if (auth.user) params.user_id = auth.user._id
        api.getViews({ params }).then((response) => {
            setViews(response.data)
        }).catch((error) => {
            console.log(error)
        })
    }, [])

    useEffect(async () => {
        if (!views.length || productsLoaded) return
        let updatedViews = [...views]

        for (let i = 0; i < views.length; i++) {
            let product = await api.getProductById(views[i].product_id)
            updatedViews[i].product = product.data
        }

        setViews(updatedViews)
        setProductsLoaded(true)
    }, [views])

    return (
        <div>
            {
                views.map((view, i) => {
                    return <ProductCard key={i} product={view.product}/>
                })
            }
        </div>
    )
}

export default ViewGallery