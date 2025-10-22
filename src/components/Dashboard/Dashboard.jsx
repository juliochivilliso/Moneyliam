import React from 'react';
import MainLayout from '../Layout/MainLayout';
import './DashboardStyle.css';

const Dashboard = () => {
  // Datos hardcode para el dashboard
  const userData = {
    name: "Admin User",
    role: "Administrador",
    email: "admin@moneyloanapp.com"
  };

  const statsData = [
    { title: 'Préstamos Activos', value: '$245,800', icon: 'fas fa-hand-holding-usd', color: '#4CAF50' },
    { title: 'Clientes Activos', value: '154', icon: 'fas fa-users', color: '#2196F3' },
    { title: 'Ingresos del Mes', value: '$42,350', icon: 'fas fa-money-check', color: '#FF9800' },
    { title: 'Pagos Pendientes', value: '27', icon: 'fas fa-file-invoice-dollar', color: '#9C27B0' }
  ];

  const recentLoans = [
    { id: 1, client: 'Carlos Rodríguez', amount: '$5,000', date: '15/06/2023', status: 'Activo' },
    { id: 2, client: 'María González', amount: '$3,500', date: '14/06/2023', status: 'Pendiente' },
    { id: 3, client: 'Javier López', amount: '$7,200', date: '13/06/2023', status: 'Activo' },
    { id: 4, client: 'Ana Martínez', amount: '$2,800', date: '12/06/2023', status: 'Rechazado' }
  ];

  const topClients = [
    { id: 1, name: 'Laura Sánchez', completed: 5, score: '98%' },
    { id: 2, name: 'Roberto Díaz', completed: 3, score: '95%' },
    { id: 3, name: 'Carmen Vargas', completed: 4, score: '93%' },
    { id: 4, name: 'Diego Herrera', completed: 2, score: '91%' }
  ];

  return (
    <MainLayout
      title="Panel de Control"
      description="Resumen general de tu empresa de préstamos"
    >
      {/* Stats Grid */}
      <div className="stats-grid">
        {statsData.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: stat.color }}>
              <i className={stat.icon}></i>
            </div>
            <div className="stat-info">
              <h3>{stat.value}</h3>
              <p>{stat.title}</p>
              <div className="stat-trend">
                <i className="fas fa-arrow-up"></i>
                <span>+2.5%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Content Grid */}
      <div className="content-grid">
        {/* Left Column */}
        <div className="left-column">
          <div className="card">
            <div className="card-header">
              <h3>Préstamos Recientes</h3>
              <button className="view-all-btn">Ver todos</button>
            </div>
            
            <div className="table-container">
              <table className="loans-table">
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Monto</th>
                    <th>Fecha</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {recentLoans.map(loan => (
                    <tr key={loan.id}>
                      <td>
                        <div className="client-cell">
                          <div className="client-avatar">
                            {loan.client.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div className="client-name">{loan.client}</div>
                          </div>
                        </div>
                      </td>
                      <td className="amount">{loan.amount}</td>
                      <td className="date">{loan.date}</td>
                      <td>
                        <span className={`status-badge status-${loan.status.toLowerCase()}`}>
                          {loan.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="card">
            <div className="card-header">
              <h3>Ingresos Mensuales</h3>
              <button className="view-all-btn">Ver reporte</button>
            </div>
            
            <div className="chart-container">
              <div className="chart-bars">
                <div className="chart-bar" style={{ height: '40%' }}>
                  <span className="bar-value">$40K</span>
                </div>
                <div className="chart-bar" style={{ height: '60%' }}>
                  <span className="bar-value">$60K</span>
                </div>
                <div className="chart-bar" style={{ height: '80%' }}>
                  <span className="bar-value">$80K</span>
                </div>
                <div className="chart-bar" style={{ height: '100%' }}>
                  <span className="bar-value">$100K</span>
                </div>
                <div className="chart-bar" style={{ height: '70%' }}>
                  <span className="bar-value">$70K</span>
                </div>
                <div className="chart-bar" style={{ height: '90%' }}>
                  <span className="bar-value">$90K</span>
                </div>
              </div>
              <div className="chart-labels">
                <span>Ene</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Abr</span>
                <span>May</span>
                <span>Jun</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Column */}
        <div className="right-column">
          <div className="card">
            <div className="card-header">
              <h3>Clientes con Mejor Score</h3>
              <button className="view-all-btn">Ver todos</button>
            </div>
            
            <div className="clients-list">
              {topClients.map(client => (
                <div key={client.id} className="client-row">
                  <div className="client-info">
                    <div className="client-avatar">
                      {client.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="client-details">
                      <h4>{client.name}</h4>
                      <span>{client.completed} préstamos completados</span>
                    </div>
                  </div>
                  <div className="score-badge">{client.score}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="card">
            <div className="card-header">
              <h3>Acciones Rápidas</h3>
            </div>
            
            <div className="quick-actions">
              <a href="#" className="action-btn">
                <i className="fas fa-plus-circle"></i>
                <span>Nuevo Préstamo</span>
              </a>
              
              <a href="#" className="action-btn">
                <i className="fas fa-user-plus"></i>
                <span>Agregar Cliente</span>
              </a>
              
              <a href="#" className="action-btn">
                <i className="fas fa-file-invoice-dollar"></i>
                <span>Registrar Pago</span>
              </a>
              
              <a href="#" className="action-btn">
                <i className="fas fa-chart-pie"></i>
                <span>Generar Reporte</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;