import React from 'react';
import './Header.css';

const Header: React.FC = () => {
  return (
    <header className="app-header w-full ">
      <div className="header-content">
        <div className="brand-container">
          <div className="logo">
            <span className="logo-symbol">∑</span>
          </div>
          <h1 className="app-title">
            Num<span className="shimmer-text">Wiz!</span>
          </h1>
          <p className="app-subtitle">Calculator</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
