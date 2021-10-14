import React from "react";
import { Link } from "react-router-dom";
import Layout from "../Layout/Layout";

const VerticalNavbar = (props) => {

    return (
        <ul class="nav flex-column">
            <li class="nav-item">
        <Link to ="/account_info" class="nav-link"> Account info
        </Link>
        </li>
        <li class="nav-item">

        <Link to =" /favorites"> Favorites
        </Link>
        </li>
        <li class="nav-item">

        <Link to= "/reviews"> Reviews
        </Link>
        </li>
        <li class="nav-item">

<Link to ="/viewing_history"> Viewing History

</Link>
</li>
<li class="nav-item">

<Link to = "/orders">
     Orders
</Link>
</li>
<li class="nav-item">

<Link to="/billing"
> Billing
</Link>
</li>
<li class="nav-item">

<Link to ="/preferences"> Preferences</Link>
</li>
        </ul>
    )

}

export default VerticalNavbar