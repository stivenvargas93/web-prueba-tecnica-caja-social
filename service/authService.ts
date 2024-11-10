export async function login(encryptedData: string): Promise<any> {
    const response = await fetch('http://localhost:8080/api/usuario/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: encryptedData
    });

    if (!response.ok) {
        throw new Error('Falló al consumir el servicio de login');
    }

    return response.json();
}