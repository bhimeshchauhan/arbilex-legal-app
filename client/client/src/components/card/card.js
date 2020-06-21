import React from 'react';
import './card.css';

const Card = (props) => {
  return (
    <div className="container">
        <div className="card">
            <div className="card-body">
                <div className="card-detail">
                    <div className="card-number">
                        <span>22</span>
                    </div>
                </div>
                <h2 className="card-title">
                    Number of Justices
                </h2>
            </div>
        </div>
    </div>
  );
};
 
export default Card;