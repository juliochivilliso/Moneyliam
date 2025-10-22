import React, { useState } from 'react';
import { supabase } from '../../config/supabase';

const ClientForm = ({ client, onClose, onSave }) => {
    const [formData, setFormData] = useState(client || {
        name: '',
        email: '',
        phone: '',
        address: ''
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            if (client) {
                // EDITAR cliente existente
                const { data, error } = await supabase
                    .from('clientes')
                    .update({
                        name: formData.name,
                        email: formData.email,
                        phone: formData.phone,
                        address: formData.address,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', client.id);
                
                if (error) throw error;
            } else {
                // CREAR nuevo cliente
                const { data, error } = await supabase
                    .from('clientes')
                    .insert([
                        {
                            name: formData.name,
                            email: formData.email,
                            phone: formData.phone,
                            address: formData.address,
                            status: 'Activo',
                            created_at: new Date().toISOString()
                        }
                    ])
                    .select();
                
                if (error) throw error;
            }
            
            onSave(formData); // Cerrar formulario y refrescar lista
        } catch (error) {
            console.error('Error guardando cliente:', error);
            alert('Error al guardar el cliente: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container">
            <div className="form-header">
                <h3>{client ? 'Editar Cliente' : 'Nuevo Cliente'}</h3>
                <button onClick={onClose}>×</button>
            </div>
            
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Nombre completo</label>
                    <input 
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required 
                        disabled={loading}
                    />
                </div>
                
                <div className="form-group">
                    <label>Email</label>
                    <input 
                        type="email" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required 
                        disabled={loading}
                    />
                </div>
                
                <div className="form-group">
                    <label>Teléfono</label>
                    <input 
                        type="tel" 
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        required 
                        disabled={loading}
                    />
                </div>
                
                <div className="form-group">
                    <label>Dirección</label>
                    <textarea 
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        rows="3"
                        disabled={loading}
                    />
                </div>
                
                <div className="form-actions">
                    <button type="button" onClick={onClose} disabled={loading}>
                        Cancelar
                    </button>
                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Guardando...' : 'Guardar'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ClientForm;