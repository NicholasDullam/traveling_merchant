import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import api from '../api'
import { ProductCard } from '../components'
import Layout from '../components/Layout/Layout'

const Game = (props) => {
    const [game, setGame] = useState(null)
    const [products, setProducts] = useState([])
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
        api.getProducts({ params: req}).then((response) => {
            setProducts(response.data)
        }).catch((error) => {
            console.log(error)
        })
    }

    const handleSearch = () => {
        let params = { game_id }
        if (name.length) params.name = name 
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
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img src={game.img} style={{ borderRadius: '10px',  height: '192px', width: '144px'  }}/>
                    <div style={{ marginLeft: '40px' }}>
                        <h1> {game.name} </h1>
                        <h6> Product Types: {game.product_types.map((platform, i) => {
                            if (i < game.product_types.length - 1) return platform + ', '
                            return platform
                        })} </h6>
                        <h6> Platforms: {game.platforms.map((platform, i) => {
                            if (i < game.platforms.length - 1) return platform + ', '
                            return platform
                        })} </h6>
                    </div>
                </div>
                <div style={{ marginTop: '20px', marginBottom: '40px', display: 'flex' }}>
                    <div style={{  marginRight: '10px' }}>
                        <label for="emailInput" className="form-label" style={{ marginTop: '10px' }}>Search</label>
                        <input className="form-control" value={name} placeholder={'Cheap Gold'} onKeyPress={handleKeyPress} onChange={handleName}/>
                    </div>
                    <div style={{ marginRight: '10px'  }}>
                        <label for="emailInput" className="form-label" style={{ marginTop: '10px' }}>Type</label>
                        <select className="form-control" type='select' value={productType} placeholder={'Search'} onKeyPress={handleKeyPress} onChange={handleProductType}>
                            <option value={''} disabled hidden> Select </option>
                            { game.product_types.map((type) => {
                                return <option value={type}> {type} </option>
                            })}
                        </select>
                    </div>
                    <div style={{ marginRight: '10px'  }}>
                        <label for="emailInput" className="form-label" style={{ marginTop: '10px' }}>Delivery</label>
                        <select className="form-control" type='select' value={deliveryType} placeholder={'Search'} onKeyPress={handleKeyPress} onChange={handleDeliveryType}>
                            <option value={''} disabled hidden> Select </option>
                            <option value={'face-to-face'}> face-to-face </option>
                            <option value={'automatic'}> automatic </option>
                            <option value={'remote'}> remote </option>                     
                        </select>
                    </div>
                    <div style={{ marginRight: '10px'  }}>
                        <label for="emailInput" className="form-label" style={{ marginTop: '10px' }}>Platform</label>
                        <select className="form-control" type='select' value={platform} placeholder={'Search'} onKeyPress={handleKeyPress} onChange={handlePlatform}>
                            <option value={''} disabled hidden> Select </option>
                            { game.platforms.map((type) => {
                                return <option value={type}> {type} </option>
                            })}
                        </select>
                    </div>
                    <div style={{ marginRight: '10px'  }}>
                        <label for="emailInput" className="form-label" style={{ marginTop: '10px' }}>Server</label>
                        <select className="form-control" type='select' value={server} placeholder={'Search'} onKeyPress={handleKeyPress} onChange={handleServer}>
                            <option value={''} disabled hidden> Select </option>
                            { game.servers.map((type) => {
                                return <option value={type}> {type} </option>
                            })}
                        </select>
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