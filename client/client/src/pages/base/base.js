import React from 'react';
import NavBar from '../../components/navbar/navbar';

const BaseTemplate = (props) => {
  return (
    <div>
      <NavBar title={props.title} />
    </div>
  );
};
 
export default BaseTemplate;