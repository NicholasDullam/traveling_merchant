import React from "react";
import QueryResult from "../QueryResult/QueryResult";

const QueryResultsList = (props) =>{
 
console.log(props.results)

 var arr = props.results.map((result) =>
 <QueryResult name={result.name} type={result.type} description={result.description} price={result.price}
 ></QueryResult>
 )
 
 
    return (
        
        <p>
        {props.results[0].name}
        </p>
    )
}

export default QueryResultsList;