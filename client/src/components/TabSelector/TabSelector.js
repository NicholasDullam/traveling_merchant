import React, { useState, useRef, createRef, useEffect } from 'react'

const TabSelector = (props) => {
    const [refs, setRefs] = useState({})
    const containerRef = useRef()

    useEffect(() => {
        let newRefs = {}
        props.tabs.forEach((tab) => {
            newRefs[tab.pathname] = createRef()
        })
        setRefs(newRefs)
    }, [props.types])

    const getSelectedRect = () => {
        let ref = refs[props.selected]
        if (!ref || !ref.current) return {}
        let dimensions = ref.current.getBoundingClientRect()
        if (!containerRef || !containerRef.current) return {}
        let containerDimensions = containerRef.current.getBoundingClientRect()
        return { bottom: containerDimensions.bottom - dimensions.bottom, top: dimensions.top - containerDimensions.top, right: containerDimensions.right - dimensions.right, width: dimensions.width, height: dimensions.height }
    }

    return (
        <div ref={containerRef} style={{ position: 'relative', zIndex: '0', marginRight: '50px' }}>
            <div style={{ position: 'absolute', top: getSelectedRect().top, right: getSelectedRect().right, width: `${getSelectedRect().width}px`, height: `${getSelectedRect().height}px`, backgroundColor: 'black', zIndex: '0', transition: 'top 300ms ease, width 300ms ease, opacity 300ms ease', borderRadius: '25px' }}/>
            {
                props.tabs.map((tab, i) => {
                    return <div key={i} ref={refs[tab.pathname]} style={{ dispaly: 'flex', alignItems: 'center', padding: '6px 9px 6px 9px', borderRadius: '25px', margin: '5px 5px 5px 0px', userSelect: 'none', color: props.selected === tab.pathname ? 'white' : 'grey', zIndex: '5', transition: 'color 300ms ease', cursor: 'pointer', userSelect: 'none' }} onClick={() => props.handleRouter(tab.pathname)}>
                        <p style={{ marginBottom: '0px', zIndex: '1', margin: '5px', display: 'inline-block', transition: 'transform 300ms ease', transform: props.selected === tab.pathname ? `translateX(calc((${getSelectedRect().width}px - 100%)/2 - 14px))`: '', userSelect: 'none' }}> {tab.name} </p>
                    </div>
                })
            }
        </div>
    )
}

export default TabSelector