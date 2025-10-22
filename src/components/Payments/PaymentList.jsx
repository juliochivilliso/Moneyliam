import React, { useEffect, useState } from 'react';
import { supabase } from '../../config/supabase';

const PaymentList = () => {
    const [payments, setPayments] = useState([]);

    useEffect(() => {
        const fetchPayments = async () => {
            const { data, error } = await supabase
                .from('pagos')
                .select(`
                    id,
                    prestamo_id,
                    fecha_pago,
                    monto_pago,
                    metodo_pago,
                    observaciones,
                    prestamos (
                        id,
                        monto,
                        clientes (
                            id,
                            name
                        )
                    )
                `);
            if (!error) setPayments(data);
        };
        fetchPayments();
    }, []);

    return (
        <div className="table-container">
            <table className="loan-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Cliente</th>
                        <th>Préstamo</th>
                        <th>Fecha de Pago</th>
                        <th>Monto Pagado</th>
                        <th>Método</th>
                        <th>Observaciones</th>
                    </tr>
                </thead>
                <tbody>
                    {payments.map(payment => (
                        <tr key={payment.id}>
                            <td>{payment.id}</td>
                            <td>{payment.prestamos?.clientes?.name || 'Sin cliente'}</td>
                            <td>
                                #{payment.prestamo_id}
                                {payment.prestamos?.monto ? ` ($${payment.prestamos.monto})` : ''}
                            </td>
                            <td>{payment.fecha_pago}</td>
                            <td>${payment.monto_pago}</td>
                            <td>{payment.metodo_pago}</td>
                            <td>{payment.observaciones}</td>
                        </tr>
                    ))}
                    {payments.length === 0 && (
                        <tr>
                            <td colSpan={7} style={{ textAlign: 'center', color: '#888' }}>
                                No hay pagos registrados.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default PaymentList;