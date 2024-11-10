import { CondicionCdt } from "@/interfaces/CondicionCdt";

export async function fetchCondicionesCdt(): Promise<CondicionCdt[]> {
    const response = await fetch('http://localhost:8081/api/condiciones-cdt');
    if (!response.ok) {
        throw new Error('Falló al consumir el servicio de condiciones CDT');
    }
    const data = await response.json();
    return data;
}