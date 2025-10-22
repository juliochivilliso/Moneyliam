import React from 'react';
import MainLayout from '../Layout/MainLayout';
import './Reports.css';

const Reports = () => {
  const reportCards = [
    {
      title: 'Reporte de Préstamos',
      description: 'Resumen completo de préstamos activos y finalizados',
      icon: 'fas fa-hand-holding-usd',
      color: '#3498db'
    },
    {
      title: 'Reporte de Pagos',
      description: 'Historial detallado de todos los pagos',
      icon: 'fas fa-money-check',
      color: '#27ae60'
    },
    {
      title: 'Reporte de Clientes',
      description: 'Análisis del comportamiento de clientes',
      icon: 'fas fa-users',
      color: '#e74c3c'
    },
    {
      title: 'Reporte Financiero',
      description: 'Estado financiero general de la empresa',
      icon: 'fas fa-chart-line',
      color: '#f39c12'
    }
  ];

  return (
    <MainLayout
      title="Reportes y Análisis"
      description="Genera reportes detallados de tu negocio"
    >
      <div className="reports-container">
        <div className="reports-grid">
          {reportCards.map((report, index) => (
            <div key={index} className="report-card">
              <div className="report-icon" style={{ backgroundColor: report.color }}>
                <i className={report.icon}></i>
              </div>
              <div className="report-content">
                <h3>{report.title}</h3>
                <p>{report.description}</p>
                <button className="btn-outline">
                  Generar Reporte
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Reports;