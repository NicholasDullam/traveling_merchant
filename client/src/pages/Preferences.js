import React, {useState,useEffect, useContext} from "react";

import AuthContext from "../context/auth-context"


const Preferences = (props) => {
    const auth = useContext(AuthContext)

    const handleCookies= () => {
        auth.changeCookies();
    }

    var checkbox = "";
    if(auth.hasCookies) {
   checkbox=  <input  type="checkbox" checked onChange={handleCookies}></input>
    }
    else {
        checkbox=  <input  type="checkbox" onChange={handleCookies}></input>

    }
    const [isDark, setIsDark] = useState(false);
    var moon = "🌙"
    var sun = "🔆"

    useEffect(() => {
        if (isDark) document.body.classList.add('dark');
        else document.body.classList.remove('dark');
    }, [isDark]); 

    const changeDarkness = () => {
        setIsDark(!isDark)
    }

   

    return (
        <div>
            <h5 style={{ marginBottom: '20px' }}> Preferences </h5>
<p> Dark mode </p>
            <button className="btn" onClick={changeDarkness}>{isDark? moon: sun}</button>
        <p> Cookies </p>
        <p>Allow all cookies   {checkbox}</p> 
      
        </div>
    )
}

export default Preferences