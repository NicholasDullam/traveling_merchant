import React from 'react'
import { IoIosArrowForward, IoIosArrowBack } from 'react-icons/io'

const Pagination = (props) => {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', position: 'relative', height: '38px', marginTop: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <IoIosArrowBack style={{ opacity: props.page > 1 ? '1' : '.3', cursor: 'pointer', transition: 'opacity 300ms ease' }} onClick={() => props.page > 1 ? props.handlePageChange(props.page - 1) : null }/>
                <h6 style={{ marginBottom: '0px', margin: '0px 10px 0px 10px', padding: '5px 10px 5px 10px', borderRadius: '5px', backgroundColor: 'rgba(0,0,0,.05)', userSelect: 'none' }}> {props.page} </h6>
                <IoIosArrowForward style={{ opacity: props.hasMore ? '1' : '.3', cursor: 'pointer', transition: 'opacity 300ms ease' }} onClick={() => props.hasMore ? props.handlePageChange(props.page + 1) : null }/>
            </div>
            <div style={{ position: 'absolute', right: '0px', top: '0px', display: 'flex', alignItems: 'center' }}>
                <h6 style={{ marginBottom: '0px', marginRight: '10px', userSelect: 'none' }}> Results Per Page </h6>
                <input className="form-control" value={props.limit} onChange={(e) => props.handleLimitChange(e.target.value)} style={{ width: '45px', textAlign: 'center' }}/>
            </div>
        </div>
    )
}

export default Pagination