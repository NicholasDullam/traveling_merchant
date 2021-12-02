import React, { createRef, useEffect, useRef, useState } from 'react'
import { useHistory, useParams } from 'react-router'
import api from '../api'
import { Collapsable, Pagination, ProductCard } from '../components'
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
        if (!ref || !ref.current) return {}
        let dimensions = ref.current.getBoundingClientRect()
        if (!containerRef || !containerRef.current) return {}
        let containerDimensions = containerRef.current.getBoundingClientRect()
        return { bottom: containerDimensions.bottom - dimensions.bottom, top: containerDimensions.top - dimensions.top, right: containerDimensions.right - dimensions.right, width: dimensions.width, height: dimensions.height }
    }

    return (
        <div ref={containerRef} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '-15px', position: 'relative', zIndex: '0', ...props.style }}>
            <div style={{ position: 'absolute', opacity: props.selected ? '1' : '0', top: getSelectedRect().bottom, right: getSelectedRect().right, width: getSelectedRect().width, height: getSelectedRect().height, backgroundColor: 'black', transform: 'translateY(0)', zIndex: '1', transition: 'right 300ms ease, width 300ms ease, opacity 300ms ease', borderRadius: '25px' }}/>

            {
                props.types.map((type, i) => {
                    return <div key={i} ref={refs[type]} style={{ display: 'flex', alignItems: 'center', padding: '6px 9px 6px 9px', borderRadius: '25px', margin: '5px', userSelect: 'none', color: props.selected === type ? 'white' : 'black', zIndex: '2', transition: 'color 300ms ease', cursor: 'pointer', userSelect: 'none' }} onClick={() => props.selected === type ? props.handleChange('') : props.handleChange(type)}>
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
    const [server, setServer] = useState(search.get('server') || '')
    const [platform, setPlatform] = useState(search.get('platform') || '')
    const [sort, setSort] = useState(search.get('sort') || '-unit_price')
    
    const [limit, setLimit] = useState(Number(search.get('limit')) || 5)
    const [page, setPage] = useState(Number(search.get('page')) || 1)
    const [hasMore, setHasMore] = useState(false)
    const [count, setCount] = useState(0)

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
    }, [game, page, limit, sort, productType, server, platform])



    //sort products based on user level
const sortProducts = (data) => {
    if(data.length <2) {
        return;
    }
    console.log(data);
var productAndLevel = [];
    data.forEach(product => {
        console.log(product)
        api.getUserById(product.user).then((response) => {
           console.log(response.data.lvl)
            const obj = new Object();
            obj.product = product;
            obj.level = response.data.lvl;
            productAndLevel.push (obj);
               
        })
    })

    console.log(productAndLevel);

for(var i = 0 ; i < productAndLevel.length; i++) {
    for(var j  = 1; j < productAndLevel.length; j++) {
        if(productAndLevel[i].level > productAndLevel[j].level) {
            var temp = productAndLevel[j];
            productAndLevel[j] = productAndLevel[i];
            productAndLevel[i] = temp;
        }
    }
}
var sortedProducts = [];
var count = 0;

console.log(productAndLevel.length)
for(var k = 0; k < productAndLevel.length; k++) {
    console.log("yo pls print: " + productAndLevel[i]);
    // var obj = productAndLevel[i];
    //  console.log("product: "+ obj.product  +  ", level: " + obj.level);
    //  sortedProducts.push(obj.product)
}

 console.log(sortedProducts);


}



async function getProducts (req) {
    const data = await api.getProducts({ params: req }).then((response) => {
            let { data, results } = response.data
            setProducts(data)
            setHasMore(results.has_more)
            setCount(results.count)
            console.log("sort products");
            return data;
        }).catch((error) => {
            console.log(error)
        })

        sortProducts(data)

    }

const getSeller = () => {

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
        if (server.length) queryString = queryString.length ? queryString + `&server=${server}` : `server=${server}`
        if (platform.length) queryString = platform.length ? queryString + `&platform=${platform}` : `platform=${platform}`
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

                {/* products */}
                <div style={{ display: 'flex', marginTop: '80px', marginBottom: '40px', height: '100%' }}>

                    {/* product filtering */}
                    <div style={{ marginRight: '50px' }}>
                        <Collapsable head={<b>Search</b>}>
                            <input className="form-control" value={name} placeholder={'Cheap Gold'} onKeyPress={handleKeyPress} onChange={handleName}/>
                        </Collapsable>
                        <Collapsable head={<b>Platforms</b>} initial={true}>
                            {
                                game.platforms.map((plat, i) => {
                                    return <div key={i} style={{ padding: '5px', backgroundColor: plat === platform ? 'black' : 'rgba(0,0,0,0.05)', color: plat === platform ? 'white' : '', borderRadius: '10px', marginBottom: '5px', cursor: 'pointer', transition: 'box-shadow 300ms ease', transition: 'color 300ms ease, background-color 300ms ease' }} onClick={() => plat === platform ? setPlatform('') : setPlatform(plat)}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <p style={{ marginBottom: '0px', fontSize: '14px' }}> {plat} </p>
                                        </div>
                                    </div>                                
                                })
                            }
                        </Collapsable>
                        <Collapsable head={<b>Servers</b>} initial={true}>
                            {
                                game.servers.map((serv, i) => {
                                    return <div key={i} style={{ padding: '5px', backgroundColor: serv === server ? 'black' : 'rgba(0,0,0,0.05)', color: serv === server ? 'white' : '', borderRadius: '10px', marginBottom: '5px', cursor: 'pointer', transition: 'box-shadow 300ms ease', transition: 'color 300ms ease, background-color 300ms ease' }} onClick={() => serv === server ? setServer('') : setServer(serv)}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <p style={{ marginBottom: '0px', fontSize: '14px' }}> {serv} </p>
                                        </div>
                                    </div>                                
                                })
                            }
                        </Collapsable>
                        <Collapsable head={<b>Price</b>} initial={true}>
                            <div style={{ padding: '5px', backgroundColor: sort === '-unit_price' ? 'black' : 'rgba(0,0,0,0.05)', color: sort === '-unit_price' ? 'white' : '', borderRadius: '10px', marginBottom: '5px', cursor: 'pointer', transition: 'box-shadow 300ms ease', transition: 'color 300ms ease, background-color 300ms ease' }} onClick={() => sort === '-unit_price' ? setSort('') : setSort('-unit_price')}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <p style={{ marginBottom: '0px', fontSize: '14px' }}> High to Low </p>
                                </div>
                            </div>  
                            <div style={{ padding: '5px', backgroundColor: sort === 'unit_price' ? 'black' : 'rgba(0,0,0,0.05)', color: sort === 'unit_price' ? 'white' : '', borderRadius: '10px', marginBottom: '5px', cursor: 'pointer', transition: 'box-shadow 300ms ease', transition: 'color 300ms ease, background-color 300ms ease' }} onClick={() => sort === 'unit_price' ? setSort('') : setSort('unit_price')}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <p style={{ marginBottom: '0px', fontSize: '14px' }}> Low to High </p>
                                </div>
                            </div>  
                        </Collapsable>
                        {/* <button class="btn btn-primary" onClick={handleSort}>Sort</button> */ }
                    </div>
                    
                    {/* product listings */}
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <TypeSelector types={game.product_types} selected={productType} handleChange={setProductType}/>
                        <p style={{ opacity: '.7', marginBottom: '20px' }}> About {count} results </p>
                        { products.map((product) => {
                            return <ProductCard product={product}/>
                        })}
                        <Pagination style={{ marginTop: 'auto' }} limit={limit} page={page} hasMore={hasMore} handlePageChange={setPage} handleLimitChange={setLimit}/>
                    </div>
                </div>
            </div> : null }
        </Layout>
    )
}

export default Game