# Reservify

## En pocas palabras: ¿de qué trata este proyecto?

**Reservify** es una aplicación web para **restaurantes** que sirve para **organizar reservas de mesas** sin depender solo de llamadas telefónicas o papel. En la práctica significa:

- Los **clientes** pueden ver restaurantes, elegir horario y dejar una reserva (cuando el sistema y las reglas del negocio lo permiten).
- Los **empleados** pueden ver qué mesas están ocupadas o libres y gestionar el día a día de las reservas.
- Los **propietarios** tienen una vista más amplia: varios locales si aplica, números, reportes y administración.

Todo esto está dividido en **dos partes que trabajan juntas**:

1. **Backend** (servidor con la lógica y la base de datos): responde peticiones seguras, guarda datos y aplica reglas (quién puede hacer qué).
2. **Frontend** (lo que ves en el navegador): pantallas, formularios y tableros que hablan con el backend.

Si alguien te pregunta _“¿y eso qué es en una frase?”_, puedes decir: **“Es un sistema para que un restaurante gestione mesas y reservas por internet, con distintos perfiles: cliente, empleado y dueño.”**

---

## Palabras que vas a leer seguido (glosario rápido)

| Término                  | Qué significa aquí, sin tecnicismos                                                                                                         |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------- |
| **API**                  | El “intermediario” por donde el frontend pide datos al backend (por ejemplo: “dame las reservas de hoy”).                                   |
| **JWT**                  | Una forma de demostrar **quién eres** después de iniciar sesión, sin mandar la contraseña en cada clic.                                     |
| **bcrypt**               | Forma de guardar contraseñas **revueltas** (hasheadas) para que, aunque alguien vea la base de datos, no vea la contraseña en claro.        |
| **ORM**                  | Capa que traduce filas de base de datos a objetos en código (para no escribir SQL a mano en todo el proyecto).                              |
| **PostgreSQL**           | Base de datos relacional donde viven usuarios, restaurantes, mesas, reservas, etc.                                                          |
| **Variables de entorno** | Archivo `.env` con claves secretas y direcciones (base de datos, correo). **No debes subirlas a internet** si contienen contraseñas reales. |
| **CORS**                 | Reglas del navegador que permiten o bloquean que tu web en un dominio/puerto llame a tu API en otro.                                        |

---

## ¿Qué incluye el sistema? (Características principales)

### Autenticación y permisos (quién entra y qué puede hacer)

- Acceso con **JWT** (sesión basada en token después del login).
- **Tres tipos de usuario** con distintos permisos: **Cliente**, **Empleado**, **Propietario** (dueño o administrador del negocio).
- Contraseñas guardadas de forma segura con **bcrypt**.
- Las acciones en el sistema se limitan según el **rol** (un cliente no debe poder hacer lo mismo que un propietario).

### Restaurantes, mesas e información del local

- Alta y administración de **restaurantes**.
- **Mesas** con idea de **disponibilidad** (para no reservar lo que ya no está libre).
- **Categorías** para clasificar restaurantes.
- Datos del local: **horarios**, **ubicación**, **descripción**, etc.

### Reservas

- Flujo de **reserva** con comprobación de **disponibilidad**.
- Trabajo con **horarios** y franjas que el negocio ofrece.
- **Confirmaciones** (incluye lógica de notificación cuando está configurado el correo).
- **Historial** de reservas vinculado al usuario.

### Paneles (dashboards) según el rol

- **Cliente**: perfil, sus reservas, preferencias.
- **Empleado**: día a día, mesas, reservas entrantes.
- **Propietario**: visión más global, métricas y administración.

### Facturación

- **Facturas** con encabezado (quién paga, datos básicos).
- **Líneas de detalle** (productos o conceptos cobrados).
- **Totales** e impuestos calculados automáticamente donde la lógica lo implemente.
- **Historial** de transacciones relacionadas.

### Análisis y reportes

- Cálculos por periodos (por ejemplo **mensual**): ingresos, reservas.
- Métricas orientadas al **rendimiento** del restaurante.
- Estadísticas de **clientes** y visitas.
- Reportes con posibilidad de **personalización** según lo implementado en código.

### Notificaciones por correo

- Envío de **correos** para confirmaciones y recordatorios (requiere configurar SMTP en `.env`).
- Posibilidad de **tareas programadas** para envíos automáticos cuando así esté montado el backend.

### Interfaz (lo visual)

- Diseño **responsive** (se adapta a móvil, tablet y escritorio).
- **Tema claro u oscuro** con interruptor y comportamiento coherente en la app.
- Componentes de interfaz con **Radix UI** y **shadcn/ui**.
- Animaciones y transiciones discretas para que la app se sienta fluida.
- Iconos con **Lucide React**.

---

## Tecnologías (qué está hecho con qué)

