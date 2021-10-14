import React from "react";
import Layout from "../components/Layout/Layout";

import { useLocation } from "react-router";
import QueryResultsList from "../components/QueryResultsList/QueryResultsList";


const QueryResultsPage = (props) => {
    const location = useLocation()

console.log(location.state.query)
console.log(location.state.productsToDisplay)

return (
    <Layout navbar>
      <QueryResultsList results={location.state.productsToDisplay}/>
        {/* All listings  */}
    </Layout>
)


}

export default  QueryResultsPage