import React, { useContext, useEffect, useState } from 'react'
import api from '../../api'
import AuthContext from '../../context/auth-context'
import { ProductCard } from '..'

const ViewGallery = (props) => {
    const auth = useContext(AuthContext)
    const [views, setViews] = useState([])

    useEffect(() => {
        let params = { limit: 3, sort: '-created_at', expand: ['product'] }
        if (auth.user) params.user = auth.user._id
        api.getViews({ params }).then((response) => {
            setViews(response.data)
        }).catch((error) => {
            console.log(error)
        })
    }, [])

    var viewComponent = "";

   if(views.length > 0) {
    viewComponent =   views.map((view, i) => {
        return <ProductCard key={i} product={view.product}/>
    })
   }
  

    return (
        <div>
            {console.log(views.length)}
            {viewComponent}
      

        </div>
    )
}

export default ViewGallery