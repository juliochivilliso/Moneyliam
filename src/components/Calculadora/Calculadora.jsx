import React, { useState } from 'react';
import MainLayout from '../Layout/MainLayout';
import './Calculadora.css';

const FREQUENCIES = {
  diario: 365,
  semanal: 52,
  bisemanal: 26,
  quincenal: 24,
  '15 y fin de mes': 24,
  mensual: 12,
  anual: 1
};

const amortizations = [
  { value: 'cuota_fija', label: 'Cuota fija (anualidad)' },
  { value: 'disminuir_cuota', label: 'Disminuir cuota (capital fijo)' },
  { value: 'interes_fijo', label: 'Interés fijo (solo interés periódicamente)' },
  { value: 'capital_al_final', label: 'Capital al final (bullet)' }
];

const round = (v) => Math.round((v + Number.EPSILON) * 100) / 100;

const addPeriod = (date, freqKey, index) => {
  const d = new Date(date);
  if (freqKey === 'diario') d.setDate(d.getDate() + 1 * index);
  else if (freqKey === 'semanal') d.setDate(d.getDate() + 7 * index);
  else if (freqKey === 'bisemanal') d.setDate(d.getDate() + 14 * index);
  else if (freqKey === 'quincenal') d.setDate(d.getDate() + 15 * index);
  else if (freqKey === '15 y fin de mes') {
    const base = new Date(date);
    const monthsToAdd = Math.floor((index - 1) / 2);
    base.setMonth(base.getMonth() + monthsToAdd);
    if ((index % 2) === 1) {
      base.setDate(15);
    } else {
      base.setDate(1);
      base.setMonth(base.getMonth() + 1);
      base.setDate(0);
    }
    return base;
  } else if (freqKey === 'mensual') d.setMonth(d.getMonth() + index);
  else if (freqKey === 'anual') d.setFullYear(d.getFullYear() + index);
  return d;
};

