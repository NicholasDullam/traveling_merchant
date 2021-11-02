import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import api from '../api'
import { ProductCard } from '../components'
import Layout from '../components/Layout/Layout'

const Game = (props) => {
    const [game, setGame] = useState(null)
    const [products, setProducts] = useState([])
    const [hasMore, setHasMore] = useState(false)
    const [name, setName] = useState('')
    const [productType, setProductType] = useState('')
    const [deliveryType, setDeliveryType] = useState('')
    const [server, setServer] = useState('')
    const [platform, setPlatform] = useState('')
    const { game_id } = useParams()

    useEffect(() => {
        api.getGameById(game_id).then((response) => {
            console.log('test')
            setGame(response.data)
        }).catch((error) => {
            console.log(error)
        })
    }, [])

    useEffect(() => {
        if (game)
        getProducts({ game_id })
    }, [game])

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
        let params = { game_id }
        if (name.length) params.q = name 
        if (deliveryType.length) params.delivery_type = deliveryType
        if (productType.length) params.type = productType
        if (server.length) params.server = server
        if (platform.length) params.platform = platform
        getProducts(params)
    }

    const handleName = (e) => {
        setName(e.target.value)
    }

    const handleProductType = (e) => {
        setProductType(e.target.value)
    }

    const handleDeliveryType = (e) => {
        setDeliveryType(e.target.value)
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

    return (
        <Layout navbar>
            { game ? <div>
                <div style={{ height: '250px', width: '100%', position: 'absolute', top: '0px', left: '0px', zIndex: '-1'}}>
                    <div style={{ height: '100%', width: '100%', backgroundColor: 'rgba(0,0,0,.5)', position: 'absolute' }}/>
                    <img src={game.banner_img} style={{ objectFit: 'cover', width: '100%', height: '100%'}}/>
                </div>
                <div style={{ display: 'flex', marginTop: '75px' }}>
                    <img src={game.img} style={{ borderRadius: '10px',  height: '192px', width: '144px'  }}/>
                    <div style={{ marginLeft: '20px' }}>
                        <h1 style={{ color: 'white', marginBottom: '25px', fontSize: '50px' }}> {game.name} </h1>
                        <h6> <b>Product Types:</b> {game.product_types.map((platform, i) => {
                            if (i < game.product_types.length - 1) return platform + ', '
                            return platform
                        })} </h6>
                        <h6> <b>Platforms:</b> {game.platforms.map((platform, i) => {
                            if (i < game.platforms.length - 1) return platform + ', '
                            return platform
                        })} </h6>
                    </div>
                </div>
                <div style={{ marginTop: '20px', marginBottom: '40px', display: 'flex' }}>
                    <div style={{  marginRight: '10px', width: '30%' }}>
                        <label for="emailInput" className="form-label" style={{ marginTop: '10px' }}>Search</label>
                        <input className="form-control" value={name} placeholder={'Cheap Gold'} onKeyPress={handleKeyPress} onChange={handleName}/>
                    </div>
                    <div style={{ width: '70%', display: 'flex' }}>
                        <div style={{ marginRight: '10px', width: '100%' }}>
                            <label for="emailInput" className="form-label" style={{ marginTop: '10px' }}>Type</label>
                            <select className="form-control" type='select' value={productType} placeholder={'Search'} onKeyPress={handleKeyPress} onChange={handleProductType}>
                                <option value={''} disabled hidden> Select </option>
                                { game.product_types.map((type) => {
                                    return <option value={type}> {type} </option>
                                })}
                            </select>
                        </div>
                        <div style={{ marginRight: '10px', width: '100%' }}>
                            <label for="emailInput" className="form-label" style={{ marginTop: '10px' }}>Delivery</label>
                            <select className="form-control" type='select' value={deliveryType} placeholder={'Search'} onKeyPress={handleKeyPress} onChange={handleDeliveryType}>
                                <option value={''} disabled hidden> Select </option>
                                <option value={'face-to-face'}> face-to-face </option>
                                <option value={'automatic'}> automatic </option>
                                <option value={'remote'}> remote </option>                     
                            </select>
                        </div>
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

                <div>
                    { products.map((product) => {
                        return <ProductCard product={product}/>
                    })}
                </div>
            </div> : null }
        </Layout>
    )
}

export default Game