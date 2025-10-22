import React from 'react';

const TopBar = ({ onMenuToggle, userData }) => {
  return (
    <header className="top-bar">
      <div className="top-bar-left">
        <button className="mobile-menu-toggle" onClick={onMenuToggle}>
          <i className="fas fa-bars"></i>
        </button>
        <div className="search-box">
          <i className="fas fa-search"></i>
          <input type="text" placeholder="Buscar..." />
        </div>
      </div>
      
      <div className="user-profile">
        <div className="user-info">
          <h4>{userData.name}</h4>
          <span>{userData.role}</span>
        </div>
        <div className="user-avatar">
          {userData.name.split(' ').map(n => n[0]).join('')}
        </div>
      </div>
    </header>
  );
};

export default TopBar;