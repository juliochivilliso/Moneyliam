import React, { useState } from 'react';
import MainLayout from '../Layout/MainLayout';
import ClientList from './ClientList';
import ClientForm from './ClientForm';
import './Clients.css';

const Clients = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState(null);

  const handleNewClient = () => {
    setEditingClient(null);
    setShowForm(true);
  };

  const handleEditClient = (client) => {
    setEditingClient(client);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingClient(null);
  };

  return (
    <MainLayout
      title="Gestión de Clientes"
      description="Administra la información de todos los clientes"
    >
      <div className="clients-container">
        <div className="page-actions">
          <button className="btn-primary" onClick={handleNewClient}>
            <i className="fas fa-user-plus"></i>
            Nuevo Cliente
          </button>
        </div>

        {showForm ? (
          <ClientForm 
            client={editingClient} 
            onClose={handleCloseForm} 
            onSave={handleCloseForm}
          />
        ) : (
          <ClientList onEditClient={handleEditClient} />
        )}
      </div>
    </MainLayout>
  );
};

export default Clients;