import React from "react";
import Settings from "../components/Settings/Settings";
import axios from 'axios'

import api from '../api'
const Favorites = (props) => {

var favorites = [];


api.getFavorites
.then((result => 
result.data.forEach(favorite => 
  favorites.push(favorite)
)))

console.log(favorites);

// var dummyFavorite = favorites[0].product_id;


return (
    <Settings>
        {/* <p>{dummyFavorite}</p> */}
           </Settings>
)

}

export default Favorites;