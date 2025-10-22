import React from 'react';
import MainLayout from '../Layout/MainLayout';
import PaymentsPage from './PaymentsPage';

const Payments = () => {
  return (
    <MainLayout
      title="Gestión de Pagos"
      description="Registra y consulta todos los pagos realizados"
    >
      <div className="payments-container">
        <PaymentsPage />
      </div>
    </MainLayout>
  );
};

export default Payments;