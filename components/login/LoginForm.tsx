'use client';

import { useEffect, useState } from "react";
import { encryptData } from "@/utils/cryptoUtils";
import { login } from "@/service/authService";
import { useRouter } from "next/navigation";

export default function LoginForm() {
    const router = useRouter();
    const [numeroDocumento, setNumeroDocumento] = useState('');
    const [tipoDocumento, setTipoDocumento] = useState('');
    const [contraseña, setContraseña] = useState('');
    const [errors, setErrors] = useState<{ numeroDocumento?: string; tipoDocumento?: string; contraseña?: string }>({});
    const [errorBanner, setErrorBanner] = useState<string | null>(null);

    useEffect(() => {
        sessionStorage.clear();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: { numeroDocumento?: string; tipoDocumento?: string; contraseña?: string } = {};

        if (!numeroDocumento) newErrors.numeroDocumento = 'Número de identificación es obligatorio';
        if (!tipoDocumento) newErrors.tipoDocumento = 'Tipo de identificación es obligatorio';
        if (!contraseña) newErrors.contraseña = 'Clave es obligatoria';

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            const encryptedData = encryptData({ numeroDocumento, tipoDocumento, contraseña });

            try {
                const data = await login(encryptedData);
                sessionStorage.setItem('usuario', encryptData(data));
                router.push('/pages/cuentas');
            } catch (error) {
                console.error('Error en servicio Login', error);
                setErrorBanner('Error de acceso: Por favor, verifique sus credenciales.');
            }
        }
    };

    return (
        <div className="grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            {errorBanner && (
                <div className="mb-4 p-4 border rounded shadow bg-red-100 text-red-700">
                    {errorBanner}
                </div>
            )}
            <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 p-4 border rounded shadow">
                <div className="mb-4">
                    <label htmlFor="tipoDocumento" className="block text-sm font-medium text-gray-700">
                        Tipo de Identificación
                    </label>
                    <select
                        id="tipoDocumento"
                        value={tipoDocumento}
                        onChange={(e) => setTipoDocumento(e.target.value)}
                        className="mt-1 block w-full p-2 border rounded"
                    >
                        <option value="">Seleccione un tipo</option>
                        <option value="CC">Cédula de Ciudadanía</option>
                        <option value="TI">Tarjeta de Identidad</option>
                        <option value="CE">Cédula de Extranjería</option>
                        <option value="PA">Pasaporte</option>
                    </select>
                    {errors.tipoDocumento && <p className="text-red-500 text-sm">{errors.tipoDocumento}</p>}
                </div>
                <div className="mb-4">
                    <label htmlFor="numeroDocumento" className="block text-sm font-medium text-gray-700">
                        Número de Identificación
                    </label>
                    <input
                        type="text"
                        id="numeroDocumento"
                        value={numeroDocumento}
                        onChange={(e) => setNumeroDocumento(e.target.value)}
                        className="mt-1 block w-full p-2 border rounded"
                    />
                    {errors.numeroDocumento && <p className="text-red-500 text-sm">{errors.numeroDocumento}</p>}
                </div>
                <div className="mb-4">
                    <label htmlFor="contraseña" className="block text-sm font-medium text-gray-700">
                        Clave
                    </label>
                    <input
                        type="password"
                        id="contraseña"
                        value={contraseña}
                        onChange={(e) => setContraseña(e.target.value)}
                        className="mt-1 block w-full p-2 border rounded"
                    />
                    {errors.contraseña && <p className="text-red-500 text-sm">{errors.contraseña}</p>}
                </div>
                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
                    Iniciar Sesión
                </button>
            </form>
        </div>
    );
}