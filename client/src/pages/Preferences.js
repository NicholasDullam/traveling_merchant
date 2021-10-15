import React, {useState,useEffect} from "react";

const Preferences = (props) => {
    

    const [isDark, setIsDark] = useState(false);
    var moon = "🌙"
    var sun = "🔆"
    useEffect(() => {
        if (isDark) {
          document.body.classList.add('dark');
        } else {
          document.body.classList.remove('dark');
        }
      }, [isDark]); 

function changeDarkness() {
            setIsDark(!isDark)
}

    return (
        <div>
            <div style={{ maxWidth: '600px'}}>
                <div style={{ display: 'flex'}}>
                 <button className="btn" onClick={changeDarkness}>{isDark? moon: sun}</button>
        </div>
        
        </div></div>

    )
}

export default Preferences