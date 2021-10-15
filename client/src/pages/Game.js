import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import api from '../api'
import Layout from '../components/Layout/Layout'

const Game = (props) => {
    const [game, setGame] = useState(null)
    const [products, setProducts] = useState([])
    const [name, setName] = useState('')
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
        getProducts(params)
    }

    const handleName = (e) => {
        setName(e.target.value)
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') handleSearch()
    }

    return (
        <Layout navbar>
            { game ? <div style={{ marginTop: '40px', marginBottom: '40px'}}>
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
                        <label for="emailInput" className="form-label" style={{ marginTop: '10px' }}>Product Type</label>
                        <select className="form-control" type='select' value={name} placeholder={'Search'} onKeyPress={handleKeyPress} onChange={handleName}>
                            <option value={'test'}> </option>
                        </select>
                    </div>
                    <div style={{ marginRight: '10px'  }}>
                        <label for="emailInput" className="form-label" style={{ marginTop: '10px' }}>Delivery Type</label>
                        <select className="form-control" type='select' value={name} placeholder={'Search'} onKeyPress={handleKeyPress} onChange={handleName}>
                            <option value={'test'}> </option>
                        </select>
                    </div>
                    <div style={{ marginRight: '10px'  }}>
                        <label for="emailInput" className="form-label" style={{ marginTop: '10px' }}>Delivery Time</label>
                        <select className="form-control" type='select' value={name} placeholder={'Search'} onKeyPress={handleKeyPress} onChange={handleName}>
                            <option value={'test'}> </option>
                        </select>
                    </div>
                </div>

                <div>
                    {
                        products.map((product) => {
                            return (
                                <div>
                                    { product.name }
                                </div>
                            )
                        })
                    }
                </div>
            </div> : null }
        </Layout>
    )
}

export default Game