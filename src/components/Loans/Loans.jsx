import React, { useState } from 'react';
import MainLayout from '../Layout/MainLayout';
import LoanList from './LoanList';
import LoanForm from './LoanForm';
import './Loans.css';

const Loans = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingLoan, setEditingLoan] = useState(null);

  const handleNewLoan = () => {
    setEditingLoan(null);
    setShowForm(true);
  };

  const handleEditLoan = (loan) => {
    setEditingLoan(loan);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingLoan(null);
  };

  return (
    <MainLayout
      title="Gestión de Préstamos"
      description="Administra y realiza seguimiento a todos los préstamos"
    >
      <div className="loans-container">
        <div className="page-actions">
          <button className="btn-primary" onClick={handleNewLoan}>
            <i className="fas fa-plus"></i>
            Nuevo Préstamo
          </button>
        </div>

        {showForm ? (
          <LoanForm 
            loan={editingLoan} 
            onClose={handleCloseForm} 
            onSave={handleCloseForm}
          />
        ) : (
          <LoanList onEditLoan={handleEditLoan} />
        )}
      </div>
    </MainLayout>
  );
};

export default Loans;