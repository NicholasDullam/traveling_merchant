import React, { useContext, useEffect, useState } from "react";
import api from '../api'
import ProductCard from './../components/ProductCard/ProductCard';
import AuthContext from "../context/auth-context";

const Views = (props) => {
    const auth = useContext(AuthContext)
    const [views, setViews] = useState([])

    useEffect(() => {
        api.getViews({ params: { user: auth.user._id, limit: 5, expand: ['product'] }}).then((response) => {
            setViews(response.data)
        }).catch((error) => {
            console.log(error)
        })
    }, [])

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