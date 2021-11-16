import React, { createRef, useEffect, useRef, useState } from 'react'
import { useHistory, useParams } from 'react-router'
import api from '../api'
import { Pagination, ProductCard } from '../components'
import Layout from '../components/Layout/Layout'
import { BiCoinStack } from 'react-icons/bi'
import { GiLockedChest } from 'react-icons/gi'
import { BsFillArrowUpCircleFill } from 'react-icons/bs'

const TypeSelector = (props) => {
    const [refs, setRefs] = useState({})
    const containerRef = useRef()

    useEffect(() => {
        let newRefs = {}
        props.types.forEach((type) => {
            newRefs[type] = createRef()
        })
        setRefs(newRefs)
    }, [props.types])

    const getTypeIcon = (type) => {
        switch(type) {
            case ('currency'): {
                return <BiCoinStack/>
            }

            case ('items'): {
                return <GiLockedChest/>
            }
            
            case ('boosting'): {
                return <BsFillArrowUpCircleFill/>
            }
        }
    }

    const toTitleCase = (string) => {
        if (!string.length) return null
        return string[0].toUpperCase() + string.slice(1, string.length)
    }

    const getSelectedRect = () => {
        let ref = refs[props.selected]
        console.log(refs[props.selected])
        if (!ref || !ref.current) return {}
        let dimensions = ref.current.getBoundingClientRect()
        if (!containerRef || !containerRef.current) return {}
        let containerDimensions = containerRef.current.getBoundingClientRect()
        return { bottom: containerDimensions.bottom - dimensions.bottom, top: containerDimensions.top - dimensions.top, right: containerDimensions.right - dimensions.right, width: dimensions.width, height: dimensions.height }
    }

    return (
        <div ref={containerRef} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '-15px', position: 'relative', zIndex: '0' }}>
            <div style={{ position: 'absolute', opacity: props.selected ? '1' : '0', top: getSelectedRect().bottom, right: getSelectedRect().right, width: getSelectedRect().width, height: getSelectedRect().height, backgroundColor: 'white', transform: 'translateY(0)', zIndex: '1', transition: 'right 300ms ease, width 300ms ease, opacity 300ms ease', borderRadius: '25px' }}/>

            {
                props.types.map((type, i) => {
                    return <div key={i} ref={refs[type]} style={{ display: 'flex', alignItems: 'center', padding: '6px 9px 6px 9px', borderRadius: '25px', margin: '5px', userSelect: 'none', color: props.selected === type ? 'black' : 'white', zIndex: '2', transition: 'color 300ms ease', cursor: 'pointer', userSelect: 'none' }} onClick={() => props.handleChange(type)}>
                        { getTypeIcon(type) }
                        <p style={{ marginBottom: '0px', marginLeft: '5px' }}> {toTitleCase(type)} </p>
                    </div>
                })
            }
        </div>
    )
}

