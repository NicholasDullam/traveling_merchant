import React, { useContext, useEffect, useState } from "react";
import api from "../api";
import AuthContext from "../context/auth-context";
import { FaTrashAlt } from "react-icons/fa";

const Billing = (props) => {
    const auth = useContext(AuthContext)
    const [paymentMethods, setPaymentMethods] = useState([])

    useEffect(() => {
        api.getPaymentMethods(auth.user.cust_id).then((response) => {
            console.log(response.data)
            setPaymentMethods(response.data.data)
        }).catch((error) => {
            console.log(error)
        })
    }, [])

    const handleDelete = (paymentMethod) => {
        api.deletePaymentMethod(paymentMethod.id).then((response) => {
            setPaymentMethods(paymentMethods.filter((pm) => pm.id !== paymentMethod.id))
        }).catch((error) => {
            console.log(error)
        })
    }

    return (
        <div>
            {
                paymentMethods.map((paymentMethod, i) => {
                    return (
                        <div key={i} style={{ padding: '10px', borderBottom: i < paymentMethods.length - 1 ? '1px solid rgba(0,0,0,.1)' : ''}}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <p style={{ marginBottom: '0px' }}> {paymentMethod.id} </p>
                                <p style={{ marginBottom: '0px', marginLeft: '20px'}}> {paymentMethod.card.brand} </p>
                                <p style={{ marginBottom: '0px', marginLeft: '20px' }}> {paymentMethod.card.last4} </p>
                                <FaTrashAlt style={{ cursor: 'pointer', marginRight: '10px', marginLeft: 'auto' }} onClick={() => handleDelete(paymentMethod)}/>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default Billing