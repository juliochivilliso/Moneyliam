import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import './Layout.css';

const MainLayout = ({ children, title, description }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const userData = {
    name: "Admin User",
    role: "Administrador",
    email: "admin@moneyloanapp.com"
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const toggleMobileMenu = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  return (
    <div className={`main-layout ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        onToggle={toggleSidebar}
        className={isMobileOpen ? 'mobile-open' : ''}
      />
      
      <div className="main-content">
        <TopBar 
          onMenuToggle={toggleMobileMenu} 
          userData={userData} 
        />
        
        <main className="page-content">
          <div className="page-header">
            <h1>{title}</h1>
            <p>{description}</p>
          </div>
          
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;