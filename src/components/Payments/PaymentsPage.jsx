import React, { useState } from 'react';
import PaymentForm from './PaymentForm';
import PaymentList from './PaymentList';

const PaymentsPage = () => {
    const [showForm, setShowForm] = useState(false);

    const handleOpenForm = () => setShowForm(true);
    const handleCloseForm = () => setShowForm(false);

    return (
        <div>
            <button className="btn-primary" onClick={handleOpenForm}>
                Registrar Pago
            </button>
            {showForm && (
                <PaymentForm
                    onSave={handleCloseForm}
                    onClose={handleCloseForm}
                />
            )}
            {/* Aquí se muestra la lista de pagos */}
            <PaymentList />
        </div>
    );
};

export default PaymentsPage;