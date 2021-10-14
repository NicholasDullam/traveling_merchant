import React, {useState} from 'react'
import { useHistory } from 'react-router';
import axios from 'axios'

const SearchBar=(props) => {

const history = useHistory();

const [query, setQuery] = useState("")
 
const [productsToDisplay, setProductsToDisplay] = useState([])

var products = [];

var i = 0;
axios.get("http://localhost:8000/api/products")
.then((result => 
result.data.forEach(product => 
  products.push(product)

)))
// productNames.push(result.data)


console.log(products)
// get all game items in the db, apply filter to them



function handleFilter (e) {
    const query = e.target.value;
    setQuery(query);
}

const handleSearch = () => {

  var arr = [];
  for(var i = 0; i < products.length; i++) {
    if(products[i].name.includes(query)) {
      console.log(products[i].name + "includes : " + query)
      console.log("includes query!");
      setProductsToDisplay(productsToDisplay.concat(products[i]))
      arr.push(products[i])
    // selectedProducts.push(products[i]);
    }
  }
  
  //TODO: For some reason, array cannot be accessed :((((
console.log("Handle Search: " +arr);

history.push({pathname:'/query_results', state: {
  query: query,
  productsToDisplay: arr
},})

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
  
      <button className="btn btn-outline-success" type="button" onClick= {handleSearch}>
        Search
      </button>
    </form>
    </div>
    )
}
export default SearchBar