# Vizuala

Aplicación que permite a los usuarios iniciar sesión y generar o visualizar informes.


## Desarrollo

Inicia el servidor de desarrollo con:

```bash
npm run dev
```


## Variables de entorno

No se requiere ninguna variable de entorno adicional para el desarrollo local.

## Despliegue en Netlify

El archivo `netlify.toml` define la configuración de despliegue:

- **Comando de build**: `npm run build`
- **Directorio de publicación**: `.next`
- **Plugin**: `@netlify/plugin-nextjs`
- **Versión de Node**: `18`