### Backend (servidor)

| Pieza                  | Para qué sirve                                                              |
| ---------------------- | --------------------------------------------------------------------------- |
| **Python 3.8+**        | Lenguaje del servidor.                                                      |
| **FastAPI**            | Framework para crear la API de forma moderna y documentada.                 |
| **SQLAlchemy 2.0+**    | ORM para hablar con PostgreSQL.                                             |
| **python-jose**        | Crear y validar **JWT**.                                                    |
| **bcrypt**             | Hashear contraseñas.                                                        |
| **Uvicorn**            | Servidor ASGI que ejecuta FastAPI (modo desarrollo con recarga automática). |
| **python-dotenv**      | Cargar variables desde `.env`.                                              |
| **SMTP personalizado** | Envío de correos cuando configures cuenta y servidor.                       |
| **PostgreSQL 12+**     | Base de datos principal.                                                    |
| **Pydantic**           | Validar datos de entrada y salida de la API.                                |

### Frontend (navegador)

| Pieza                     | Para qué sirve                                                       |
| ------------------------- | -------------------------------------------------------------------- |
| **TypeScript 5.8+**       | JavaScript con tipos para menos errores en pantallas grandes.        |
| **React 19**              | Librería de interfaz por componentes.                                |
| **Vite 6.3+**             | Herramienta para levantar el proyecto frontend rápido en desarrollo. |
| **Tailwind CSS 4.1+**     | Estilos utilitarios y animaciones.                                   |
| **Radix UI + shadcn/ui**  | Componentes accesibles y consistentes.                               |
| **Lucide React**          | Iconos.                                                              |
| **React Router DOM 7.6+** | Navegación entre páginas de la SPA.                                  |
| **Estado**                | Hooks propios y React Context donde el proyecto lo use.              |

### Base de datos

- **PostgreSQL 12+** como motor.
- Scripts en **PL/pgSQL** para triggers y auditoría donde estén definidos.
- Procedimientos y funciones para **CRUD** y operaciones repetitivas.
- **Auditoría** de cambios importantes cuando los triggers o tablas de log lo registren.

---

## Requisitos previos (qué necesitas instalado antes de empezar)

Antes de tocar el código, en tu computadora deberías tener:

| Programa       | Versión mínima recomendada | Por qué lo pides                                                            |
| -------------- | -------------------------- | --------------------------------------------------------------------------- |
| **Python**     | 3.8 o superior             | Para ejecutar el backend.                                                   |
| **Node.js**    | 18.x o superior            | Para instalar dependencias y correr el frontend.                            |
| **npm**        | 8.x o superior             | Gestor de paquetes de Node (viene con Node en la mayoría de instalaciones). |
| **PostgreSQL** | 12 o superior              | Donde viven los datos del sistema.                                          |
| **Git**        | Cualquiera reciente        | Para clonar y versionar el proyecto.                                        |

Si falta alguno, instálalo primero; sin PostgreSQL y sin Python/Node no podrás levantar el sistema completo.

---

## Configuración paso a paso (entorno de desarrollo)

La idea general es: **(1)** clonar, **(2)** crear base de datos y tablas, **(3)** configurar `.env` del backend, **(4)** opcionalmente `.env` del frontend, **(5)** ejecutar backend y frontend en dos terminales.

### 1. Obtener el código

```bash
git clone <url-del-repositorio>
cd Reservify
```

Sustituye `<url-del-repositorio>` por la URL real de tu Git (GitHub, GitLab, etc.).

### 2. Backend: entorno Python y dependencias

```bash
cd backend
python -m venv reservify-env
```

**Activar el entorno virtual**

- En **Windows (PowerShell o CMD desde la carpeta `backend`)**:
  ```bash
  .\reservify-env\Scripts\activate
  ```
- En **Linux o macOS**:
  ```bash
  source reservify-env/bin/activate
  ```

Con el entorno activado (verás el nombre del venv en la consola):

```bash
pip install -r requirements.txt
```

### 3. Backend: archivo `.env`

En la carpeta **`backend`**, crea un archivo llamado **`.env`** (sin nombre adicional antes del punto). Ahí van secretos y conexiones. Ejemplo de plantilla:

```env
# Base de datos: usuario, contraseña, host, puerto y nombre de la base
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/reservify_db

# JWT: la API firma tokens con esta clave (debe ser larga y aleatoria en producción)
SECRET_KEY=tu_clave_secreta_muy_segura_aqui
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Correo (Gmail suele usar app password si tienes 2FA)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_ADDRESS=tu_email@gmail.com
EMAIL_PASSWORD="tu_contraseña_de_aplicacion"

```

**Notas importantes:**

