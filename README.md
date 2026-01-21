# Proyecto: Facturación

Este repositorio contiene una solución de facturación compuesta por dos partes principales:

- `api-facturacion`: API REST para gestionar autenticación y facturas.
- `facturacion-app`: Aplicación cliente hecha con React + Vite y empaquetada con Electron para distribución de escritorio.

Este README explica paso a paso qué se utilizó, la estructura del proyecto y la arquitectura profesional adoptada.

## Resumen técnico

- Backend: Node.js con Express (API REST). Autenticación mediante JWT. Organización en controllers y rutas.
- Base de datos: Conexión simple desde `db.js` (configurable vía `.env`).
- Frontend: React + TypeScript + Vite. Componentes organizados por funcionalidad (Login, Registro, Inicio, Formularios, Servicios).
- Empaquetado escritorio: Electron (configuración en `electron/` y `dist-electron/`).

## Arquitectura profesional adoptada

1. Cliente - Servidor (separación de responsabilidades):
   - El frontend consume la API REST (separación clara de UI y lógica de negocio).
2. Capas y convenciones:
   - API: patrón similar a MVC (rutas → controladores → lógica y acceso a datos). Esto facilita pruebas y mantenimiento.
   - Frontend: componentes por dominio / feature, servicios para llamadas a la API y utilidades separadas.
3. Seguridad:
   - JWT para autenticación y middlewares de protección de rutas (`middlewares/auth.middleware.js`).


## Estructura (visión general)

- api-facturacion/
  - `.env` — variables de entorno (puerto, cadena de conexión, secreto JWT).
  - `db.js` — configuración y conexión a la base de datos.
  - `index.js` — arranque del servidor Express.
  - `controllers/` — lógica por recurso (`auth.controller.js`, `facturas.controller.js`).
  - `router/` — rutas agrupadas por recurso (`auth.routes.js`, `facturas.routes.js`).
  - `middlewares/` — middlewares reutilizables (por ejemplo `auth.middleware.js`).

- facturacion-app/
  - `src/` — código fuente de React + TypeScript.
    - `Inicio/` — vistas principales (Reportes, ManualPayment, InvoiceTemplate, navegación).
    - `Formularios_Entrada/` — vistas de Login y Register.
    - `services/` — servicios para llamadas a la API y utilidades (auth.services.js, principal.services.js, etc.).
  - `electron/` — entrada y configuración específica de Electron.
  - `dist-electron/` — artefactos generados para la app empaquetada.

## Flujo de trabajo típico

1. El frontend solicita un token JWT al endpoint de autenticación (API).
2. El frontend almacena el JWT (con precaución) y lo adjunta en las cabeceras `Authorization` para llamadas protegidas.
3. El backend valida el token mediante middleware y expone endpoints para listar/crear/actualizar facturas.


