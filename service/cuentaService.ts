import { Cuenta } from "@/interfaces/Cuenta";

export async function fetchCuentas(usuarioId: number): Promise<Cuenta[]> {
    const response = await fetch(`http://localhost:8081/api/cuentas/usuario/${usuarioId}`);
    if (!response.ok) {
        throw new Error('falla al consumir el servicio de cuentas');
    }
    const data = await response.json();
    return data;
}