## Comenzando

### Prerrequisitos

- Instalar [Node.js 18](https://nodejs.org/)

### Instalación

Primero, instala las dependencias:

```bash
npm install
```

### Ejecutar el Servidor de Desarrollo

Para ejecutar el servidor de desarrollo localmente:

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver el resultado.


### Ejecutar con Docker

Para construir y ejecutar la imagen Docker:

1. **Construir la imagen Docker**:

    ```bash
    docker build -t prueba-tecnica-caja-social .
    ```

2. **Ejecutar el contenedor Docker**:

    ```bash
    docker run -p 3000:3000 prueba-tecnica-caja-social
    ```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver el resultado.

La aplicación cuenta con una funcionalidad de encriptar la peticion hacia el servicio login, la cual cuenta con dos variables de entorno con la llaves para encriotar.

Para ingresar a la aplicacion de debe de ingresar com el tipo de documento CC, numero de documento 123456789, y contraseña 2024