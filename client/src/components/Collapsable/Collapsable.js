import React, { useState, useRef } from 'react'
import { BsChevronDown } from 'react-icons/bs'

const Collapsable = (props) => {
    const [collapsed, setCollapsed] = useState(false)
    let contentRef = useRef()

    const getContentHeight = () => {
        if (!contentRef || !contentRef.current) return null
        return contentRef.current.getBoundingClientRect().height
    }

    return <div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px', cursor: 'pointer' }} onClick={() => setCollapsed(!collapsed)}>
            { props.head }
            <BsChevronDown style={{ marginLeft: 'auto', transform: !collapsed ? 'rotate(180deg)' : '', transition: 'transform 300ms ease' }}/>
        </div>
        <div style={{ height: collapsed ? '0px' : getContentHeight() + 20, transition: 'height 300ms ease', overflow: 'hidden' }}>
            <div ref={contentRef}>
                { props.children }
            </div>
        </div>
    </div>
}

export default Collapsable