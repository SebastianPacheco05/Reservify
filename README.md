# Reservify

Reservify es un sistema completo de gestión de reservas para restaurantes que facilita la administración y programación de citas y reservas de manera eficiente, con funcionalidades avanzadas para clientes, empleados y propietarios.

## 🚀 Características Principales

### 🔐 Sistema de Autenticación y Autorización
- **JWT (JSON Web Tokens)** para autenticación segura
- **Múltiples roles de usuario**: Cliente, Empleado, Propietario
- **Gestión de credenciales** con encriptación bcrypt
- **Sistema de permisos** basado en roles

### 🏪 Gestión de Restaurantes
- **Registro y administración** de restaurantes
- **Gestión de mesas** con disponibilidad en tiempo real
- **Categorías de restaurantes** para mejor organización
- **Información detallada** (horarios, ubicación, descripción)

### 📅 Sistema de Reservas Avanzado
- **Reservas en tiempo real** con validación de disponibilidad
- **Gestión de horarios** y franjas disponibles
- **Sistema de confirmaciones** automáticas
- **Historial de reservas** para cada usuario

### 👥 Múltiples Dashboards
- **Dashboard de Cliente**: Gestión de perfil, reservas y preferencias
- **Dashboard de Empleado**: Control de mesas, reservas y flujo diario
- **Dashboard de Propietario**: Análisis, métricas y administración completa

### 💰 Sistema de Facturación
- **Encabezados de factura** con información del cliente
- **Detalles de factura** con productos y servicios
- **Cálculos automáticos** de totales e impuestos
- **Historial de transacciones**

### 📊 Análisis y Reportes
- **Cálculos mensuales** de ingresos y reservas
- **Métricas de rendimiento** del restaurante
- **Estadísticas de clientes** y visitas
- **Reportes personalizables**

### 📧 Sistema de Notificaciones
- **Envío automático de correos** para confirmaciones
- **Notificaciones de recordatorio** de reservas
- **Sistema de contacto** integrado
- **Tareas programadas** para envío automático

### 🎨 Interfaz de Usuario Moderna
- **Diseño responsivo** para todos los dispositivos
- **Tema claro/oscuro** con toggle automático
- **Componentes UI modernos** con Radix UI y shadcn/ui
- **Animaciones y transiciones** suaves
- **Iconografía Lucide React** para mejor UX

## 🛠️ Tecnologías Utilizadas

### Backend
- **Lenguaje:** Python 3.8+
- **Framework:** FastAPI con ASGI
- **ORM:** SQLAlchemy 2.0+
- **Autenticación:** JWT (python-jose)
- **Encriptación:** bcrypt para contraseñas
- **Servidor ASGI:** Uvicorn con hot-reload
- **Variables de entorno:** python-dotenv
- **Envío de correos:** Sistema personalizado con SMTP
- **Base de datos:** PostgreSQL 12+
- **Validación:** Pydantic con tipos avanzados

### Frontend
- **Lenguaje:** TypeScript 5.8+
- **Framework:** React 19 con hooks modernos
- **Empaquetador:** Vite 6.3+ para desarrollo rápido
- **Estilos:** Tailwind CSS 4.1+ con animaciones
- **Componentes UI:** Radix UI + shadcn/ui
- **Iconos:** Lucide React para iconografía moderna
- **Ruteo:** React Router DOM 7.6+
- **Gestión de estado:** Hooks personalizados y contexto
- **Animaciones:** tailwindcss-animate y CSS personalizado

### Base de Datos
- **Gestor:** PostgreSQL 12+
- **Scripts SQL:** PL/pgSQL para triggers y auditoría
- **Funciones CRUD:** Procedimientos almacenados optimizados
- **Sistema de auditoría:** Tracking de cambios críticos

## 📋 Prerrequisitos

- **Python:** 3.8 o superior
- **Node.js:** 18.x o superior
- **PostgreSQL:** 12 o superior
- **npm:** 8.x o superior
- **Git:** Para clonar el repositorio

## ⚙️ Configuración del Entorno

### 1. Clonar el Repositorio
```bash
git clone <url-del-repositorio>
cd Reservify
```

### 2. Configuración del Backend

#### Crear Entorno Virtual
```bash
cd backend
python -m venv reservify-env
```

#### Activar Entorno Virtual
**Windows:**
```bash
.\reservify-env\Scripts\activate
```

**Linux/Mac:**
```bash
source reservify-env/bin/activate
```

#### Instalar Dependencias
```bash
pip install -r requirements.txt
```

#### Configurar Variables de Entorno
Crear archivo `.env` en la carpeta `backend`:

```env
# DATABASE
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/reservify_db

# JWT AUTHENTICATION
SECRET_KEY=tu_clave_secreta_muy_segura_aqui
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# EMAIL CONFIG
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_ADDRESS=tu_email@gmail.com
EMAIL_PASSWORD="tu_contraseña_de_aplicacion"
```

### 3. Configuración del Frontend

#### Instalar Dependencias
```bash
cd frontend
npm install
```

#### Configurar Variables de Entorno (Opcional)
Crear archivo `.env` en la carpeta `frontend`:

```env
VITE_API_URL=http://10.5.213.111:1106
```

### 4. Configuración de la Base de Datos

#### Ejecutar Scripts SQL
```bash
# Conectar a PostgreSQL y ejecutar:
\i scripts/tablas/creacion_tablas.sql
\i scripts/funciones/registrar.sql
# Y otros scripts según sea necesario
```

## 🚀 Ejecución del Proyecto

### Backend
```bash
cd backend
# Activar entorno virtual si no está activado
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Servidor disponible en:** `http://10.5.213.111:1106`

