import React, { useState } from 'react'
import { useHistory } from 'react-router';

const SearchBar = (props) => {
    const [name, setName] = useState('')
    const history = useHistory()

    const handleName = (e) => {
        setName(e.target.value)
    }

    const handleEnter = (e) => {
        if (e.key === 'Enter') history.push(`/games?q=${name}`)
    }

    return (
        <div className="search-bar col-md-6 col-lg-4" style={{ marginLeft: '10%' }}> 
            <div className="input-group">
                <input style={{ border: 'none' }}
                  className="form-control me-2"
                  type="search"
                  placeholder="Search games"
                  aria-label="Search"
                  value={name}
                  onChange={handleName}
                  onKeyPress={handleEnter}/>
            </div>
        </div>
      )
}
export default SearchBar