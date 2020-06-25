import React, {useState, useEffect} from 'react';
import './percent.css';

const PercentLoader = (props) => {
    const [style, setStyle] = useState({});
    
    useState(() => {
        setTimeout(() => {
            const newStyle = {
              opacity: 1,
              width: `${props.percent}%`
            };
            setStyle(newStyle);
          }, 100);
    }, [props]);
    
    return (
        <div className="backdrop">
            <div className="progress">
                <div className="progress-done" style={style}>
                    {props.percent}%
                </div>
            </div>
        </div>
    );
};
 
export default PercentLoader;

