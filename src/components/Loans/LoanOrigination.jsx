import React, { useState, useEffect } from 'react';
import { supabase } from '@/config/supabaseClient';
import { calculateAmortization } from '@/utils/amortization';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const LoanOrigination = () => {
    const [clients, setClients] = useState([]);
    const [formData, setFormData] = useState({
        clientId: '',
        amount: '',
        interestRate: '12.5',
        frequency: 'mensual',
        amortizationType: 'cuota_fija',
        periods: '12',
        startDate: new Date().toISOString().split('T')[0]
    });
    const [schedule, setSchedule] = useState([]);
    const [totals, setTotals] = useState({ totalPagar: 0, totalInteres: 0 });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchClients = async () => {
            const { data, error } = await supabase
                .from('clientes')
                .select('id, name');
            if (data) setClients(data);
        };
        fetchClients();
    }, []);

    useEffect(() => {
        if (formData.amount && formData.periods && formData.interestRate) {
            const result = calculateAmortization({
                monto: formData.amount,
                amortizacion: formData.amortizationType,
                modalidad: formData.frequency,
                cuotas: formData.periods,
                interesMensual: formData.interestRate / 12, // Assuming input is annual rate, or adjust as needed
                fechaInicio: formData.startDate
            });
            setSchedule(result.schedule);
            setTotals(result.totales);
        } else {
            setSchedule([]);
            setTotals({ totalPagar: 0, totalInteres: 0 });
        }
    }, [formData]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSaveLoan = async () => {
        if (!formData.clientId || !formData.amount) {
            alert('Por favor complete los campos obligatorios');
            return;
        }

        setLoading(true);
        const { data, error } = await supabase
            .from('prestamos')
            .insert([{
                deudor_id: formData.clientId,
                monto: parseFloat(formData.amount),
                interes: parseFloat(formData.interestRate),
                cuotas: parseInt(formData.periods),
                frecuencia: formData.frequency,
                tipo_amortizacion: formData.amortizationType,
                fecha_inicio: formData.startDate,
                pago_total: totals.totalPagar,
                interes_total: totals.totalInteres,
                estado: 'Activo'
            }]);

        setLoading(false);
        if (error) {
            alert('Error al guardar: ' + error.message);
        } else {
            alert('Préstamo originado exitosamente');
            // Reset or redirect
        }
    };

    return (
        <div className="container mx-auto p-4 space-y-6">
            <h1 className="text-3xl font-bold">Originar Préstamo</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Form Column */}
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle>Detalles del Préstamo</CardTitle>
                        <CardDescription>Configure los parámetros del préstamo para generar la tabla.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Cliente</Label>
                            <Select onValueChange={(v) => handleInputChange('clientId', v)} value={formData.clientId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar cliente" />
                                </SelectTrigger>
                                <SelectContent>
                                    {clients.map(c => (
                                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Monto</Label>
                            <Input
                                type="number"
                                placeholder="0.00"
                                value={formData.amount}
                                onChange={(e) => handleInputChange('amount', e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Tasa Anual (%)</Label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    value={formData.interestRate}
                                    onChange={(e) => handleInputChange('interestRate', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Cuotas</Label>
                                <Input
                                    type="number"
                                    value={formData.periods}
                                    onChange={(e) => handleInputChange('periods', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Frecuencia de Pago</Label>
                            <Select onValueChange={(v) => handleInputChange('frequency', v)} value={formData.frequency}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="diario">Diario</SelectItem>
                                    <SelectItem value="semanal">Semanal</SelectItem>
                                    <SelectItem value="quincenal">Quincenal</SelectItem>
                                    <SelectItem value="mensual">Mensual</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Tipo de Amortización</Label>
                            <Select onValueChange={(v) => handleInputChange('amortizationType', v)} value={formData.amortizationType}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="cuota_fija">Cuota Fija (Francés)</SelectItem>
                                    <SelectItem value="disminuir_cuota">Cuota Variable (Alemán)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Fecha de Inicio</Label>
                            <Input
                                type="date"
                                value={formData.startDate}
                                onChange={(e) => handleInputChange('startDate', e.target.value)}
                            />
                        </div>

                        <Button className="w-full mt-4" onClick={handleSaveLoan} disabled={loading}>
                            {loading ? 'Guardando...' : 'Originar Préstamo'}
                        </Button>
                    </CardContent>
                </Card>

                {/* Preview Column */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Resumen de Amortización</CardTitle>
                        <CardDescription>Visualización detallada de las cuotas programadas.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <div className="p-3 bg-secondary rounded-lg">
                                <p className="text-sm text-muted-foreground">Total a Pagar</p>
                                <p className="text-xl font-bold">${totals.totalPagar.toLocaleString()}</p>
                            </div>
                            <div className="p-3 bg-secondary rounded-lg">
                                <p className="text-sm text-muted-foreground">Total Interés</p>
                                <p className="text-xl font-bold">${totals.totalInteres.toLocaleString()}</p>
                            </div>
                            <div className="p-3 bg-secondary rounded-lg">
                                <p className="text-sm text-muted-foreground">Cuota Promedio</p>
                                <p className="text-xl font-bold">
                                    ${schedule.length > 0 ? (totals.totalPagar / schedule.length).toFixed(2) : '0.00'}
                                </p>
                            </div>
                            <div className="p-3 bg-secondary rounded-lg">
                                <p className="text-sm text-muted-foreground">Estado</p>
                                <p className="text-xl font-bold text-green-600">Simulado</p>
                            </div>
                        </div>

                        <div className="max-h-[500px] overflow-auto border rounded-md">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[80px]">Cuota</TableHead>
                                        <TableHead>Fecha</TableHead>
                                        <TableHead>Principal</TableHead>
                                        <TableHead>Interés</TableHead>
                                        <TableHead className="text-right">Total</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {schedule.map((row) => (
                                        <TableRow key={row.periodo}>
                                            <TableCell className="font-medium">{row.periodo}</TableCell>
                                            <TableCell>{row.fecha}</TableCell>
                                            <TableCell>${row.abonarAlCapital.toLocaleString()}</TableCell>
                                            <TableCell>${row.interes.toLocaleString()}</TableCell>
                                            <TableCell className="text-right font-bold">${row.total.toLocaleString()}</TableCell>
                                        </TableRow>
                                    ))}
                                    {schedule.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                                                Ingrese los datos del préstamo para ver la tabla.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default LoanOrigination;
