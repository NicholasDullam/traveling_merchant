import React, { useContext, useEffect, useState } from "react";
import api from '../api'
import ProductCard from './../components/ProductCard/ProductCard';
import AuthContext from "../context/auth-context";

const Favorites = (props) => {
    const auth = useContext(AuthContext)
    const [favorites, setFavorites] = useState([])
    const [productsLoaded, setProductsLoaded] = useState(false)

    useEffect(() => {
        api.getFavorites({ params: { user_id: auth.user._id }}).then((response) => {
            console.log(response.data)
            setFavorites(response.data)
        }).catch((error) => {
            console.log(error)
        })
    }, [])

    useEffect(async () => {
        if (!favorites.length || productsLoaded) return
        let updatedFavorites = [...favorites]
        console.log('testing')
        for (let i = 0; i < favorites.length; i++) {
            let product = await api.getProductById(favorites[i].product_id)
            updatedFavorites[i].product = product.data
        }

        setFavorites(updatedFavorites)
        setProductsLoaded(true)
    }, [favorites])

    return (
        <div>
            {
                favorites.map((favorite, i) => {
                    return <ProductCard key={i} product={favorite.product}/>
                })
            }
        </div>
    )
}

export default Favorites;