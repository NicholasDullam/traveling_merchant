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

    return (
        <div>
            <h5 style={{ marginBottom: '20px' }}> Preferences </h5>
            <button className="btn" onClick={changeDarkness}>{isDark? moon: sun}</button>
        </div>
    )
}

export default Preferences