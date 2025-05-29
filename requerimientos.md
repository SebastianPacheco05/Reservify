# REQUERIMIENTOS DEL SISTEMA RESERVIFY

## 1. REQUERIMIENTOS FUNCIONALES

| ID | Categoría | Requerimiento | Descripción | Prioridad |
|----|-----------|---------------|-------------|-----------|
| RF1 | Gestión de Usuarios | Registro de Usuarios | El sistema debe permitir el registro de clientes, dueños, empleados y administradores | Alta |
| RF2 | Gestión de Usuarios | Autenticación | Cada usuario debe tener credenciales únicas (email y contraseña) | Alta |
| RF3 | Gestión de Usuarios | Roles y Permisos | El sistema debe mantener un registro de roles y permisos para cada tipo de usuario | Alta |
| RF4 | Gestión de Restaurantes | Registro de Restaurantes | Los dueños pueden registrar restaurantes con NIT, dirección, nombre, descripción y horarios | Alta |
| RF5 | Gestión de Restaurantes | Modificación | Los dueños pueden modificar la información de sus restaurantes | Media |
| RF6 | Gestión de Restaurantes | Eliminación | Los dueños pueden eliminar sus restaurantes del sistema | Baja |
| RF7 | Gestión de Mesas | Registro de Mesas | El sistema debe permitir la gestión de mesas con estado, capacidad y precio | Alta |
| RF8 | Gestión de Mesas | Modificación | Los restaurantes pueden modificar la información de sus mesas | Media |
| RF9 | Gestión de Mesas | Eliminación | Los restaurantes pueden eliminar mesas del sistema | Baja |
| RF10 | Sistema de Reservas | Creación | Los clientes pueden realizar reservas de mesas con fecha, hora y factura | Alta |
| RF11 | Sistema de Reservas | Modificación | Los clientes pueden modificar sus reservas | Media |
| RF12 | Sistema de Reservas | Cancelación | Los clientes pueden cancelar sus reservas | Media |
| RF13 | Sistema de Reservas | Validación | El sistema debe validar la disponibilidad de las mesas | Alta |
| RF14 | Gestión de Facturación | Generación | El sistema debe generar facturas con encabezado y detalle | Alta |
| RF15 | Gestión de Facturación | Historial | Los clientes pueden ver su historial de facturas | Media |
| RF16 | Gestión de Facturación | Gestión | Los restaurantes pueden gestionar sus facturas | Alta |
| RF17 | Gestión de Empleados | Registro | Los restaurantes pueden registrar y gestionar sus empleados | Alta |
| RF18 | Gestión de Empleados | Modificación | Los restaurantes pueden modificar la información de sus empleados | Media |
| RF19 | Gestión de Empleados | Eliminación | Los restaurantes pueden eliminar empleados del sistema | Baja |

## 2. REQUERIMIENTOS NO FUNCIONALES

| ID | Categoría | Requerimiento | Descripción | Prioridad |
|----|-----------|---------------|-------------|-----------|
| RNF1 | Seguridad | Autenticación | El sistema debe implementar autenticación segura | Alta |
| RNF2 | Seguridad | Encriptación | Las contraseñas deben estar encriptadas | Alta |
| RNF3 | Seguridad | Permisos | El sistema debe validar los permisos de cada usuario | Alta |
| RNF4 | Seguridad | Protección de Datos | Los datos sensibles deben estar protegidos | Alta |
| RNF5 | Seguridad | CORS | El sistema debe implementar CORS para seguridad en las peticiones | Media |
| RNF6 | Rendimiento | Tiempo de Respuesta | El sistema debe responder en menos de 2 segundos para operaciones básicas | Alta |
| RNF7 | Rendimiento | Concurrencia | El sistema debe manejar múltiples peticiones simultáneas | Alta |
| RNF8 | Rendimiento | Optimización | La base de datos debe estar optimizada para consultas frecuentes | Media |
| RNF9 | Escalabilidad | Usuarios | El sistema debe poder manejar crecimiento en número de usuarios | Alta |
| RNF10 | Escalabilidad | Restaurantes | El sistema debe poder manejar crecimiento en número de restaurantes | Alta |
| RNF11 | Escalabilidad | Reservas | El sistema debe poder manejar crecimiento en número de reservas | Alta |
| RNF12 | Escalabilidad | Transacciones | El sistema debe poder manejar crecimiento en volumen de transacciones | Alta |
| RNF13 | Disponibilidad | Tiempo de Actividad | El sistema debe estar disponible 24/7 | Alta |
| RNF14 | Disponibilidad | Respuesta | El sistema debe tener un tiempo de respuesta aceptable | Alta |
| RNF15 | Disponibilidad | Manejo de Errores | El sistema debe manejar errores y excepciones de manera adecuada | Alta |
| RNF16 | Mantenibilidad | Estándares | El código debe seguir estándares de programación | Media |
| RNF17 | Mantenibilidad | Documentación | El sistema debe tener documentación clara | Media |
| RNF18 | Mantenibilidad | Actualización | El sistema debe ser fácil de mantener y actualizar | Media |
| RNF19 | Usabilidad | API | La API debe ser intuitiva y fácil de usar | Alta |
| RNF20 | Usabilidad | Endpoints | Los endpoints deben seguir convenciones REST | Alta |
| RNF21 | Usabilidad | Respuestas | Las respuestas deben ser consistentes y claras | Alta |
| RNF22 | Integridad | Validación | El sistema debe validar todos los datos de entrada | Alta |
| RNF23 | Integridad | Consistencia | El sistema debe mantener la consistencia de los datos | Alta |
| RNF24 | Integridad | Transacciones | El sistema debe manejar transacciones de manera segura | Alta |
| RNF25 | Compatibilidad | Navegadores | El sistema debe ser compatible con diferentes navegadores | Media |
| RNF26 | Compatibilidad | Dispositivos | El sistema debe ser compatible con diferentes dispositivos | Media |
| RNF27 | Compatibilidad | Estándares Web | El sistema debe seguir estándares web | Media |

## 3. RESTRICCIONES TÉCNICAS

| ID | Categoría | Requerimiento | Descripción | Prioridad |
|----|-----------|---------------|-------------|-----------|
| RT1 | Tecnologías | Backend | FastAPI | Alta |
| RT2 | Tecnologías | Base de Datos | SQLite (desarrollo) / PostgreSQL (producción) | Alta |
| RT3 | Tecnologías | Autenticación | JWT | Alta |
| RT4 | Tecnologías | Validación | Pydantic | Alta |
| RT5 | Requisitos | Python | Versión 3.8 o superior | Alta |
| RT6 | Requisitos | Dependencias | Especificadas en requirements.txt | Alta |
| RT7 | Requisitos | Internet | Acceso a internet para operaciones en línea | Alta |
| RT8 | Limitaciones | Protección de Datos | Cumplir con regulaciones de protección de datos | Alta |
| RT9 | Limitaciones | Seguridad | Cumplir con regulaciones de seguridad | Alta |
| RT10 | Limitaciones | Facturación | Cumplir con regulaciones de facturación | Alta |

## 4. GLOSARIO DE TÉRMINOS

| Término | Descripción |
|---------|-------------|
| API | Interfaz de Programación de Aplicaciones |
| CORS | Compartir Recursos entre Orígenes |
| JWT | JSON Web Token |
| NIT | Número de Identificación Tributaria |
| ORM | Mapeo Objeto-Relacional |
| REST | Transferencia de Estado Representacional |
| SQL | Lenguaje de Consulta Estructurado |
