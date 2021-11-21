import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import '../Footer/Footer.css'
import { ReactComponent as Logo } from '../../images/logo.svg'
import { AiOutlineArrowUp } from 'react-icons/ai'

const Footer = (props) => {
    const [scroll, setScroll] = useState(0)

    const scrollHandler = (event) => {
        setScroll(window.scrollY)
    }

    const handleScrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    useEffect(() => {
        window.addEventListener('scroll', scrollHandler)
        return () => window.removeEventListener('scroll', scrollHandler)
    }, [])

    return (
        <div style={{ backgroundColor: 'white', color: 'black', borderTop: '1px solid rgba(0,0,0,.1)' }}>
            <div style={{ position: 'fixed', transform: `translateY(${ scroll > 40 ? '0%' : 'calc(100% + 10px)'}) translateX(-50%)`, bottom: '10px', left: '50%', backgroundColor: 'black', color: 'white', transition: 'transform 300ms ease', padding: '6px 9px 6px 9px', borderRadius: '25px', display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={handleScrollToTop}>
                <AiOutlineArrowUp/>
                <p style={{ margin: '0px 0px 0px 5px' }}> Back to Top </p>
            </div>   
            <div style={{ padding: '20px', display: 'flex', justifyContent: 'center', borderBottom: '1px solid rgba(0,0,0,.1)' }}>

                <div style={{ margin: '10px 40px 10px 40px' }}>
                    <p style={{ marginBottom: '10px' }}><b>About Us</b></p>
                    <p style={{ marginBottom: '5px' }}>League of Legends</p>
                    <p>World of Warcraft</p>
                </div>
                <div style={{ margin: '10px 40px 10px 40px'  }}>
                    <p style={{ marginBottom: '10px' }}><b>Products</b></p>
                    <p style={{ marginBottom: '5px' }}>League of Legends</p>
                    <p>World of Warcraft</p>
                </div>                
                <div style={{ margin: '10px 40px 10px 40px'  }}>
                    <p style={{ marginBottom: '10px' }}><b>Support</b></p>
                    <p style={{ marginBottom: '5px' }}>League of Legends</p>
                    <p>World of Warcraft</p>
                </div>
            </div>
            <div style={{ padding: '20px', display: 'flex', justifyContent: 'center' }}>
                <p style={{ margin: '0px 20px 0px 20px' }}> Terms of Service </p>
                <p style={{ margin: '0px 20px 0px 20px' }}> Privacy Policy </p>
                <p style={{ margin: '0px 20px 0px 20px' }}> Return Policy </p>
            </div>
            <div style={{ padding: '20px', display: 'flex', backgroundColor: 'rgba(0,0,0,.05)' }}>
                <p style={{ margin: '0px 20px 0px 20px', fontSize: '14px', opacity: '.7' }}> © 2021 Traveling Merchant </p>
            </div>
        </div>
    )

}

export default Footer