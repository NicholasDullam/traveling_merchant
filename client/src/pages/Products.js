import React, { useContext, useEffect, useState } from "react";
import api from "../api";
import AuthContext from "../context/auth-context";


const Products = (props) => {
    const auth = useContext(AuthContext)
    const [products, setProducts] = useState([])
    const [retrievedFavorites, setRetrievedFavorites] = useState(false)

    useEffect(() => {
        api.getProducts({ params: { user_id: auth.user._id }}).then((response) => {
            setProducts(response.data)
        }).catch((error) => {
            console.log(error)
        })
    }, [])

    useEffect(async () => {
        if (!products.length || retrievedFavorites) return
        let updatedProducts = [...products]
        for (let i = 0; i < products.length; i++) { 
            let favorites = await api.getFavorites({ params: { product_id: products[i]._id }})
            updatedProducts[i].favorites = favorites.data.length
        }

        setProducts(updatedProducts)
        setRetrievedFavorites(true)
    }, [products])

    return (
        <div>
            {
                products.map((product, i) => {
                    return (
                        <div style={{ padding: '10px', borderBottom: i < products.length - 1 ? '1px solid rgba(0,0,0,.1)' : ''}}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <p style={{ marginBottom: '0px' }}> {product._id} </p>
                                <p style={{ marginBottom: '0px', marginLeft: '20px' }}> {product.name} </p>
                                <p style={{ marginBottom: '0px', marginLeft: '20px' }}> ${product.unit_price / 100} </p>
                                <p style={{ marginBottom: '0px', marginLeft: '20px' }}> {product.favorites} favorites </p>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default Products