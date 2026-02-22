import React, { useState, useEffect } from 'react';
import { supabase } from '@/config/supabaseClient';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, MoreHorizontal, Receipt, CreditCard } from 'lucide-react';

const AccountsReceivable = () => {
    const [loans, setLoans] = useState([]);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLoan, setSelectedLoan] = useState(null);
    const [paymentAmount, setPaymentAmount] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchLoans = async () => {
            const { data, error } = await supabase
                .from('prestamos')
                .select('*, clientes(name)');
            if (data) setLoans(data);
        };
        fetchLoans();
    }, []);

    const filteredLoans = loans.filter(loan => {
        const matchesFilter = filter === 'all' ||
            (filter === 'mora' && loan.estado === 'En Mora') ||
            (filter === 'vencido' && loan.estado === 'Vencido') ||
            (filter === 'al_dia' && loan.estado === 'Activo');

        const matchesSearch = (loan.clientes?.name || '').toLowerCase().includes(searchTerm.toLowerCase());

        return matchesFilter && matchesSearch;
    });

    const handleRegisterPayment = async () => {
        if (!selectedLoan || !paymentAmount) return;

        setLoading(true);
        // Lógica para registrar pago en Supabase
        const { error } = await supabase
            .from('pagos')
            .insert([{
                prestamo_id: selectedLoan.id,
                monto: parseFloat(paymentAmount),
                fecha: new Date().toISOString(),
                metodo_pago: 'Efectivo'
            }]);

        setLoading(false);
        if (error) {
            alert('Error al registrar pago: ' + error.message);
        } else {
            alert('Pago registrado correctamente');
            setSelectedLoan(null);
            setPaymentAmount('');
            // Refetch loans
        }
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle className="text-2xl font-bold">Cuentas por Cobrar</CardTitle>
                        <CardDescription>Monitorea y gestiona los cobros pendientes de clientes.</CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" className="flex items-center gap-2">
                            <Receipt className="h-4 w-4" /> Recibos
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar por cliente..."
                            className="pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Select value={filter} onValueChange={setFilter}>
                        <SelectTrigger className="w-[180px]">
                            <Filter className="h-4 w-4 mr-2" />
                            <SelectValue placeholder="Filtrar por estado" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos los estados</SelectItem>
                            <SelectItem value="al_dia">Al día</SelectItem>
                            <SelectItem value="mora">En Mora</SelectItem>
                            <SelectItem value="vencido">Vencido</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="rounded-md border overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50">
                                <TableHead className="w-[200px]">Cliente</TableHead>
                                <TableHead>Monto Total</TableHead>
                                <TableHead>Restante</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead>Vencimiento</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredLoans.map((loan) => (
                                <TableRow key={loan.id} className="hover:bg-muted/30">
                                    <TableCell className="font-medium">{loan.clientes?.name || 'Cliente Desconocido'}</TableCell>
                                    <TableCell>${loan.monto?.toLocaleString()}</TableCell>
                                    <TableCell className="text-blue-600 font-semibold">${(loan.pago_total - (loan.total_pagado || 0)).toLocaleString()}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1">
                                            <Badge variant={
                                                loan.estado === 'En Mora' ? 'destructive' :
                                                    loan.estado === 'Vencido' ? 'outline' : 'default'
                                            }>
                                                {loan.estado}
                                            </Badge>
                                            {loan.estado === 'En Mora' && (
                                                <span className="text-[10px] text-red-600 font-bold flex items-center">
                                                    <AlertCircle className="h-3 w-3 mr-1" /> MORA CRÍTICA (+3 días)
                                                </span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>{new Date(loan.proximo_pago || loan.fecha_inicio).toLocaleDateString()}</TableCell>
                                    <TableCell className="text-right">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button size="sm" variant="outline" className="gap-2" onClick={() => setSelectedLoan(loan)}>
                                                    <CreditCard className="h-3 w-3" /> Cobrar
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-[425px]">
                                                <DialogHeader>
                                                    <DialogTitle>Registrar Pago</DialogTitle>
                                                    <DialogDescription>
                                                        Registra un nuevo ingreso para el préstamo de {loan.clientes?.name}.
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <div className="grid gap-4 py-4">
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label className="text-right">Monto</Label>
                                                        <Input
                                                            type="number"
                                                            className="col-span-3"
                                                            value={paymentAmount}
                                                            onChange={(e) => setPaymentAmount(e.target.value)}
                                                            placeholder="0.00"
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label className="text-right">Método</Label>
                                                        <Select defaultValue="efectivo">
                                                            <SelectTrigger className="col-span-3">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="efectivo">Efectivo</SelectItem>
                                                                <SelectItem value="transferencia">Transferencia</SelectItem>
                                                                <SelectItem value="deposito">Depósito</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>
                                                <DialogFooter>
                                                    <Button type="button" onClick={handleRegisterPayment} disabled={loading}>
                                                        {loading ? 'Procesando...' : 'Confirmar Pago'}
                                                    </Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {filteredLoans.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                                        No se encontraron cuentas con los filtros aplicados.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
};

export default AccountsReceivable;
