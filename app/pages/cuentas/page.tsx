'use client';

import { useEffect, useState } from "react";
import { fetchCuentas } from "@/service/cuentaService";
import { Cuenta } from "@/interfaces/Cuenta";
import { useRouter } from "next/navigation";
import { decryptData, encryptData } from "@/utils/cryptoUtils";
import { Usuario } from "@/interfaces/Usuario";

export default function CuentaPage() {
    const [cuentas, setCuentas] = useState<Cuenta[]>([]);
    const router = useRouter();

    useEffect(() => {
        const getCuentas = async () => {
            const encryptedUsuario = sessionStorage.getItem('usuario');
            if (encryptedUsuario) {
                const usuario : Usuario = decryptData(encryptedUsuario);
                if (usuario && usuario.id) {
                    try {
                        const data = await fetchCuentas(usuario.id);
                        setCuentas(data);
                    } catch (error) {
                        console.error('Error al consular servicio de cuentas: ', error);
                    }
                } else {
                    router.push('/');
                }
            } else {
                router.push('/');
            }
        };

        getCuentas();
    }, [router]);

    const handleSeleccionarCuenta = (cuenta: Cuenta) => {
        sessionStorage.setItem('cuentaSeleccionada', encryptData(cuenta));
        router.push('/pages/simulador');
    };

    return (
        <div className="min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <h1 className="text-2xl font-bold mb-6">Cuentas</h1>
            <ul className="space-y-4">
                {cuentas.map((cuenta) => (
                    <li key={cuenta.id} className="p-4 border rounded shadow">
                        <p><strong>Número de Cuenta:</strong> {cuenta.numeroCuenta}</p>
                        <p><strong>Tipo de Cuenta:</strong> {cuenta.tipoCuenta}</p>
                        <p><strong>Saldo:</strong> ${cuenta.saldo}</p>
                        <button
                            onClick={() => handleSeleccionarCuenta(cuenta)}
                            className="mt-2 bg-blue-500 text-white p-2 rounded"
                        >
                            Seleccionar Cuenta
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}