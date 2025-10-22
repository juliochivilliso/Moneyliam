import React, { useEffect, useState } from 'react';
import { supabase } from '../../config/supabase';

const LoanList = ({ onEditLoan }) => {
    const [loans, setLoans] = useState([]);
    const [clientes, setClientes] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            // Obtener préstamos
            const { data: prestamos, error: errorPrestamos } = await supabase
                .from('prestamos')
                .select('*');
            // Obtener clientes
            const { data: clientesData, error: errorClientes } = await supabase
                .from('clientes')
                .select('id, name');
            if (errorPrestamos) {
                alert('Error al cargar préstamos: ' + errorPrestamos.message);
                return;
            }
            if (errorClientes) {
                alert('Error al cargar clientes: ' + errorClientes.message);
                return;
            }
            setClientes(clientesData);

            // Asociar nombre del cliente a cada préstamo
            const prestamosConNombre = prestamos.map(loan => {
                const cliente = clientesData.find(c => c.id === loan.deudor_id);
                return {
                    ...loan,
                    cliente_nombre: cliente ? cliente.name : 'Desconocido'
                };
            });
            setLoans(prestamosConNombre);
        };
        fetchData();
    }, []);

    return (
        <div className="table-container">
            <table className="loan-table">
                <thead>
                    <tr>
                        <th>Cliente</th>
                        <th>Monto</th>
                        <th>Interés (%)</th>
                        <th>Meses</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {loans.map(loan => (
                        <tr key={loan.id}>
                            <td>{loan.cliente_nombre}</td>
                            <td>${loan.monto}</td>
                            <td>{loan.interes}</td>
                            <td>{loan.meses}</td>
                            <td>
                                <button className="btn-outline" onClick={() => onEditLoan(loan)}>
                                    Editar
                                </button>
                            </td>
                        </tr>
                    ))}
                    {loans.length === 0 && (
                        <tr>
                            <td colSpan={5} style={{ textAlign: 'center', color: '#888' }}>
                                No hay préstamos registrados.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default LoanList;