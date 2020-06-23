import React from 'react';
import './error.css';

const Error = (props) => {
  return (
    <div className="error">
        <div class="oaerror danger">
          <strong>Error</strong> - {props.message}
        </div>
    </div>
  );
};
 
export default Error;

