
# Please enter the commit message for your changes. Lines starting
# with '#' will be ignored, and an empty message aborts the commit.
#
# On branch main
# Your branch is up to date with 'origin/main'.
#
# Changes to be committed:
#	modified:   README.md
#
# Reservify

Reservify es un sistema de gestión de reservas diseñado para facilitar la administración y programación de citas y reservas de manera eficiente.

## 🚀 Características

- Sistema de autenticación y autorización (JWT)
- Gestión de reservas y citas
- Interfaz de usuario intuitiva y responsiva
- API RESTful para integración con otros sistemas
- Base de datos PostgreSQL para almacenamiento seguro
- Envío automático de correos electrónicos para notificaciones
- Auditoría de operaciones críticas en la base de datos

## 🛠️ Tecnologías Utilizadas

### Backend
- **Lenguaje:** Python 3.8+
- **Framework:** FastAPI
- **ORM:** SQLAlchemy
- **Autenticación:** JWT (python-jose)
- **Encriptación:** bcrypt
- **Servidor ASGI:** Uvicorn
- **Variables de entorno:** python-dotenv
- **Envío de correos:** email y utilidades propias
- **Base de datos:** PostgreSQL

### Frontend
- **Lenguaje:** TypeScript
- **Framework:** React 19
- **Empaquetador:** Vite
- **Estilos:** Tailwind CSS
- **Componentes UI:** Radix UI, shadcn/ui
- **Iconos:** Lucide React
- **Ruteo:** React Router DOM
- **Animaciones:** tailwindcss-animate
- **Gestión de estado y hooks personalizados**

### Base de Datos
- **Gestor:** PostgreSQL 12 o superior
- **Scripts SQL:** PL/pgSQL para triggers, auditoría y funciones CRUD

## 📋 Prerrequisitos

- Python 3.8 o superior
- Node.js 14.x o superior
- PostgreSQL 12 o superior
- npm o yarn

## ⚙️ Configuración del Entorno

### Backend

1. Crear un entorno virtual:
```bash
python -m venv reservify-env
```

2. Activar el entorno virtual:
- Windows:
```bash
.\reservify-env\Scripts\activate
```
- Linux/Mac:
```bash
source reservify-env/bin/activate
```

3. Instalar dependencias:
```bash
pip install -r backend/requirements.txt
```

4. Configurar variables de entorno:
Crear un archivo `.env` en la carpeta `backend` con el siguiente contenido **(obligatorio para el funcionamiento)**:

```env
# DATABASE
DATABASE_URL=

# JWT AUTHENTICATION
SECRET_KEY=
ALGORITHM=
ACCESS_TOKEN_EXPIRE_MINUTES=

# EMAIL CONFIG
EMAIL_HOST=
EMAIL_PORT=
EMAIL_ADDRESS=
EMAIL_PASSWORD=
```

### Frontend

1. Instalar dependencias:
```bash
cd frontend
npm install
```

2. (Opcional) Configurar variables de entorno para el frontend:
Crear un archivo `.env` en la carpeta `frontend` si necesitas personalizar la URL de la API:

```env
VITE_API_URL=http://localhost:8000
```

## 🚀 Ejecución del Proyecto

### Backend

1. Activar el entorno virtual (si no está activado)
2. Ejecutar el servidor:
```bash
cd backend
uvicorn main:app --reload
```

El servidor estará disponible en `http://localhost:8000`

### Frontend

1. Iniciar el servidor de desarrollo:
```bash
cd frontend
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 📚 Documentación de la API

La documentación de la API está disponible en:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## 🔒 Seguridad

- Contraseñas almacenadas de forma segura usando hash bcrypt
- Implementación de JWT para autenticación
- Validación de datos en todas las entradas
- Auditoría de operaciones críticas en la base de datos
- Uso de variables de entorno para credenciales sensibles

## 🤝 Contribución

1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/NuevaFeature`)
3. Haz commit de tus cambios (`git commit -m 'Agrega nueva feature'`)
4. Haz push a la rama (`git push origin feature/NuevaFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para más detalles.

## ✨ Agradecimientos

- FastAPI por su excelente documentación y facilidad de uso
- React por su robustez y flexibilidad
- PostgreSQL por su confiabilidad y rendimiento
- Tailwind CSS y Radix UI por mejorar la experiencia de usuario

#	modified:   README.md