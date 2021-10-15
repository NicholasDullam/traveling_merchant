import React from "react";
import Settings from "../components/Settings/Settings";
import axios from 'axios'

import api from '../api'
import ProductCard from './../components/ProductCard/ProductCard';
const Favorites = (props) => {

var FavoriteCards =[];
var favorites = [];

async function asyncGetFavorites() {
    
const fav = await api.getFavorites();


for (var i = 0; i < fav.data.length; i++) {
    const product = await api.getProductById(fav.data[i].product_id)
    // console.log(fav.data[i].product_id)
    console.log(product.data)

    var card =  <ProductCard name = {product.data.name} price={product.data.price}></ProductCard>

FavoriteCards.push(card) 
    console.log(product.data.name + " " + product.data.unit_price);
}

// api.getFavorites()
// .then((result => 
// result.data.forEach(favorite => 
//   favorites.push(favorite)
// )))
// .catch(function(e) {
// console.log(e)

// })

}

// var products = [];

// async function asyncGetFavoriteProducts() {

// favorites.forEach(favorite => 
//     api.getProductById(favorite.product_id)
//     .then((result => 
//         console.log(result.data)
//     // products.push(result.data)
//     ))
//     .catch(function(e) {
//         console.log(e)
        
//         })
// )
//     }


    asyncGetFavorites();
    // asyncGetFavoriteProducts();

// console.log("favorites[0].product_id: " + favorites[0].product_id)

console.log(FavoriteCards);
// console.log(products);


// var dummyFavorite = favorites[0].product_id;


return (
    <Settings>
        {/* <p>{dummyFavorite}</p> */}
        {FavoriteCards}
           </Settings>
)

}

export default Favorites;