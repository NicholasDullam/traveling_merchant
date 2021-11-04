import React from 'react'

const Badge = (props) => {
 
 
    return (
 
        <div class="d-flex align-items-center justify-content-center" style={{ backgroundColor: "red", borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px',  boxShadow: '0px 0px 0px 4px rgba(255, 255, 255, 1)' }}>
            <p style={{color:"white", fontWeight:"bold"}}> {props.count}</p>
        </div>
    
    )
}
export default Badge