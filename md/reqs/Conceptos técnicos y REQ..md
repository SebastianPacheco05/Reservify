### Conceptos técnicos y REQ.
> Fuente: `md/currents/reservifyreq.v.1.0.xls.xlsx` → hoja **Conceptos técnicos y REQ.**

|Col 1|PALABRA|Col 3|CONCEPTO TÉCNICO|Col 5|Col 6|Col 7|Col 8|Col 9|Col 10|Col 11|Col 12|Col 13|Col 14|Col 15|Col 16|Col 17|Col 18|
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
||Python||Lenguaje de programación principal del backend. Es interpretado, de tipado dinámico (con soporte de tipado estático opcional) y tiene una gran cantidad de librerías para web, bases de datos, seguridad y ciencia de datos. Permite desarrollar rápido y mantener el código de forma legible.||||||||||Requirimientos||Totales||778|
||FastAPI||FastAPI es un framework de desarrollo web moderno y de alto rendimiento en Python, diseñado para facilitar la creación de APIs de forma rápida y sencilla. Se basa en las sugerencias de tipos estándar de Python y utiliza librerías como Pydantic para la validación y serialización de datos. FastAPI es conocido por su velocidad y facilidad de uso, permitiendo a los desarrolladores crear aplicaciones con menos código y mayor productividad.||||||||||||Completados||752|
||Uvicorn||Servidor ASGI ligero y muy rápido que ejecuta la aplicación FastAPI. Se encarga de recibir las peticiones HTTP, pasarlas a la app y devolver las respuestas. Soporta hot-reload en desarrollo para ver cambios al instante.|||||||||||||||
||SQLAlchemy||ORM (Object Relational Mapper) que permite interactuar con la base de datos usando objetos y clases en lugar de escribir SQL a mano. Facilita la creación de consultas complejas, migraciones y portabilidad entre motores de base de datos.||||||||||Porcentaje||96,66%|||
||Pydantic||Biblioteca Python para validación de datos usando anotaciones de tipos|||||||||||||||
||JWT||JSON Web Tokens son el mecanismo de autenticación. El backend emite tokens firmados con una clave secreta, que el cliente envía en cada petición protegida. python-jose se encarga de firmar, verificar y decodificar estos tokens de forma segura.|||||||||||||||
||bcrypt||Algoritmo de hash para contraseñas. En lugar de guardar las contraseñas en texto plano, se almacena un hash resistente a ataques de fuerza bruta. Bcrypt incluye un “coste” configurable que hace más lento el cálculo del hash (y por tanto más difícil de romper).|||||||||||||||
||python-dotenv||Carga las variables de entorno definidas en un archivo .env (como claves secretas, URLs de base de datos, credenciales de correo). Esto separa la configuración sensible del código fuente y facilita cambiar entornos (desarrollo, pruebas, producción).|||||||||||||||
||SMTP||Conjunto de funciones que usan el protocolo SMTP para enviar correos electrónicos (confirmaciones, recordatorios, contacto). Normalmente se conecta a servidores como Gmail u otros proveedores, autenticándose con usuario y contraseña seguros.|||||||||||||||
||POSTGRESQL||PostgreSQL es un sistema de gestión de base de datos relacional (RDBMS) de código abierto, ampliamente reconocido por su fiabilidad, flexibilidad y capacidad para manejar grandes cantidades de datos. Se considera una de las bases de datos relacionales de código abierto más avanzadas del mundo.|||||||||||||||
||TypeScript||Superconjunto tipado de JavaScript. Añade tipos estáticos opcionales, lo que ayuda a detectar errores en tiempo de compilación, mejorar el autocompletado y hacer el código más mantenible en una base de código grande como este frontend.|||||||||||||||
||React||Es una biblioteca Javascript de código abierto diseñada para crear interfaces de usuario con el objetivo de facilitar el desarrollo de aplicaciones en una sola página.|||||||||||||||
||VITE||Vite es una herramienta de desarrollo para el frontend (parte del sitio web que el usuario ve) que busca acelerar el desarrollo y la construcción de aplicaciones web modernas. Es conocido por su velocidad, tanto en el desarrollo como en la compilación final, y su facilidad de uso.|||||||||||||||
||React Router||Librería de ruteo para React en aplicaciones web. Permite definir rutas (URLs) que cargan páginas o componentes específicos, soporta rutas anidadas, parámetros, protección de rutas (según rol/estado de login) y navegación programática.|||||||||||||||
||TAILWINDCSS||Tailwind CSS es un framework CSS "Utility-first" que proporciona un conjunto de clases de utilidad para diseñar interfaces de usuario de forma rápida y eficiente. En lugar de definir componentes predefinidos como Bootstrap, Tailwind se centra en clases específicas para estilos individuales, como colores, espaciado, fuentes, sombras, etc. Esto permite a los desarrolladores crear diseños personalizados y mantener un código CSS más limpio y optimizado.|||||||||||||||
||tailwindcss-animate||Extensión de Tailwind que añade clases de animación ya definidas (fade, slide, etc.). Simplifica añadir transiciones y animaciones sin tener que escribir keyframes manualmente.|||||||||||||||
||Framer Motion||Librería de animaciones para React muy potente. Permite animaciones suaves, gestos (drag, hover, tap) y transiciones complejas entre componentes o páginas, con una API declarativa e integración estrecha con React.|||||||||||||||
||Radix UI||Colección de componentes de interfaz “sin estilos” pero accesibles (modales, menús, tooltips, etc.). Aporta la parte compleja de accesibilidad, manejo de foco, teclado, ARIA, etc., y el proyecto se encarga de aplicar el diseño visual (con Tailwind, por ejemplo).|||||||||||||||
||Shadcn/ui||Conjunto de componentes construidos sobre Radix UI y Tailwind. Ofrece componentes pre-armados y estilizados (botones, inputs, tarjetas, diálogos) listos para usar y muy coherentes, pero que siguen siendo personalizables a nivel de diseño.|||||||||||||||
||Lucide React||Paquete de iconos en formato React (SVG). Proporciona una amplia colección de iconos limpios y modernos que se integran fácilmente con Tailwind (p. ej. para tamaños y colores).|||||||||||||||
||Leaflet||Librería de JavaScript para mapas interactivos. Permite mostrar mapas, marcadores, popups, capas, etc. Es ligera y se integra bien con tiles de proveedores como OpenStreetMap.|||||||||||||||
||React Leaflet||Envoltura de Leaflet para React. Convierte las APIs de Leaflet en componentes React (<MapContainer>, <Marker>, etc.), para que puedas manejar el mapa dentro del mismo flujo declarativo de React.|||||||||||||||
||IMAP||IMAP (Internet Message Access Protocol) es un protocolo estándar de correo electrónico que permite acceder y gestionar mensajes directamente en el servidor desde múltiples dispositivos simultáneamente.|||||||||||||||
||Código base||Significado||Tipo / Ámbito principal||Ejemplo completo||Uso recomendado|||||||||
||BE||Backend||Requerimiento funcional de backend (API, lógica)||BE-01, BE-23a||Funcionalidades generales o por endpoint del backend.|||||||||
||P-BE||Backend - Pendiente / Parcial||Requerimiento de backend no implementado (gap)||P-BE-01||Deseables o futuros del backend, explícitamente no cubiertos aún.|||||||||
||FR||Frontend||Requerimiento funcional de frontend (UI/flujo)||FR-13a, FR-21g||Flujos funcionales de la SPA, vistas, pantallas, componentes clave|||||||||
||UI||Interfaz de Usuario||Detalle visual/UX (colores, animaciones, layout)||UI-01a, UI-25f||Detalles de diseño, temas claro/oscuro, estados visuales, interacciones|||||||||
||LG||Login / Gestion de acceso desde el frontend||Flujo de autenticación en UI||LG-03a||Campos de login, validaciones en formulario, redirecciones por rol|||||||||
||R||Routing (Frontend)||Rutas y navegación SPA||R-01, R-08||Mapeo URL → página/componente protegido o público|||||||||
||CSS||Estilos globales de CSS||Variables de tema y estilos base||CSS-10||Variables de color, tipografía, bordes, comportamiento global de CSS|||||||||
||ANIM||Animaciones||Variantes y transiciones de `framer-motion`||ANIM-03||Definición de animaciones reutilizables (fadeIn, slide, scale, etc.).|||||||||
||T||Toast (Notificaciones dentro de la UI)||Mensajes de feedback al usuario||T-10, T-21||Mensajes estándar de éxito/error/validación en toasts|||||||||
||NF||No Funcional (Global)||Requerimiento no funcional del sistema||NF-09, NF-35||Seguridad, rendimiento, disponibilidad, documentación, integraciones generales|||||||||
||GU||Gestion de Usuarios||Requerimiento funcional de gestión de usuarios||GU-01, GU-20||Registro, roles, perfiles, dashboards por rol, permisos de usuario|||||||||
||FI||Financiero||Requerimiento funcional financiero / contable||FI-01, FI-35||Facturación, pagos, métricas financieras, integración con pasarelas|||||||||
||DB||Base de datos||Requerimiento de modelo / SQL / integridad||DB-06, DB-40||Tablas, constraints, índices, funciones y triggers de BD|||||||||
||P-DB||Base de datos Pendiente / Parcial||Requerimiento de BD no implementado (gap)||P-DB-01||Reglas de BD deseadas pero no implementadas (modo mantenimiento, escalabilidad)|||||||||
||P-XX||Pendiente (Para cualquier Area)||Ítem pendiente o futuro (no cubierto hoy)||P-01a, P-06a||Tareas futuras identificadas (accesibilidad, escalabilidad, OAuth, etc.)|||||||||
||Significado de sufijos tipo a, b, etc. (ej. BE-23a)|||||||||||||||||
||BE-23 → grupo de requerimientos (por ejemplo, “Endpoints de credenciales”).|||||||||||||||||
||BE-23a → primer requerimiento atómico de ese grupo (ej. POST /credenciales/login).|||||||||||||||||
||BE-23b → segundo atómico del mismo grupo (ej. POST /credenciales/refresh).|||||||||||||||||
||BE-23c → tercero, etc.|||||||||||||||||
||En general:|||||||||||||||||
||Número (23) = bloque funcional o tema.|||||||||||||||||
||Letra (a, b, c…) = detalle específico verificable (un endpoint, una función, un caso de uso muy concreto) que pertenece a ese bloque.|||||||||||||||||
||Esto te permite en Excel (y en la documentación):|||||||||||||||||
||Tener una fila para el requerimiento general (sin letra) si lo necesitas.|||||||||||||||||
||Tener varias filas muy precisas (BE-23a, BE-23b, …) para marcar cumplimiento por caso atómico sin perder la relación con el grupo principal.|||||||||||||||||
