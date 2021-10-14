import React, {useState} from 'react'
import axios from 'axios'

const SearchBar=(props) => {
const [query, setQuery] = useState("")
 
var productNames = [];

axios.get("http://localhost:8000/api/products")
.then(result => 
    console.log("result" + result)
    // productNames.push(result.name)

)

// console.log(productNames)

// get all game items in the db, apply filter to them


const handleFilter = (e) => {
    const query = e.target.value;
    setQuery(query);

}
return (
    <div className="search-bar mx-auto col-md-6 col-lg-4"> 
    <form className="d-flex">
      <div className="input-group">
      <input
        className="form-control me-2"
        type="search"
        placeholder="Search games, game assets..."
        aria-label="Search"
        value={query}
      onChange={handleFilter}
      />
      </div>
  
      <button className="btn btn-outline-success" type="submit">
        Search
      </button>
    </form>
    </div>
    )
}
export default SearchBar