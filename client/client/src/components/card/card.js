import React from 'react';
import './card.css';

const Card = (props) => {
  return (
    <div className="card-container">
        <div className="card">
            <div className="card-body">
                <div className="card-detail">
                    <div className="card-number">
                        <span>{props.data.value}</span>
                    </div>
                </div>
                <h2 className="card-title">
                    {props.data.name}
                </h2>
            </div>
        </div>
    </div>
  );
};
 
export default Card;