const Game = (props) => {
    const search = new URLSearchParams(window.location.search)
    const { game_id } = useParams()

    const [game, setGame] = useState(null)
    const [products, setProducts] = useState([])
    const [name, setName] = useState(search.get('q') || '')
    const [productType, setProductType] = useState(search.get('type') || '')
    const [server, setServer] = useState('')
    const [platform, setPlatform] = useState('')
    const [sort, setSort] = useState(search.get('sort') || '-unit_price')
    
    const [limit, setLimit] = useState(Number(search.get('limit')) || 1)
    const [page, setPage] = useState(Number(search.get('page')) || 1)
    const [hasMore, setHasMore] = useState(false)

    const history = useHistory()

    useEffect(() => {
        api.getGameById(game_id).then((response) => {
            setGame(response.data)
        }).catch((error) => {
            console.log(error)
        })
    }, [game_id])

    useEffect(() => {
        if (game) handleSearch()
    }, [game, page, limit, sort, productType])

    const getProducts = (req) => {
        api.getProducts({ params: req }).then((response) => {
            let { data, has_more } = response.data
            setProducts(data)
            setHasMore(has_more)
        }).catch((error) => {
            console.log(error)
        })
    }

    const handleSearch = () => {
        let params = { game: game_id, limit, skip: (page - 1) ? (page - 1) * limit : 0 }, queryString = generateQueryString()

        if (name.length) params.q = name 
        if (productType.length) params.type = productType
        if (server.length) params.server = server
        if (platform.length) params.platform = platform
        if (sort) params.sort = sort

        history.push(`?${queryString}`)
        
        getProducts(params)
    }

    const generateQueryString = () => {
        let queryString = ''
        if (name.length) queryString = queryString.length ? queryString + `&q=${name}` : `q=${name}`
        if (productType.length) queryString = queryString.length ? queryString + `&type=${productType}` : `type=${productType}`
        if (sort) queryString = queryString.length ? queryString + `&sort=${sort}` : `sort=${sort}`
        if (page) queryString = queryString.length ? queryString + `&page=${page}` : `page=${page}`
        if (limit) queryString = queryString.length ? queryString + `&limit=${limit}` : `limit=${limit}`
        return queryString
    }

    const handleName = (e) => {
        setName(e.target.value)
    }

    const handlePlatform = (e) => {
        setPlatform(e.target.value)
    }

    const handleServer = (e) => {
        setServer(e.target.value)
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') handleSearch()
    }

    const handleSort = () => {
        if (sort === '-unit_price') return setSort('unit_price')
        setSort('-unit_price')
    }

    return (
        <Layout navbar>
            { game ? <div>
                <div style={{ height: '300px', width: '100%', position: 'absolute', top: '0px', left: '0px', zIndex: '-1'}}>
                    <div style={{ height: '100%', width: '100%', backgroundColor: 'rgba(0,0,0,.5)', position: 'absolute' }}/>
                    <img alt='game banner image' src={game.banner_img} style={{ objectFit: 'cover', width: '100%', height: '100%'}}/>
                </div>
                <div style={{ display: 'flex', marginTop: '0px', alignItems: 'center' }}>
                    <img alt='game cover image' src={game.img} style={{ borderRadius: '10px',  height: '160px', width: '120px'  }}/>
                    <div style={{ marginLeft: '20px' }}>
                        <h1 style={{ color: 'white', marginBottom: '0px', fontSize: '30px' }}> {game.name} </h1>
                        <h5 style={{ color: 'white', marginBottom: '0px', opacity: '.7' }}> {game.developer} </h5>
                    </div>
                </div>
                <TypeSelector types={game.product_types} selected={productType} handleChange={setProductType}/>
                <div style={{ marginTop: '50px', marginBottom: '40px', display: 'flex' }}>
                    <div style={{  marginRight: '10px', width: '20%' }}>
                        <label for="emailInput" className="form-label" style={{ marginTop: '10px' }}>Search</label>
                        <input className="form-control" value={name} placeholder={'Cheap Gold'} onKeyPress={handleKeyPress} onChange={handleName}/>
                    </div>
                    <div style={{ width: '30%', display: 'flex' }}>
                        <div style={{ marginRight: '10px', width: '100%' }}>
                            <label for="emailInput" className="form-label" style={{ marginTop: '10px' }}>Platform</label>
                            <select className="form-control" type='select' value={platform} placeholder={'Search'} onKeyPress={handleKeyPress} onChange={handlePlatform}>
                                <option value={''} disabled hidden> Select </option>
                                { game.platforms.map((type) => {
                                    return <option value={type}> {type} </option>
                                })}
                            </select>
                        </div>
                        <div style={{ marginRight: '10px', width: '100%' }}>
                            <label for="emailInput" className="form-label" style={{ marginTop: '10px' }}>Server</label>
                            <select className="form-control" type='select' value={server} placeholder={'Search'} onKeyPress={handleKeyPress} onChange={handleServer}>
                                <option value={''} disabled hidden> Select </option>
                                { game.servers.map((type) => {
                                    return <option value={type}> {type} </option>
                                })}
                            </select>
                        </div>
                    </div>
                </div>

                <button class="btn btn-primary" onClick={handleSort}>Sort</button>

                <div>
                    { products.map((product) => {
                        return <ProductCard product={product}/>
                    })}
                </div>
                <Pagination limit={limit} page={page} hasMore={hasMore} handlePageChange={setPage} handleLimitChange={setLimit}/>
            </div> : null }
        </Layout>
    )
}

export default Game