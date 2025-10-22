import React, { useEffect, useState } from 'react';
import { supabase } from '../../config/supabase';

const PaymentForm = ({ onSave, onClose }) => {
    const [prestamos, setPrestamos] = useState([]);
    const [formData, setFormData] = useState({
        prestamo_id: '',
        fecha_pago: '',
        monto_pago: '',
        metodo_pago: '',
        observaciones: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchPrestamos = async () => {
            const { data, error } = await supabase
                .from('prestamos')
                .select(`
                    id,
                    monto,
                    clientes (
                        id,
                        name
                    )
                `);
            if (!error) setPrestamos(data);
        };
        fetchPrestamos();
    }, []);

    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        const { error } = await supabase
            .from('pagos')
            .insert([formData]);
        setLoading(false);
        if (error) {
            alert('Error al guardar el pago: ' + error.message);
        } else {
            alert('Pago registrado correctamente');
            if (onSave) onSave();
            if (onClose) onClose();
        }
    };

    return (
        <div className="form-container">
            <div className="form-header">
                <h3>Registrar Pago</h3>
                <button onClick={onClose}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Préstamo</label>
                    <select
                        name="prestamo_id"
                        value={formData.prestamo_id}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Seleccionar préstamo</option>
                        {prestamos.map(p => (
                            <option key={p.id} value={p.id}>
                                Préstamo #{p.id} - {p.clientes?.name || 'Sin cliente'} (${p.monto})
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Fecha de pago</label>
                    <input
                        type="date"
                        name="fecha_pago"
                        value={formData.fecha_pago}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Monto pagado</label>
                    <input
                        type="number"
                        name="monto_pago"
                        value={formData.monto_pago}
                        onChange={handleChange}
                        required
                    />
                </div>
<div className="form-group">
    <label>Método de pago</label>
    <select
        name="metodo_pago"
        value={formData.metodo_pago}
        onChange={handleChange}
        required
    >
        <option value="">Seleccionar método</option>
        <option value="Efectivo">Efectivo</option>
        <option value="Transferencia">Transferencia</option>
        <option value="Cheque">Cheque</option>
        <option value="Tarjeta">Tarjeta</option>
    </select>
</div>
                <div className="form-group">
                    <label>Observaciones</label>
                    <textarea
                        name="observaciones"
                        value={formData.observaciones}
                        onChange={handleChange}
                        rows={2}
                    />
                </div>
                <div className="form-actions">
                    <button type="button" onClick={onClose}>Cancelar</button>
                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Guardando...' : 'Guardar Pago'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PaymentForm;