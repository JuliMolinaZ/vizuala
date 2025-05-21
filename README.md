# Vizuala

Aplicación que permite a los usuarios iniciar sesión y generar o visualizar informes.

## Instalación

1. Asegúrate de tener **Node.js 18** instalado.
2. Ejecuta `npm install` para descargar las dependencias.

## Desarrollo

Inicia el servidor de desarrollo con:

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) para ver la aplicación.

## Variables de entorno

No se requiere ninguna variable de entorno adicional para el desarrollo local.

## Despliegue en Netlify

El archivo `netlify.toml` define la configuración de despliegue:

- **Comando de build**: `npm run build`
- **Directorio de publicación**: `.next`
- **Plugin**: `@netlify/plugin-nextjs`
- **Versión de Node**: `18`

Netlify usará estos parámetros para compilar y desplegar la aplicación automáticamente.
