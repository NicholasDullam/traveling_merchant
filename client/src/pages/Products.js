import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router";
import api from "../api";
import AuthContext from "../context/auth-context";


const Products = (props) => {
    const auth = useContext(AuthContext)
    const history = useHistory()
    const [products, setProducts] = useState([])
    const [retrievedFavorites, setRetrievedFavorites] = useState(false)
    const retrieveFavorites = async (product_id) => {
        if (!products.length || retrievedFavorites) return
        let updatedProducts = [...products]
        for (let i = 0; i < products.length; i++) { 
            let favorites = await api.getFavorites({ params: { product: products[i]._id }})
            updatedProducts[i].favorites = favorites.data.length
        }

        setProducts(updatedProducts)
        setRetrievedFavorites(true)
    }

    useEffect(() => {
        api.getProducts({ params: { user: auth.user._id }}).then((response) => {
            setProducts(response.data.data)
        }).catch((error) => {
            console.log(error)
        })
    }, [])

    useEffect(() => {
        retrieveFavorites()
    }, [products])

    return (
        <div>
            <h5 style={{ marginBottom: '20px' }}> Products </h5>
            {
                products.map((product, i) => {
                    return (
                        <div key={i} style={{ padding: '10px', backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: '10px', margin: '5px', cursor: 'pointer' }} onClick={() => history.push(`/products/${product._id}`)}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <p style={{ marginBottom: '0px', width: '70px', textOverflow: 'ellipsis', overflow: 'hidden' }}> {product._id} </p>
                                <p style={{ marginBottom: '0px', marginLeft: '20px' }}> {product.name} </p>
                                <p style={{ marginBottom: '0px', marginLeft: '20px' }}> ${product.unit_price / 100} </p>
                                <p style={{ marginBottom: '0px', marginLeft: 'auto' }}> {product.favorites} favorites </p>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default Products