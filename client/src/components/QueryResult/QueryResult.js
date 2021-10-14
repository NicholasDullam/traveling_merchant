import React from "react";

const QueryResult = (props) => {

return(

<div>
<p>{props.name}</p>
<p>{props.type}</p>
<p>{props.description}</p>
<p>{props.price}</p>
</div>

)

}

export default QueryResult;