- `DATABASE_URL` debe apuntar a una base **que ya exista** en PostgreSQL (o créala antes con `createdb` o desde pgAdmin).
- `SECRET_KEY` en un servidor real no debe ser una frase obvia; genérala de forma aleatoria.
- Si no configuras correo, las partes que envían email pueden fallar o quedar desactivadas según cómo esté programado el código; eso es esperable.

### 4. Frontend: dependencias

Desde la raíz del proyecto (o navegando a `frontend`):

```bash
cd frontend
npm install
```

### 5. Frontend: `.env` opcional (URL del backend)

Si tu API **no** está en la misma máquina o puerto por defecto que asume el frontend, crea **`frontend/.env`**:

```env
VITE_API_URL=http://10.5.213.111:1106
```

**Qué implica:** `VITE_API_URL` es la dirección base donde el navegador llamará al backend. Debe ser la URL **accesible desde tu PC** (localhost si todo es local, o la IP del servidor si pruebas en red). El valor del ejemplo es solo ilustrativo: **cámbialo** a tu IP y puerto reales.

### 6. Base de datos: ejecutar scripts SQL

Conéctate a PostgreSQL (por `psql`, DBeaver, pgAdmin, etc.) y ejecuta los scripts del proyecto en el orden que indique la documentación interna del repo. Típicamente incluyen creación de tablas y funciones, por ejemplo:

```text
\i scripts/tablas/creacion_tablas.sql
\i scripts/funciones/registrar.sql
```

Repite con **todos** los scripts que el proyecto liste como necesarios (no te saltes ninguno si el orden importa).

---

## Cómo ejecutar el proyecto (cada vez que desarrolles)

Necesitas **dos procesos** a la vez: uno para API, otro para la web.

### Backend (API FastAPI)

```bash
cd backend
# Activa el venv si no lo está
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Interpretación del comando:**

- `main:app` = archivo `main.py`, variable `app` (punto de entrada de FastAPI).
- `--reload` = recarga al guardar cambios (solo desarrollo).
- `--host 0.0.0.0` = escucha en todas las interfaces de red de la máquina (útil si entras desde otro dispositivo en la misma red).
- `--port 8000` = puerto local **8000**.

En el README original aparecía la API en `http://10.5.213.111:1106`: eso corresponde a un **despliegue o configuración concreta** (otra IP y otro puerto). En tu PC, lo habitual será:

- `http://127.0.0.1:8000` o `http://localhost:8000`

y en el **frontend** pondrás en `VITE_API_URL` exactamente esa base URL (con el puerto que uses).

### Frontend (Vite + React)

```bash
cd frontend
npm run dev
```

Por defecto Vite suele servir en **`http://localhost:5173`**. Abre esa dirección en el navegador.

---

## Documentación interactiva de la API (Swagger / ReDoc)

Cuando el backend esté en marcha, puedes probar endpoints en el navegador:

- **Swagger UI:** `http://<tu-host>:<tu-puerto>/docs`
- **ReDoc:** `http://<tu-host>:<tu-puerto>/redoc`
- **OpenAPI JSON:** `http://<tu-host>:<tu-puerto>/openapi.json`

Sustituye `<tu-host>` y `<tu-puerto>` por los mismos valores que usaste al arrancar Uvicorn (por ejemplo `localhost` y `8000`). Las URLs con `10.5.213.111:1106` del ejemplo antiguo solo aplican si tu servidor corre ahí.

---

## Estructura de carpetas (mapa mental del código)

### Backend

```text
backend/
├── main.py                 # Arranque de la aplicación FastAPI
├── config.py               # Lectura de configuración / .env
├── models.py               # Modelos Pydantic (validación)
├── requirements.txt        # Dependencias Python
├── funciones/              # Lógica de negocio agrupada
│   ├── auth/               # Login, JWT
│   ├── cruds/              # Alta/baja/modificación de datos
│   ├── email_sender/       # Correo
│   └── register/           # Registro de usuarios
└── routes/                 # Rutas HTTP expuestas
    ├── cliente.py
    ├── empleado.py
    ├── restaurante.py
    ├── reserva.py
    ├── mesas.py
    ├── facturas.py
    └── ...                 # Otras rutas del proyecto
```

### Frontend

```text
frontend/
├── src...
│   ├── components/         # Piezas reutilizables de interfaz
│   │   ├── ui/             # Componentes base (shadcn)
│   │   ├── theme-toggle.tsx
│   │   ├── edit_profile_modal.tsx
│   │   └── ...
│   ├── pages/              # Pantallas completas
│   │   ├── Home.tsx
│   │   ├── Login.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Dashboard_cliente.tsx
│   │   ├── employee-dashboard.tsx
│   │   └── Restaurant.tsx
│   │   └── ...
│   ├── hooks/              # Lógica reutilizable en React
│   ├── services/           # Llamadas a la API
│   ├── types/              # Tipos TypeScript
│   └── lib/                # Utilidades
├── public/                 # Archivos estáticos (imágenes, favicon, etc.)
└── package.json
```

