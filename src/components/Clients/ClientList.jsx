import React, { useEffect, useState } from 'react';
import { supabase } from '../../config/supabase';

const ClientList = ({ onEditClient }) => {
    const [clients, setClients] = useState([]);

    useEffect(() => {
        const fetchClients = async () => {
            const { data, error } = await supabase
                .from('clientes')
                .select('*');
            if (error) {
                console.error('Error fetching clients:', error);
            } else {
                setClients(data);
            }
        };
        fetchClients();
    }, []);

    return (
        <div className="client-table-container">
            <table className="client-table">
                <thead>
                    <tr>
                        <th>Cliente</th>
                        <th>Contacto</th>
                        <th>Préstamos Activos</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {clients.map(client => (
                        <tr key={client.id}>
                            <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div className="client-avatar">
                                        {client.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <span>{client.name}</span>
                                </div>
                            </td>
                            <td>
                                <div>{client.email}</div>
                                <div style={{ fontSize: '12px', color: '#666' }}>{client.phone}</div>
                            </td>
                            <td>{client.loans ?? 0}</td>
                            <td>
                                <span className={client.status === 'Activo' ? 'status-active' : 'status-inactive'}>
                                    {client.status}
                                </span>
                            </td>
                            <td>
                                <button 
                                    className="btn-outline"
                                    onClick={() => onEditClient(client)}
                                    style={{ padding: '5px 10px', fontSize: '12px' }}
                                >
                                    Editar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ClientList;