### Frontend
```bash
cd frontend
npm run dev
```

**Aplicación disponible en:** `http://localhost:5173`

## 📚 Documentación de la API

- **Swagger UI:** `http://10.5.213.111:1106/docs`
- **ReDoc:** `http://10.5.213.111:1106/redoc`
- **OpenAPI JSON:** `http://10.5.213.111:1106/openapi.json`

## 🏗️ Estructura del Proyecto

### Backend
```
backend/
├── main.py                 # Punto de entrada de la aplicación
├── config.py              # Configuración y variables de entorno
├── models.py              # Modelos Pydantic para validación
├── requirements.txt       # Dependencias de Python
├── funciones/            # Lógica de negocio
│   ├── auth/            # Autenticación y JWT
│   ├── cruds/           # Operaciones CRUD
│   ├── email_sender/    # Sistema de correos
│   └── register/        # Registro de usuarios
└── routes/              # Endpoints de la API
    ├── cliente.py       # Gestión de clientes
    ├── empleado.py      # Gestión de empleados
    ├── restaurante.py   # Gestión de restaurantes
    ├── reserva.py       # Sistema de reservas
    ├── mesas.py         # Gestión de mesas
    ├── facturas.py      # Sistema de facturación
    └── ...
```

### Frontend
```
frontend/
├── src/
│   ├── components/       # Componentes reutilizables
│   │   ├── ui/          # Componentes base (shadcn/ui)
│   │   ├── theme-toggle.tsx
│   │   ├── edit_profile_modal.tsx
│   │   └── ...
│   ├── pages/           # Páginas de la aplicación
│   │   ├── Home.tsx     # Página principal
│   │   ├── Login.tsx    # Autenticación
│   │   ├── Dashboard.tsx # Dashboard principal
│   │   ├── Dashboard_cliente.tsx
│   │   ├── employee-dashboard.tsx
│   │   └── Restaurant.tsx
│   ├── hooks/           # Hooks personalizados
│   ├── services/        # Servicios de API
│   ├── types/           # Definiciones de TypeScript
│   └── lib/             # Utilidades y helpers
├── public/              # Archivos estáticos
└── package.json         # Dependencias de Node.js
```

## 🔒 Seguridad

- **Contraseñas:** Hash bcrypt con salt único
- **Autenticación:** JWT con expiración configurable
- **Validación:** Pydantic para entrada de datos
- **CORS:** Configuración segura para frontend
- **Auditoría:** Tracking de operaciones críticas
- **Variables de entorno:** Credenciales sensibles protegidas

## 🎯 Funcionalidades por Rol

### 👤 Cliente
- Registro e inicio de sesión
- Explorar restaurantes y menús
- Realizar reservas en tiempo real
- Gestionar perfil personal
- Ver historial de reservas
- Sistema de comentarios y reseñas

### 👨‍💼 Empleado
- Dashboard de gestión diaria
- Control de mesas y disponibilidad
- Gestión de reservas entrantes
- Sistema de facturación
- Reportes de flujo diario

### 👑 Propietario
- Dashboard administrativo completo
- Gestión de múltiples restaurantes
- Análisis de métricas y rendimiento
- Reportes financieros mensuales
- Administración de empleados
- Configuración del sistema

## 🚀 Características Avanzadas

### 🌙 Tema Oscuro/Claro
- Toggle automático de tema
- Persistencia en localStorage
- Transiciones suaves entre temas
- Componentes adaptativos

### 📱 Diseño Responsivo
- Mobile-first approach
- Breakpoints optimizados
- Navegación adaptativa
- Componentes flexibles

### 🔄 Estado en Tiempo Real
- Actualización automática de datos
- Sincronización de reservas
- Notificaciones en vivo
- Cache inteligente

### 📊 Métricas y Analytics
- Dashboard con KPIs en tiempo real
- Gráficos interactivos
- Reportes exportables
- Análisis de tendencias

## 🤝 Contribución

1. **Fork** del proyecto
2. **Crear rama** para tu feature (`git checkout -b feature/NuevaFuncionalidad`)
3. **Commit** de tus cambios (`git commit -m 'Agrega nueva funcionalidad'`)
4. **Push** a la rama (`git push origin feature/NuevaFuncionalidad`)
5. **Abrir Pull Request**

### Guías de Contribución
- Seguir estándares de código establecidos
- Incluir tests para nuevas funcionalidades
- Documentar cambios en el README
- Mantener compatibilidad con versiones anteriores

## 🐛 Reporte de Bugs

Para reportar bugs o solicitar nuevas funcionalidades:

1. Verificar que no sea un problema ya reportado
2. Crear un issue con descripción detallada
3. Incluir pasos para reproducir el problema
4. Adjuntar logs o capturas de pantalla si es necesario

## 📝 Licencia

Este proyecto está bajo la **Licencia MIT** - ver el archivo [LICENSE.md](LICENSE.md) para más detalles.

## ✨ Agradecimientos

- **FastAPI** por su excelente documentación y facilidad de uso
- **React 19** por sus nuevas características y mejoras de rendimiento
- **PostgreSQL** por su confiabilidad y rendimiento
- **Tailwind CSS** por su sistema de diseño flexible
- **Radix UI** por sus componentes accesibles y personalizables
- **Lucide React** por su iconografía moderna y consistente

## 📞 Soporte

Para soporte técnico o consultas:
- **Email:** soporte@reservify.com
- **Documentación:** [docs.reservify.com](https://docs.reservify.com)
- **Issues:** [GitHub Issues](https://github.com/reservify/issues)

---

**Reservify** - Transformando la gestión de restaurantes, una reserva a la vez. 🍽️✨
