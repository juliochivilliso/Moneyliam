import React, { useState, useEffect } from 'react';
import { supabase } from '@/config/supabaseClient';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { DollarSign, TrendingUp, AlertCircle, Wallet, Users, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        capitalPrestado: 1250000,
        interesesGenerados: 450000,
        moraRecaudada: 75000,
        totalEnCaja: 850000
    });

    const chartData = [
        { month: 'Sep', proyectado: 45000, real: 42000 },
        { month: 'Oct', proyectado: 52000, real: 48000 },
        { month: 'Nov', proyectado: 48000, real: 51000 },
        { month: 'Dec', proyectado: 61000, real: 59000 },
        { month: 'Jan', proyectado: 55000, real: 56000 },
        { month: 'Feb', proyectado: 65000, real: 62000 },
    ];

    const metricCards = [
        { title: 'Capital Prestado', value: stats.capitalPrestado, icon: DollarSign, color: 'text-blue-600', trend: '+12%' },
        { title: 'Intereses Generados', value: stats.interesesGenerados, icon: TrendingUp, color: 'text-green-600', trend: '+8%' },
        { title: 'Mora Recaudada', value: stats.moraRecaudada, icon: AlertCircle, color: 'text-red-600', trend: '-5%' },
        { title: 'Total en Caja', value: stats.totalEnCaja, icon: Wallet, color: 'text-purple-600', trend: '+15%' }
    ];

    return (
        <div className="container mx-auto p-4 space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight">Dashboard Administrativo</h1>
                    <p className="text-muted-foreground mt-1">Resumen financiero y estadístico de la cartera de préstamos.</p>
                </div>
                <div className="hidden md:block">
                    <p className="text-sm font-medium text-muted-foreground">Última actualización: Hoy, {new Date().toLocaleTimeString()}</p>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {metricCards.map((card, idx) => (
                    <Card key={idx} className="hover:shadow-lg transition-shadow duration-300">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                            <card.icon className={`h-5 w-5 ${card.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">${card.value.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground mt-1 flex items-center">
                                {card.trend.startsWith('+') ? <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" /> : <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />}
                                <span className={card.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}>{card.trend}</span>
                                <span className="ml-1">desde el mes pasado</span>
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Chart Section */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Ingresos: Proyectado vs Real</CardTitle>
                        <CardDescription>Comparativa de los últimos 6 meses del año fiscal actual.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="month" />
                                <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                                <Tooltip
                                    formatter={(value) => [`$${value.toLocaleString()}`, '']}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Legend verticalAlign="top" height={36} />
                                <Bar dataKey="proyectado" name="Proyectado" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="real" name="Real" fill="#10b981" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Top Clients or Alerts Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Alertas Recientes</CardTitle>
                        <CardDescription>Clientes con pagos pendientes o en mora.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="flex items-center p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                                    <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                                        C{i}
                                    </div>
                                    <div className="ml-4 flex-1">
                                        <p className="text-sm font-semibold">Cliente Ejemplo {i}</p>
                                        <p className="text-xs text-muted-foreground">Atraso: {i * 2} días</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-red-600">${(i * 1250).toLocaleString()}</p>
                                        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Pendiente</p>
                                    </div>
                                </div>
                            ))}
                            <Button variant="outline" className="w-full text-xs" onClick={() => window.location.hash = '/payments'}>
                                Ver Todos los Pagos
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AdminDashboard;
