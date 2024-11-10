'use client';

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { fetchCondicionesCdt } from "@/service/condicionCdtService";
import { CondicionCdt } from "@/interfaces/CondicionCdt";
import { Cuenta } from "@/interfaces/Cuenta";
import { encryptData, decryptData } from "@/utils/cryptoUtils";

export default function SimuladorPage() {
    const [condiciones, setCondiciones] = useState<CondicionCdt[]>([]);
    const [monto, setMonto] = useState<string>('');
    const [plazo, setPlazo] = useState<number>(60);
    const [periodoPago, setPeriodoPago] = useState<number>(30);
    const [cuentaSeleccionada, setCuentaSeleccionada] = useState<Cuenta | null>(null);
    const [errors, setErrors] = useState<{ monto?: string; plazo?: string; periodoPago?: string }>({});
    const [simulacion, setSimulacion] = useState<{
        inversionInicial?: number;
        tasaInteres?: number;
        rendimiento?: number;
        retencionFuente?: number;
        abonoPeriodo?: number;
    } | null>(null);
    const [errorBanner, setErrorBanner] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const getCondiciones = async () => {
            try {
                const data = await fetchCondicionesCdt();
                setCondiciones(data);
            } catch (error) {
                console.error('Failed to fetch condiciones', error);
            }
        };

        getCondiciones();

        const encryptedCuenta = sessionStorage.getItem('cuentaSeleccionada');
        if (encryptedCuenta) {
            const cuenta = decryptData<Cuenta>(encryptedCuenta);
            if (cuenta && cuenta.id) {
                setCuentaSeleccionada(cuenta);
            } else {
                router.push('/');
            }
        } else {
            router.push('/');
        }
    }, [router]);

    const handleSimular = () => {
        const newErrors: { monto?: string; plazo?: string; periodoPago?: string } = {};

        const montoNumber = parseFloat(monto);
        if (isNaN(montoNumber) || montoNumber < 500000 || montoNumber > 1000000000) {
            newErrors.monto = 'El monto debe estar entre 500.000 y 1.000.000.000';
        }

        if (!plazo) {
            newErrors.plazo = 'El plazo es obligatorio';
        }

        if (!periodoPago) {
            newErrors.periodoPago = 'El periodo de pago es obligatorio';
        }

        if (cuentaSeleccionada && montoNumber > cuentaSeleccionada.saldo) {
            setErrorBanner('El monto a invertir no puede exceder el saldo actual de la cuenta.');
            return;
        } else {
            setErrorBanner(null);
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            const condicion = condiciones.find(cond => 
                montoNumber >= cond.montoMin && montoNumber <= cond.montoMax &&
                plazo >= cond.plazoMin && plazo <= cond.plazoMax
            );

            if (condicion) {
                const tasaInteres = condicion.tasa / 100;
                const rendimiento = ((1 + tasaInteres) ** (plazo / 360) - 1) * montoNumber;
                const retencionFuente = rendimiento * 0.04;
                const abonoPeriodo = (rendimiento - retencionFuente) / (plazo / periodoPago);

                const simulacionData = {
                    inversionInicial: montoNumber,
                    tasaInteres: condicion.tasa,
                    rendimiento: rendimiento,
                    retencionFuente: retencionFuente,
                    abonoPeriodo: abonoPeriodo
                };

                setSimulacion(simulacionData);

                const encryptedSimulacion = encryptData(simulacionData);
                sessionStorage.setItem('simulacion', encryptedSimulacion);
            } else {
                console.error('No se encontró una condición para los valores ingresados');
            }
        }
    };

    const getPeriodosPago = () => {
        const periodos = [];
        for (let i = 30; i < plazo; i += 30) {
            periodos.push(i);
        }
        // Al vencimiento
        periodos.push(plazo);
        return periodos;
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(value);
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        const charCode = event.charCode;
        if (charCode < 48 || charCode > 57) {
            event.preventDefault();
        }
    };

    return (
        <div className="min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <h1 className="text-2xl font-bold mb-6">Simulador de CDT</h1>
            {cuentaSeleccionada && (
                <div className="mb-4 p-4 border rounded shadow">
                    <p><strong>Cuenta Seleccionada:</strong></p>
                    <p><strong>Número de Cuenta:</strong> {cuentaSeleccionada.numeroCuenta}</p>
                    <p><strong>Tipo de Cuenta:</strong> {cuentaSeleccionada.tipoCuenta}</p>
                    <p><strong>Saldo:</strong> {formatCurrency(cuentaSeleccionada.saldo)}</p>
                </div>
            )}
            {errorBanner && (
                <div className="mb-4 p-4 border rounded shadow bg-red-100 text-red-700">
                    {errorBanner}
                </div>
            )}
            <div className="mb-4">
                <label htmlFor="monto" className="block text-sm font-medium text-gray-700">
                    Monto a Invertir
                </label>
                <input
                    type="text"
                    id="monto"
                    value={monto}
                    onChange={(e) => setMonto(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="mt-1 block w-full p-2 border rounded"
                    placeholder="Ingrese el monto"
                />
                {errors.monto && <p className="text-red-500 text-sm">{errors.monto}</p>}
            </div>
            <div className="mb-4">
                <label htmlFor="plazo" className="block text-sm font-medium text-gray-700">
                    Plazo (Días)
                </label>
                <select
                    id="plazo"
                    value={plazo}
                    onChange={(e) => setPlazo(Number(e.target.value))}
                    className="mt-1 block w-full p-2 border rounded"
                >
                    <option value={60}>60</option>
                    <option value={90}>90</option>
                    <option value={120}>120</option>
                    <option value={150}>150</option>
                    <option value={180}>180</option>
                    <option value={360}>360</option>
                    <option value={540}>540</option>
                </select>
                {errors.plazo && <p className="text-red-500 text-sm">{errors.plazo}</p>}
            </div>
            <div className="mb-4">
                <label htmlFor="periodoPago" className="block text-sm font-medium text-gray-700">
                    Periodo de Pago de Intereses (Días)
                </label>
                <select
                    id="periodoPago"
                    value={periodoPago}
                    onChange={(e) => setPeriodoPago(Number(e.target.value))}
                    className="mt-1 block w-full p-2 border rounded"
                >
                    {getPeriodosPago().map(periodo => (
                        <option key={periodo} value={periodo}>{periodo}</option>
                    ))}
                </select>
                {errors.periodoPago && <p className="text-red-500 text-sm">{errors.periodoPago}</p>}
            </div>
            <button onClick={handleSimular} className="w-full bg-blue-500 text-white p-2 rounded">
                Simular CDT
            </button>
            {simulacion && (
                <div className="mt-6 p-4 border rounded shadow bg-green-100">
                    <h2 className="text-xl font-bold mb-4">Resultados de la Simulación</h2>
                    <p><strong>Inversión Inicial:</strong> {formatCurrency(simulacion.inversionInicial!)}</p>
                    <p><strong>Tasa Fija de Interés:</strong> {simulacion.tasaInteres}%</p>
                    <p><strong>Rendimiento:</strong> {formatCurrency(simulacion.rendimiento!)}</p>
                    <p><strong>Retención en la Fuente:</strong> {formatCurrency(simulacion.retencionFuente!)}</p>
                    <p><strong>Abono por Período:</strong> {formatCurrency(simulacion.abonoPeriodo!)}</p>
                </div>
            )}
        </div>
    );
}