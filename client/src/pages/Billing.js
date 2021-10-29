import React, { useContext, useEffect, useState } from "react";
import api from "../api";
import AuthContext from "../context/auth-context";
import { FaTrashAlt } from "react-icons/fa";

import { ReactComponent as Visa } from '../images/visa.svg'
import { ReactComponent as Amex } from '../images/amex.svg'
import { ReactComponent as Mastercard } from '../images/mastercard.svg'
import { ReactComponent as Discover } from '../images/discover.svg'

const Billing = (props) => {
    const auth = useContext(AuthContext)
    const [paymentMethods, setPaymentMethods] = useState([])

    useEffect(() => {
        api.getPaymentMethods(auth.user.cust_id).then((response) => {
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

    const renderBrand = (brand) => {
        console.log(brand)
        switch(brand) {
            case ('visa') : {
                return <Visa style={{ height: '24px' }}/>
            }

            case ('mastercard') : {
                return <Mastercard style={{ height: '24px' }}/>
            }

            case ('amex') : {
                return <Amex style={{ height: '24px' }}/>
            }

            case ('discover') : {
                return <Discover style={{ height: '24px' }}/>
            }

            default: {
                return <Visa/>
            }
        }
    }

    return (
        <div>
            <h5 style={{ marginBottom: '20px' }}> Payment Methods </h5>
            {
                paymentMethods.map((paymentMethod, i) => {
                    return (
                        <div key={i} style={{ padding: '10px', backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: '10px', margin: '5px', cursor: 'pointer' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <p style={{ marginBottom: '0px', width: '70px', textOverflow: 'ellipsis', overflow: 'hidden' }}> {paymentMethod.id} </p>
                                {renderBrand(paymentMethod.card.brand)}
                                <p style={{ marginBottom: '0px', marginLeft: '5px' }}> Ending in {paymentMethod.card.last4} </p>
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