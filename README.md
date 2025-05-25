
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

- Sistema de autenticación y autorización
- Gestión de reservas y citas
- Interfaz de usuario intuitiva
- API RESTful para integración con otros sistemas
- Base de datos PostgreSQL para almacenamiento seguro

## 🛠️ Tecnologías Utilizadas

### Backend
- FastAPI (Framework web de Python)
- SQLAlchemy (ORM)
- PostgreSQL (Base de datos)
- Python 3.8+
- Uvicorn (Servidor ASGI)

### Frontend


## 📋 Prerrequisitos

- Python 3.8 o superior
- Node.js 14.x o superior
- PostgreSQL 12 o superior
- npm o yarn

## 🔧 Configuración del Entorno

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
Crear un archivo `.env` en la carpeta `backend` con el siguiente contenido:

```env
# Configuración de la Base de Datos
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/nombre_db

# Configuración de Seguridad


# Configuración del Servidor
HOST=0.0.0.0
PORT=8000
```

### Frontend

1. Instalar dependencias:
```bash
cd frontend
npm install
```

2. Configurar variables de entorno:
Crear un archivo `.env` en la carpeta `frontend` con el siguiente contenido:

```env
REACT_APP_API_URL=http://localhost:8000
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
npm start
```

La aplicación estará disponible en `http://localhost:3000`

## 📚 Documentación de la API

La documentación de la API está disponible en:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## 🔐 Seguridad

- Todas las contraseñas se almacenan de forma segura usando hash bcrypt
- Implementación de JWT para autenticación
- Protección contra ataques CSRF
- Validación de datos en todas las entradas

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para más detalles.

## ✨ Agradecimientos

- FastAPI por su excelente documentación y facilidad de uso
- React por su robustez y flexibilidad
- PostgreSQL por su confiabilidad y rendimiento

#	modified:   README.md