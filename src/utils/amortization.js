const FREQUENCIES = {
    diario: 365,
    semanal: 52,
    bisemanal: 26,
    quincenal: 24,
    '15 y fin de mes': 24,
    mensual: 12,
    anual: 1
};

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

/**
 * Calcula la tabla de amortización.
 * @param {Object} params
 * @param {number} params.monto - Capital inicial
 * @param {string} params.amortizacion - 'cuota_fija', 'disminuir_cuota', 'interes_fijo', 'capital_al_final'
 * @param {string} params.modalidad - 'diario', 'semanal', etc.
 * @param {number} params.cuotas - Número total de cuotas
 * @param {number} params.interesMensual - Tasa de interés mensual (%)
 * @param {string} params.fechaInicio - Fecha de inicio YYYY-MM-DD
 * @returns {Object} { schedule: Array, totales: Object }
 */
export const calculateAmortization = ({
    monto,
    amortizacion = 'cuota_fija',
    modalidad = 'mensual',
    cuotas,
    interesMensual,
    fechaInicio
}) => {
    const principal = parseFloat(monto);
    const n = parseInt(cuotas, 10);
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

    return {
        schedule: rows,
        totales: {
            totalPagar: round(totalPaid),
            totalInteres: round(totalInterest)
        }
    };
};