## Requisitos previos
- [Node.js](https://nodejs.org/) (Versión 18 o superior recomendada)
- [MySQL/PostgreSQL/MongoDB] (Indica cuál base de datos usas)
- Git



## Cómo ejecutar (rápido)

1. API (desde `api-facturacion`):

```bash
cd api-facturacion
npm install
# configurar .env
node index.js
```

2. Frontend (desarrollo web):

```bash
cd facturacion-app
npm install
npm run dev
```

3. Empaquetar/ejecutar con Electron (dependiendo de la configuración del proyecto): seguir scripts en `package.json` dentro de `facturacion-app`.

## Buenas prácticas y recomendaciones


## Detalle ampliado: `facturacion-app`

Este subproyecto contiene la interfaz de usuario y la configuración para empaquetar la aplicación como un ejecutable de escritorio con Electron.

### Tecnologías utilizadas

- React (v19) con TypeScript para la UI.
- Vite como bundler y entorno de desarrollo rápido.
- Electron para empaquetado y ejecución como app de escritorio.
- ESLint + TypeScript para linting y consistencia de código.
- Librerías usadas en runtime: `html2pdf.js`, `react-router-dom`, `react-to-print`, `sweetalert2`.

### Estructura / Archivos clave

- `index.html` — plantilla HTML base.
- `src/main.tsx` — punto de entrada del cliente React.
- `src/App.tsx` — componente raíz de la aplicación.
- `src/Inicio/` — vistas principales relacionadas con la facturación (Reportes, ManualPayment, InvoiceTemplate, navegación, etc.).
- `src/Formularios_Entrada/` — formularios de autenticación (`Login.tsx`, `Register.tsx`).
- `src/services/` — servicios y utilidades que realizan llamadas al backend o contienen lógica compartida (`auth.services.js`, `principal.services.js`, etc.).
- `electron/` — código principal de Electron (`main.ts`, `preload.ts`) y tipos para el entorno.
- `dist-electron/` — artefactos generados por la compilación de Electron (`main.js`, `preload.mjs`).

### Scripts importantes (`package.json`)

- `npm run dev` — inicia Vite en modo desarrollo (web). Ideal para desarrollo de UI.
- `npm run build` — compila TypeScript, construye la app con Vite y ejecuta `electron-builder` para generar instaladores/artefactos de escritorio.
- `npm run preview` — arranca el servidor de previsualización de Vite para probar la build web.
- `npm run lint` — ejecuta ESLint sobre el código TypeScript/TSX.

Ejemplo de uso rápido (desde `facturacion-app`):

```bash
cd facturacion-app
npm install
npm run dev
```

Para crear la versión de escritorio:

```bash
cd facturacion-app
npm install
npm run build
```

Nota: `npm run build` invoca `tsc && vite build && electron-builder` según la configuración actual.

### Buenas prácticas específicas para `facturacion-app`

- Separar lógica de presentación y lógica de negocio: componentes para UI, `services/` para llamadas a la API y utilidades.
- Evitar exponer secretos o configuraciones sensibles en el código cliente.
- Usar rutas protegidas y un manejo claro del estado de autenticación (token JWT o cookies seguras).
- Añadir pruebas unitarias para componentes críticos y mocks para `services` que hacen llamadas a la API.

### Recomendaciones de despliegue

- Para producción en escritorio, revisar la configuración de `electron-builder` en `electron-builder.json5`.
- Verificar la compatibilidad del `main` de Electron (`dist-electron/main.js`) y las rutas relativas a recursos estáticos.
- Si se va a distribuir públicamente, firmar los instaladores según la plataforma.

---

Si quieres, agrego:

- Un archivo de ejemplo `.env.example` para el `api-facturacion` con variables recomendadas.
- Fragmentos sugeridos para `package.json` del backend y consejos para CI/CD y despliegue.

## Archivos clave (rápido)

- API: `api-facturacion/index.js`, `api-facturacion/db.js`, `api-facturacion/controllers/`, `api-facturacion/router/`, `api-facturacion/middlewares/auth.middleware.js`.
- Cliente: `facturacion-app/src/main.tsx`, `facturacion-app/src/App.tsx`, `facturacion-app/src/Inicio/`, `facturacion-app/src/Formularios_Entrada/`, `facturacion-app/src/services/`.

## Ejemplo de `.env`

Incluye abajo dos ejemplos rápidos: uno para el backend (`api-facturacion`). Copia el bloque correspondiente a un archivo `.env` en la carpeta del proyecto y reemplaza los valores.

Ejemplo: `api-facturacion/.env`:

```env
# Puerto y entorno
PORT=4000
NODE_ENV=development

# Base de datos (PostgreSQL v14 o superior recomendada)
DB_HOST=localhost
DB_PORT=5432
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=tu_basedatos

# JWT
JWT_SECRET=tu_secreto_jwt
JWT_EXPIRES=1h
```

# Entorno de la app
VITE_APP_ENV=development
```


