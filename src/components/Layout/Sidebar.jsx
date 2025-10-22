import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = ({ isCollapsed, onToggle, activeMenu }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', icon: 'fas fa-home', label: 'Dashboard', key: 'dashboard' },
    { path: '/loans', icon: 'fas fa-hand-holding-usd', label: 'Préstamos', key: 'loans' },
    { path: '/clients', icon: 'fas fa-users', label: 'Clientes', key: 'clients' },
    { path: '/payments', icon: 'fas fa-money-bill-wave', label: 'Pagos', key: 'payments' },
    { path: '/reports', icon: 'fas fa-chart-bar', label: 'Reportes', key: 'reports' },
    { path: '/settings', icon: 'fas fa-cog', label: 'Configuración', key: 'settings' },
  ];

  const handleMenuClick = (path, key) => {
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <h2 className="logo">{isCollapsed ? 'MLA' : 'MoneyLoanApp'}</h2>
        <button className="sidebar-toggle" onClick={onToggle}>
          <i className={`fas ${isCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'}`}></i>
        </button>
      </div>
      
      <nav className="sidebar-menu">
        {menuItems.map((item) => (
          <button
            key={item.key}
            className={`menu-item ${location.pathname === item.path ? 'active' : ''}`}
            onClick={() => handleMenuClick(item.path, item.key)}
            title={isCollapsed ? item.label : ''} // Tooltip cuando está colapsado
          >
            <i className={item.icon}></i>
            {!isCollapsed && <span className="menu-text">{item.label}</span>}
          </button>
        ))}
        
        <button className="menu-item logout-btn" onClick={handleLogout} title={isCollapsed ? "Cerrar Sesión" : ""}>
          <i className="fas fa-sign-out-alt"></i>
          {!isCollapsed && <span className="menu-text">Cerrar Sesión</span>}
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;