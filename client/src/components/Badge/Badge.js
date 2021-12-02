import React from 'react'

const Badge = (props) => {
 
 
    return (
 
        <div class="d-flex align-items-center justify-content-center" >
            <p style={{color:"white", fontWeight:"bold"}}> Level {props.level?props.level:0}</p>
        </div>
    
    )
}
export default Badge