import React from 'react';
import './card.css';

const Card = (props) => {
  return (
    <div class="container">
        <div class="card">
            <div class="card-body">
                <h2 class="card-title">
                    Drive (2011)
                </h2>
                <p class="card-intro">
                    Driver is a skilled Hollywood stuntman who moonlights as a getaway driv...
                </p>
            </div>
        </div>
    </div>
  );
};
 
export default Card;