import React, { useState } from 'react';
import MainLayout from '../Layout/MainLayout';
import './Settings.css';

const Settings = () => {
  const [settings, setSettings] = useState({
    companyName: 'MoneyLoanApp',
    currency: 'USD',
    interestRate: 12.5,
    maxLoanAmount: 10000,
    notifications: true,
    autoBackup: true
  });

  const handleSave = () => {
    // Lógica para guardar configuraciones
    alert('Configuraciones guardadas correctamente');
  };

  return (
    <MainLayout
      title="Configuración del Sistema"
      description="Personaliza la configuración de tu aplicación"
    >
      <div className="settings-container">
        <div className="settings-form">
          <div className="form-section">
            <h3>Información de la Empresa</h3>
            <div className="form-group">
              <label>Nombre de la Empresa</label>
              <input 
                type="text" 
                value={settings.companyName}
                onChange={(e) => setSettings({...settings, companyName: e.target.value})}
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Configuración de Préstamos</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Tasa de Interés (%)</label>
                <input 
                  type="number" 
                  value={settings.interestRate}
                  onChange={(e) => setSettings({...settings, interestRate: parseFloat(e.target.value)})}
                />
              </div>
              <div className="form-group">
                <label>Monto Máximo de Préstamo</label>
                <input 
                  type="number" 
                  value={settings.maxLoanAmount}
                  onChange={(e) => setSettings({...settings, maxLoanAmount: parseInt(e.target.value)})}
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Preferencias del Sistema</h3>
            <div className="switch-group">
              <label>
                <input 
                  type="checkbox" 
                  checked={settings.notifications}
                  onChange={(e) => setSettings({...settings, notifications: e.target.checked})}
                />
                Notificaciones por correo
              </label>
            </div>
            <div className="switch-group">
              <label>
                <input 
                  type="checkbox" 
                  checked={settings.autoBackup}
                  onChange={(e) => setSettings({...settings, autoBackup: e.target.checked})}
                />
                Backup automático
              </label>
            </div>
          </div>

          <div className="form-actions">
            <button className="btn-primary" onClick={handleSave}>
              Guardar Configuración
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Settings;