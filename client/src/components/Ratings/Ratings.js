import React from "react";
import { FaStar } from 'react-icons/fa';
const Ratings = (props) =>{

    var arr = [];
for(var i = 0; i < props.count; i++) {
 arr[i] = <FaStar/>
}

    return (
        <div>{arr}</div>
    )

}
export default Ratings;