const Calculadora = () => {
  const [monto, setMonto] = useState('');
  const [amortizacion, setAmortizacion] = useState('cuota_fija');
  const [modalidad, setModalidad] = useState('mensual');
  const [cuotas, setCuotas] = useState(12);
  const [interesMensual, setInteresMensual] = useState(1.0);
  const [fechaInicio, setFechaInicio] = useState(new Date().toISOString().slice(0, 10));
  const [schedule, setSchedule] = useState([]);
  const [totales, setTotales] = useState({ totalPagar: 0, totalInteres: 0 });

  const calcular = (e) => {
    e.preventDefault();
    const principal = parseFloat(monto);
    if (!principal || principal <= 0) return alert('Ingresa un monto válido');
    const n = parseInt(cuotas, 10);
    if (!n || n <= 0) return alert('Ingresa número de cuotas válido');

    const freq = FREQUENCIES[modalidad] || 12;
    const annualRate = parseFloat(interesMensual) * 12 / 100;
    const r = annualRate / freq;

    const rows = [];
    let balance = principal;
    let totalPaid = 0;
    let totalInterest = 0;
    const startDate = new Date(fechaInicio);

    if (amortizacion === 'cuota_fija') {
      const periodicRate = r;
      let pago;
      if (periodicRate === 0) pago = principal / n;
      else pago = principal * periodicRate / (1 - Math.pow(1 + periodicRate, -n));
      pago = round(pago);
      for (let i = 1; i <= n; i++) {
        const fecha = addPeriod(startDate, modalidad, i);
        const interes = round(balance * periodicRate);
        let abonoCapital = round(pago - interes);
        if (i === n) abonoCapital = round(balance);
        const total = round(interes + abonoCapital);
        const capitalPendiente = round(balance);
        balance = round(balance - abonoCapital);
        rows.push({
          periodo: i,
          fecha: fecha.toLocaleDateString(),
          total,
          capitalPendiente,
          abonarAlCapital: abonoCapital,
          interes
        });
        totalPaid += total;
        totalInterest += interes;
      }
    } else if (amortizacion === 'disminuir_cuota') {
      const principalPago = round(principal / n);
      for (let i = 1; i <= n; i++) {
        const fecha = addPeriod(startDate, modalidad, i);
        const interes = round(balance * r);
        let pago = round(principalPago + interes);
        if (i === n) {
          pago = round(balance + interes);
        }
        const abonoCapital = i === n ? round(balance) : principalPago;
        const capitalPendiente = round(balance);
        balance = round(balance - abonoCapital);
        rows.push({
          periodo: i,
          fecha: fecha.toLocaleDateString(),
          total: pago,
          capitalPendiente,
          abonarAlCapital: abonoCapital,
          interes
        });
        totalPaid += pago;
        totalInterest += interes;
      }
    } else if (amortizacion === 'interes_fijo') {
      for (let i = 1; i <= n; i++) {
        const fecha = addPeriod(startDate, modalidad, i);
        const interes = round(balance * r);
        const abonoCapital = i === n ? round(balance) : 0;
        const total = round(interes + abonoCapital);
        const capitalPendiente = round(balance);
        if (i === n) balance = 0;
        rows.push({
          periodo: i,
          fecha: fecha.toLocaleDateString(),
          total,
          capitalPendiente,
          abonarAlCapital: abonoCapital,
          interes
        });
        totalPaid += total;
        totalInterest += interes;
      }
    } else if (amortizacion === 'capital_al_final') {
      let acumuladoInteres = 0;
      for (let i = 1; i <= n; i++) {
        const fecha = addPeriod(startDate, modalidad, i);
        const interes = round(balance * r);
        acumuladoInteres = round(acumuladoInteres + interes);
        const abonoCapital = i === n ? round(principal) : 0;
        const total = i === n ? round(principal + acumuladoInteres) : 0;
        const capitalPendiente = round(i === n ? 0 : principal);
        if (i === n) balance = 0;
        rows.push({
          periodo: i,
          fecha: fecha.toLocaleDateString(),
          total,
          capitalPendiente,
          abonarAlCapital: abonoCapital,
          interes
        });
        totalPaid += total;
        totalInterest += interes;
      }
    }

    setSchedule(rows);
    setTotales({ totalPagar: round(totalPaid), totalInteres: round(totalInterest) });
  };

  return (
    <MainLayout title="Calculadora" description="Calcula la tabla de amortización según parámetros">
      <div className="form-container">
        <div className="form-header">
          <h3>Calculadora de préstamos</h3>
        </div>

        <form onSubmit={calcular}>
          <div className="form-group">
            <label>Monto del préstamo</label>
            <input type="number" step="0.01" value={monto} onChange={e => setMonto(e.target.value)} required />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Tipo de amortización</label>
              <select value={amortizacion} onChange={e => setAmortizacion(e.target.value)}>
                {amortizations.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>Modalidad de pago</label>
              <select value={modalidad} onChange={e => setModalidad(e.target.value)}>
                {Object.keys(FREQUENCIES).map(k => <option key={k} value={k}>{k}</option>)}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Cuotas</label>
              <input type="number" value={cuotas} onChange={e => setCuotas(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Interés mensual (%)</label>
              <input type="number" step="0.01" value={interesMensual} onChange={e => setInteresMensual(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Fecha inicio</label>
              <input type="date" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary">Calcular</button>
          </div>
        </form>

        <div className="table-container" style={{ marginTop: 20 }}>
          <table className="loan-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Fecha</th>
                <th>Total a pagar</th>
                <th>Capital pendiente</th>
                <th>Abonar al capital</th>
                <th>Interés</th>
              </tr>
            </thead>
            <tbody>
              {schedule.map(row => (
                <tr key={row.periodo}>
                  <td>{row.periodo}</td>
                  <td>{row.fecha}</td>
                  <td>${row.total.toFixed(2)}</td>
                  <td>${row.capitalPendiente.toFixed(2)}</td>
                  <td>${row.abonarAlCapital.toFixed(2)}</td>
                  <td>${row.interes.toFixed(2)}</td>
                </tr>
              ))}

              {schedule.length > 0 && (
                <tr>
                  <td colSpan={2} style={{ textAlign: 'right', fontWeight: 'bold' }}>Totales:</td>
                  <td style={{ fontWeight: 'bold' }}>${totales.totalPagar.toFixed(2)}</td>
                  <td></td>
                  <td></td>
                  <td style={{ fontWeight: 'bold' }}>${totales.totalInteres.toFixed(2)}</td>
                </tr>
              )}

              {schedule.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', color: '#888' }}>No hay resultados. Completa el formulario y presiona "Calcular".</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
};

export default Calculadora;