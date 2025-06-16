import React from 'react';
import './Loader.css'; 

const Loader = () => {
  return (
    <div className="loader-wrapper">
      <img src="/truck2.gif" alt="Loading animation" className="loader-truck" />
      <h2 className="loader-text">Vipreshana...</h2>
    </div>
  );
};

export default Loader;
