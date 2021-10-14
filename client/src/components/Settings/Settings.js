import React from "react";
import Layout from "../Layout/Layout";
import VerticalNavbar from "../VerticalNavbar/VerticalNavbar";
const Settings = (props) => {

    return (
        <Layout navbar>
            <div class="row">
                <div class="col">
<VerticalNavbar></VerticalNavbar>
</div>
<div class="col">

{props.children}
</div>
</div>
        </Layout>
    )

} 

export default Settings;