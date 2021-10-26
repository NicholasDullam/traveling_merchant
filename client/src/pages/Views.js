import React, { useContext, useEffect, useState } from "react";
import api from '../api'
import ProductCard from './../components/ProductCard/ProductCard';
import AuthContext from "../context/auth-context";

const Views = (props) => {
    const auth = useContext(AuthContext)
    const [views, setViews] = useState([])
    const [productsLoaded, setProductsLoaded] = useState(false)

    useEffect(() => {
        api.getViews({ params: { user_id: auth.user._id, limit: 5 }}).then((response) => {
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
            <h5 style={{ marginBottom: '20px' }}> Views </h5>
            {
                views.map((view, i) => {
                    return <ProductCard key={i} product={view.product}/>
                })
            }
        </div>
    )
}

export default Views;