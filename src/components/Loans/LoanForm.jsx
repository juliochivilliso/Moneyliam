import React, { useEffect, useState } from 'react';
import { supabase } from '../../config/supabase';

const LoanForm = ({ loan, onClose, onSave }) => {
    const [clientes, setClientes] = useState([]);
    const [formData, setFormData] = useState(loan || {
        deudor_id: '',
        monto: '',
        interes: 12.5,
        meses: 12
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchClientes = async () => {
            const { data, error } = await supabase
                .from('clientes')
                .select('id, name');
            if (!error) setClientes(data);
        };
        fetchClientes();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        let error;
        if (loan) {
            // Actualizar préstamo existente
            ({ error } = await supabase
                .from('prestamos')
                .update({
                    deudor_id: formData.deudor_id,
                    monto: formData.monto,
                    interes: formData.interes,
                    meses: formData.meses
                })
                .eq('id', loan.id));
        } else {
            // Insertar nuevo préstamo
            ({ error } = await supabase
                .from('prestamos')
                .insert([{
                    deudor_id: formData.deudor_id,
                    monto: formData.monto,
                    interes: formData.interes,
                    meses: formData.meses
                }]));
        }
        setLoading(false);
        if (error) {
            alert('Error al guardar el préstamo: ' + error.message);
        } else {
            if (onSave) onSave();
            if (onClose) onClose();
        }
    };

    return (
        <div className="form-container">
            <div className="form-header">
                <h3>{loan ? 'Editar Préstamo' : 'Nuevo Préstamo'}</h3>
                <button onClick={onClose}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Cliente</label>
                    <select
                        name="deudor_id"
                        value={formData.deudor_id}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Seleccionar cliente</option>
                        {clientes.map(cliente => (
                            <option key={cliente.id} value={cliente.id}>
                                {cliente.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Monto del préstamo</label>
                    <input
                        type="number"
                        name="monto"
                        value={formData.monto}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label>Tasa de interés (%)</label>
                        <input
                            type="number"
                            step="0.1"
                            name="interes"
                            value={formData.interes}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Plazo (meses)</label>
                        <input
                            type="number"
                            name="meses"
                            value={formData.meses}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>
                <div className="form-actions">
                    <button type="button" onClick={onClose}>Cancelar</button>
                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Guardando...' : 'Guardar'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default LoanForm;