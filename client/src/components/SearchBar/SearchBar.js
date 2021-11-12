import React, { useState } from 'react'
import { useHistory } from 'react-router';

const SearchBar = (props) => {
    const [focused, setFocused] = useState(false)
    const [name, setName] = useState('')
    const history = useHistory()

    const handleName = (e) => {
        setName(e.target.value)
    }

    const handleEnter = (e) => {
        if (e.key === 'Enter') history.push(`/games?q=${name}`)
    }

    return (
        <div className="col-md-6 col-lg-4" style={{ marginLeft: '10px' }}> 
            <div className="input-group">
                <input style={{ border: 'none', backgroundColor: focused ? 'white' : 'black', border: '1px solid rgba(255,255,255,.3)', borderRadius: '20px', transition: 'background-color 200ms ease' }}
                  className="form-control me-2"
                  type="search"
                  placeholder="Search games..."
                  aria-label="Search"
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  value={name}
                  onChange={handleName}
                  onKeyPress={handleEnter}/>
            </div>
        </div>
      )
}
export default SearchBar