import React, { useContext, useEffect, useState } from "react";
import api from '../api'
import ProductCard from './../components/ProductCard/ProductCard';
import AuthContext from "../context/auth-context";

const Favorites = (props) => {
    const auth = useContext(AuthContext)
    const [favorites, setFavorites] = useState([])

    useEffect(() => {
        api.getFavorites({ params: { user: auth.user._id, expand: ['product'] }}).then((response) => {
            setFavorites(response.data)
        }).catch((error) => {
            console.log(error)
        })
    }, [])

    return (
        <div>
            <h5 style={{ marginBottom: '20px' }}> Favorites </h5>
            {
                favorites.map((favorite, i) => {
                    return <ProductCard key={i} product={favorite.product}/>
                })
            }
        </div>
    )
}

export default Favorites;