---

## Seguridad (qué cubre el diseño del proyecto)

- **Contraseñas:** no se guardan en texto plano; se usa **bcrypt** con salt.
- **Sesión API:** **JWT** con caducidad configurable (`ACCESS_TOKEN_EXPIRE_MINUTES`).
- **Entrada de datos:** validación con **Pydantic** para reducir datos incorrectos o maliciosos.
- **CORS:** debe configurarse para que solo tu frontend de confianza llame a la API en entornos reales.
- **Auditoría:** registro de operaciones sensibles cuando el esquema SQL y el código lo implementen.
- **Secretos:** `SECRET_KEY`, contraseñas de base de datos y de correo van en **`.env`** y ese archivo no debe publicarse en repositorios abiertos con valores reales.

---

## Qué puede hacer cada rol (resumen operativo)

### Cliente

- Registrarse e iniciar sesión.
- Explorar restaurantes y, según la pantalla, menús u oferta.
- Crear reservas respetando disponibilidad.
- Editar perfil y ver historial de reservas.
- Comentarios y reseñas donde la funcionalidad esté habilitada.

### Empleado

- Panel orientado al **turno**: mesas y reservas del día.
- Actualizar disponibilidad y gestionar reservas entrantes.
- Facturación asociada a su flujo de trabajo.
- Reportes de actividad diaria.

### Propietario

- Panel administrativo amplio.
- Gestión de uno o varios restaurantes según permisos.
- Métricas y reportes financieros / mensuales.
- Administración de empleados y ajustes del sistema que el negocio permita.

---

## Comportamiento avanzado de la aplicación (UX y tiempo real)

- **Tema claro/oscuro:** cambio manual, guardado típico en `localStorage`, transiciones suaves.
- **Responsive:** pensado primero para móvil y escalado a pantallas grandes.
- **Datos al día:** recarga o sincronización de reservas según lo implementado (no asumas WebSockets salvo que el código los use).
- **Métricas:** tableros con indicadores y gráficos cuando esas pantallas estén construidas.

---

## Cómo contribuir (si trabajas en equipo)

1. Haz un **fork** del repositorio (si la plataforma lo usa).
2. Crea una **rama** para tu cambio: `git checkout -b feature/NuevaFuncionalidad`
3. **Commit** claro: `git commit -m 'Describe el cambio en una frase'`
4. **Sube** la rama: `git push origin feature/NuevaFuncionalidad`
5. Abre un **Pull Request** para revisión.

Buenas prácticas:

- Respeta el estilo de código existente.
- Añade pruebas si el proyecto las usa para nuevas piezas críticas.
- Actualiza este README si cambias requisitos de instalación o variables de entorno.
- Evita romper compatibilidad sin avisar en el mensaje del PR.

---

## Reportar errores (bugs)

1. Comprueba si ya hay un **issue** abierto con el mismo problema.
2. Abre uno nuevo con **título claro** y **pasos para reproducir** (1, 2, 3…).
3. Indica sistema operativo, versión de Node/Python si aplica.
4. Adjunta capturas o trozos de log **sin contraseñas ni tokens**.

---

## Licencia

El proyecto se contempla bajo la **Licencia MIT**. Si en el raíz del repositorio existe un archivo `LICENSE` o `LICENSE.md`, allí está el texto legal íntegro.

---

## Agradecimientos

- **FastAPI** por documentación clara y productividad en APIs.
- **React** y el ecosistema actual por interfaces mantenibles.
- **PostgreSQL** por fiabilidad como base de datos.
- **Tailwind CSS**, **Radix UI**, **Lucide** y **shadcn/ui** por un frontend consistente y accesible.

---

## Soporte y contacto (placeholders del README original)

Los datos siguientes son **ejemplos** típicos en documentación; sustitúyelos por los canales reales de tu equipo o institución:

- **Email de soporte:** soporte@reservify.com
- **Documentación externa:** [docs.reservify.com](https://docs.reservify.com)
- **Incidencias en código:** la sección Issues del hosting Git que uses

---

## Sobre el autor

Este proyecto fue desarrollado por **Sebastian Pacheco** como solución práctica para mejorar la gestión de reservas en restaurantes.

Si quieres conocer más sobre mi trabajo, puedes visitar:

- **Portafolio:** https://portafolio-one-lime.vercel.app/
- **LinkedIn:** https://www.linkedin.com/in/sebastian-pacheco-8304b729a/
- **GitHub:** https://github.com/SebastianPacheco05

---

**Reservify** — Herramienta para ordenar reservas y operación diaria en restaurantes, con roles claros para clientes, personal y administración.
