# Ejercicio 10: despliegue en Render

Esta carpeta contiene la versión acumulativa y lista para desplegar de
`ApiNews`. El archivo `render.yaml` configura:

- Un servicio web de Node.js.
- Instalación reproducible mediante `npm ci`.
- Inicio con `npm start`.
- Comprobación de salud en `/`.
- Generación automática de `JWT_SECRET`.
- Solicitud segura de las credenciales MySQL desde el panel de Render.

## Comprobación local

```powershell
Copy-Item .env.example .env
npm install
npm test
npm start
```

## Publicación

1. Sube únicamente esta carpeta a un repositorio Git.
2. En Render selecciona **New > Blueprint** y conecta el repositorio.
3. Render detectará `render.yaml`.
4. Captura `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER` y `DB_PASSWORD` cuando
   Render los solicite. La base MySQL debe aceptar conexiones desde Render.
5. Crea el Blueprint y espera a que la ruta `/` pase la comprobación de salud.

Las credenciales no están guardadas en el proyecto. La creación del servicio
en una cuenta real de Render es el único paso que debe hacerse desde la cuenta
del alumno.
