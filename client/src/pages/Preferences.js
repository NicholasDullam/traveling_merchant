import React, {useState,useEffect} from "react";

const Preferences = (props) => {
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

    const handleCookies= () => {

    }

    return (
        <div>
            <h5 style={{ marginBottom: '20px' }}> Preferences </h5>
<p> Dark mode </p>
            <button className="btn" onClick={changeDarkness}>{isDark? moon: sun}</button>
        <p> Cookies </p>
        <p>Allow all cookies   <input type="checkbox" onChange={handleCookies}></input></p> 
      
        </div>
    )
}

export default Preferences