### Requerimientos no funcionales del frontend (desde Excel)

> Fuente: `md/currents/reservifyreq.v.1.0.xls.xlsx` → hoja **REQ. no funcionales Frontend**

| ID | Requerimiento (1 por fila) | Estado | Evidencia |
|---|---|---|---|
| NFF-001 | Color primario Naranja degradado usado en :Título principal “Reserva en tu restaurante favorito”,Botón “Buscar”,Botón “Ver disponibilidad”, | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-002 | Color secundario: Azul oscuro / gris azulado usado en :Botón “Iniciar Sesión”,Títulos secundarios | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-003 | Color de acción secundaria: Verde suave usado en:Botón “Registrarse” | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-004 | Fondo general:Degradado beige / crema claro | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-005 | Footer:Azul oscuro | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-006 | Fuente sans-serif moderna (ej. Inter, Poppins o similar):Título principal: mínimo 48px,Subtítulo: 20–24px, Texto normal: 14–16px,Botones: 14–16px, semibold | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-007 | header debe incluir al lado izquierdo el logo de "RESERVIFY" | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-008 | header debe incluir al lado centralel enlace "RESTAURANTES" | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-009 | header debe incluir al lado derecho: Botón modo oscuro (icono sol/luna), Botón “Iniciar Sesión” (color azul oscuro),Botón “Registrarse” (color verde suave) | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-010 | Altura máxima del header: 80px | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-011 | Debe permanecer fijo al hacer scroll (sticky navbar). | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-012 | Debe contener Título centrado horizontalmente. | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-013 | Debe contener Subtítulo centrado debajo. | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-014 | Debe contener Barra de búsqueda centrada:Ancho: 60% del contenedor en escritorio, Altura mínima: 50px, Bordes redondeados (border-radius: 30px), Ícono de lupa a la izquierda,Botón “Buscar” alineado a la derecha dentro del input. | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-015 | Debe contener Chips de categorías:Italiana,Japonesa,Mexicana, Mediterránea, Deben estar alineadas horizontalmente.,Border-radius: 20px, Fondo azul claro. | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-016 | Debe contener Opción “Usar mi ubicación actual” debajo centrado. | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-017 | Debe incluir Tarjetas horizontales con: Icono centrado, Nombre de cocina debajo, Sombra suave (box-shadow),Border-radius: 15px. | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-018 | Debe incluir:Indicadores inferiores (dots activos). | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-019 | Cada tarjeta debe contener: Imagen en la parte superior(opcional),Etiqueta naranja “Disponible hoy” en esquina superior derecha., Nombre del restaurante en negrita, Precio (ej. $$) alineado a la derecha, Descripción corta, Calificación con estrella, Horario, Dirección, Botón “Ver disponibilidad” ancho completo en parte inferior. | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-020 | Cada tarjeta debe contener: Ancho tarjeta: 300–350px. | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-021 | Cada tarjeta debe contener: Altura proporcional fija. | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-022 | Cada tarjeta debe contener efecto hover:Elevación (transform: translateY(-5px)),Cambio de borde a naranja. | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-023 | Debe incluir 3 columnas:Reserva Instantánea, Para Todos, Los Mejores | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-024 | Cada columna:Icono dentro de contenedor cuadrado con fondo suave, Título debajo, Texto descriptivo centrado. | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-025 | “¿Listo para tu próxima experiencia culinaria?” debe tener:Fondo degradado naranja → verde, Texto blanco. Botón blanco centrado:Border-radius: 12px, Hover: fondo gris claro. | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-026 | Footer Debe contener 4 columnas:, Logo + descripción, Restaurantes (Buscar / Cocinas), Empresa (Acerca de / Contacto), Soporte (Ayuda / Términos / Privacidad) | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-027 | El footer de tener como requisitos:Fondo azul oscuro, Texto blanco, Separador horizontal superior, Copyright centrado. | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-028 | Responsive Design Móvil:Navbar colapsable (hamburguesa), Tarjetas en columna,Botones full width. Tablet:2 tarjetas por fila. Escritorio:3 tarjetas por fila. | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-029 | Accesibilidad:Contraste mínimo 4.5:1, Botones navegables con teclado,Labels accesibles en inputs,Uso correcto de etiquetas semánticas HTML5. | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-030 | Rendimiento: Lazy loading en imágenes, Compresión WebP,Minificación de CSS y JS,Tiempo de carga < 3 segundos. | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-031 | Seguridad:HTTPS obligatorio, Sanitización de inputs, Tokens JWT seguros,Protección contra(SQL Injection ,XSS, CSRF). | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-032 | INICIO SESIÓN - modo claro | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-033 | Utilizando JavaScript, se realiza una validación de los campos del formulario. Si algún campo obligatorio está vacío al momento de presionar el botón de enviar mensaje, se mostrará un texto en color rojo indicando que el campo debe ser llenado. | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-034 | Fondo general: Degradado vertical en tonos beige/crema claro. Desde #e8dfd3 (parte superior) hasta #d8cfc2 (parte inferior). Debe ocupar 100% del alto y ancho de la pantalla. | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-035 | Contenedor del formulario: Ancho máximo 420px, ancho relativo 90% en móviles. Padding interno mínimo 32px. Fondo blanco (#ffffff). Bordes redondeados 16px. Sombra suave: 0 10px 25px rgba(0,0,0,0.08). | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-036 | Icono superior de seguridad: Contenedor 56px x 56px. Border-radius 12px. Degradado diagonal 135° desde #ff7a3d hasta #f4b942. Icono interno en color blanco, centrado. | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-037 | Título principal “Bienvenido a Reservify”: Fuente sans-serif (Inter/Poppins). Tamaño 36px–42px. Color #2b2b2b. Alineación centrada. | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-038 | Subtítulo “Inicia sesión en tu cuenta”: Tamaño 14px–16px. Color #6b6b6b. Centrado. | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-039 | Subtítulo interno “Iniciar Sesión”: Tamaño 18px–20px. Color #333333. | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-040 | Texto descriptivo interno: Tamaño 13px–14px. Color #777777. | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-041 | Campo “Correo electrónico”: Altura 48px. Fondo #f1ece6. Borde 1px sólido #d6d1c9. Border-radius 10px. Texto ingresado color #333333. Placeholder color #9a9a9a. Icono izquierdo 16px–18px color gris medio. | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-042 | Campo “Contraseña”: Misma altura y estilos que el campo de correo. Incluye icono izquierdo (candado) y derecho (visualización) en color gris medio. En focus: borde color #ff7a3d y sombra 0 0 0 3px rgba(255,122,61,0.15). | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-043 | Enlace “¿Olvidaste tu contraseña?”: Tamaño 13px–14px. Color #ff7a3d. Sin fondo. Hover: #e5672f. | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-044 | Botón principal “Iniciar Sesión”: Altura 50px. Ancho 100%. Fondo #ff6b35. Texto blanco #ffffff. Border-radius 10px. Hover: #e85c2a. Transición 0.3s. | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-045 | Separador “O continúa con”: Texto centrado 12px–13px color #8a8a8a. Líneas laterales 1px color #dddddd. | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-046 | Botón “Google”: Altura 48px. Fondo #f2f2f2. Borde 1px sólido #dcdcdc. Border-radius 10px. Texto #333333. Icono oficial Google alineado a la izquierda. Hover: #e6e6e6. | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-047 | Texto “¿No tienes una cuenta?”: Tamaño 13px–14px. Color #777777 | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-048 | Enlace “Regístrate aquí”: Color #ff6b35. Sin fondo. Hover: #e85c2a. | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-049 | Texto legal inferior: Tamaño 12px. Color #9a9a9a. Alineación centrada. Espaciado horizontal uniforme entre enlaces. | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-050 | Botón modo claro/oscuro (icono sol): Tamaño aproximado 36px x 36px. Fondo neutro claro #f0ebe4. Border-radius 8px. Icono color #ff7a3d. | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-051 | Enlace superior “Volver al inicio”: Tamaño 14px. Color #ff7a3d. Sin fondo. Hover con ligera variación de tono. | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-052 | Enlace superior “Volver al inicio”: Tamaño 14px. Color #ff7a3d. Sin fondo. Hover con ligera variación de tono. | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-053 | Fondo general: Degradado radial oscuro centrado en el formulario. Desde negro profundo (#0f0f0f) en los bordes hacia un gris muy oscuro (#1a1a1a – #222222) en la zona central. Debe cubrir 100% del alto y ancho de la pantalla. | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-054 | Contenedor del formulario: Ancho máximo 420px. Ancho relativo 90% en dispositivos móviles. Padding interno mínimo 32px. Fondo gris muy oscuro (#1c1c1c). Borde 1px sólido rgba(255,255,255,0.05). Border-radius 16px. Sombra exterior 0 10px 30px rgba(0,0,0,0.6). | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-055 | Icono superior de seguridad: Contenedor 56px x 56px. Border-radius 12px. Degradado diagonal 135° desde #ff7a3d hasta #f4b942. Icono interno en color blanco (#ffffff), centrado. | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-056 | Título principal “Bienvenido a Reservify”: Fuente sans-serif (Inter/Poppins). Tamaño 36px–42px. Color blanco (#ffffff). Alineación centrada. | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-057 | Subtítulo “Inicia sesión en tu cuenta”: Tamaño 14px–16px. Color gris claro (#b3b3b3). Centrado. | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-058 | Subtítulo interno “Iniciar Sesión”: Tamaño 18px–20px.Color blanco (#f5f5f5). | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-059 | Texto descriptivo interno: Tamaño 13px–14px. Color gris medio (#9a9a9a). | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-060 | Campo “Correo electrónico”: Altura 48px. Fondo negro suave (#111111). Borde 1px sólido rgba(255,255,255,0.08). Border-radius 10px. Texto ingresado color blanco (#ffffff). Placeholder color #8a8a8a. Icono izquierdo 16px–18px en color gris claro (#b0b0b0). | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-061 | Campo “Contraseña”: Misma altura y estilos que el campo de correo. Incluye icono izquierdo (candado) y derecho (ojo) en color gris claro (#b0b0b0). En focus: borde color rojo corporativo (#b91c1c) y sombra 0 0 0 3px rgba(185,28,28,0.25). | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-062 | Enlace “¿Olvidaste tu contraseña?”: Tamaño 13px–14px. Color rojo corporativo (#b91c1c). Sin fondo. Hover: #991b1b. | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-063 | Botón principal “Iniciar Sesión”: Altura 50px. Ancho 100%. Fondo rojo intenso (#b91c1c). Texto blanco (#ffffff). Border-radius 10px. Hover: #991b1b. Transición 0.3s. | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-064 | Separador “O continúa con”: Texto centrado 12px–13px color #8a8a8a. Líneas laterales 1px color rgba(255,255,255,0.1). | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-065 | Botón “Google”: Altura 48px. Fondo negro sólido (#0d0d0d). Borde 1px sólido rgba(255,255,255,0.08). Border-radius 10px. Texto blanco (#ffffff). Icono oficial Google alineado a la izquierda. Hover: #1a1a1a. | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-066 | Texto “¿No tienes una cuenta?”: Tamaño 13px–14px. Color gris medio (#9a9a9a). | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-067 | Enlace “Regístrate aquí”: Color rojo corporativo (#b91c1c). Hover: #991b1b. | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-068 | Texto legal inferior: Tamaño 12px. Color gris tenue (#7a7a7a). Alineación centrada. Separación uniforme entre enlaces. | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-069 | Botón modo oscuro (icono luna): Tamaño aproximado 36px x 36px. Fondo negro suave (#111111). Border-radius 8px. Icono color rojo (#b91c1c) o blanco según contraste. | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-070 | Enlace superior “Volver al inicio”: Tamaño 14px. Color rojo corporativo (#b91c1c). Sin fondo. Hover con ligera variación a #991b1b. | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-071 | Fondo general: Degradado claro y cálido, transición suave desde beige muy claro (#f5f1ea) en los bordes hacia crema ligeramente más profundo (#ebe4d8 – #e6dccb). Debe cubrir el 100% del alto y ancho de la pantalla. | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-072 | Contenedor del formulario: Ancho máximo 420px y 90% en móviles. Padding interno 32px. Fondo blanco (#ffffff). Borde 1px rgba. Border-radius 16px. Sombra 0 10px 30px. | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-073 | Icono superior de seguridad: 56px x 56px. Border-radius 14px. Degradado desde #ff7a3d hasta #7cbf9e. Icono blanco (#ffffff) centrado. Sombra sutil 0 8px 20px. | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-074 | Título principal “Bienvenido a Reservify”: Fuente sans-serif (Inter/Poppins). Tamaño 36px–42px. Color gris muy oscuro (#222222). Centrado. | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-075 | Subtítulo “Registra tu cuenta de Reservify”: Tamaño 14px–16px. Color gris medio (#6b7280). Centrado. | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-076 | Subtítulo interno “Crea tu cuenta”: Tamaño 18px–20px. Color gris oscuro (#2b2b2b). | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-077 | Texto descriptivo “Ingresa tus datos para crear tu cuenta”: Tamaño 13px–14px. Color gris medio (#8a8a8a). | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-078 | Campo “Correo electrónico”: Altura 48px. Fondo gris claro (#f3f4f6). Borde 1px rgba. Border-radius 10px. Texto #222222. Placeholder #9ca3af. Icono izquierdo gris (#9a9a9a). | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-079 | Campo “Contraseña”: Mismos estilos que correo. Icono izquierdo candado y derecho ojo en gris (#9a9a9a). | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-080 | Campo “Confirmar contraseña”: Mismos estilos. Validación en tiempo real. | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-081 | Enlace “¿Olvidaste tu contraseña?”: Tamaño 13px–14px. Color #ff7a3d. Hover #e5672f. | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-082 | Botón principal “Continuar”: Altura 50px. Ancho 100%. Degradado horizontal #ff7a3d a #7cbf9e. Texto blanco (#ffffff). Border-radius 12px. Sombra 0 8px 20px. Hover con ligera elevación y transición 0.3s. fondo #d1d5db y texto #6b7280. | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-083 | Separador “O continúa con”: Texto centrado 12px–13px color #9ca3af. Líneas laterales 1px. | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-084 | Botón “Google”: Altura 48px. Fondo blanco (#ffffff). Borde 1px. Border-radius 10px. Texto #222222. Hover #f3f4f6. | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-085 | Texto inferior y enlaces secundarios: Tamaño 12px–14px. Color gris medio (#9ca3af). Enlaces en #ff7a3d con hover #e5672f. | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-086 | Botón modo oscuro (icono luna): 36px x 36px. Fondo blanco (#ffffff). Borde 1px rgba. Border-radius 8px. Icono gris oscuro (#444444). | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-087 | Enlace superior “Volver al inicio”: Tamaño 14px. Color #ff7a3d. Hover #e5672f. | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-088 | Fondo general: Fondo oscuro uniforme con ligera variación hacia el centro. Predomina negro profundo (#0f0f0f – #121212) cubriendo el 100% del alto y ancho de la pantalla. | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-089 | Contenedor del formulario: Ancho aproximado 420px, centrado. Fondo gris muy oscuro (#1a1a1a – #1c1c1c). Bordes redondeados (aprox. 16px). Sombra exterior suave que lo separa del fondo. | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-090 | Icono superior de seguridad: Contenedor cuadrado con bordes redondeados (aprox. 12px–14px). Degradado diagonal en tonos naranja. Icono de candado blanco centrado. | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-091 | Título principal “Bienvenido a Reservify”: Tamaño grande (aprox. 36px–42px). Color blanco (#ffffff). Alineación centrada. | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-092 | Subtítulo “Registra tu cuenta de Reservify”: Tamaño pequeño (aprox. 14px–16px). Color gris claro (#b3b3b3). Centrado. | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-093 | Subtítulo interno “Crea tu cuenta”: Tamaño medio (aprox. 18px–20px). Color blanco o gris muy claro. Centrado dentro del formulario. | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-094 | Texto descriptivo “Ingresa tus datos para crear tu cuenta”: Tamaño pequeño (aprox. 13px–14px). Color gris medio. | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-095 | Campo “Correo electrónico”: Altura aproximada 48px. Fondo negro/gris muy oscuro (#111111). Borde sutil más claro que el fondo. Border-radius cercano a 10px. Texto blanco. Placeholder en gris. Icono izquierdo en gris claro. | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-096 | Campo “Contraseña”: Mismos estilos que el campo de correo. Incluye icono izquierdo (candado) y derecho (ojo) en gris claro. | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-097 | Campo “Confirmar contraseña”: Mismos estilos que contraseña. Incluye iconos izquierdo y derecho en gris claro. | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-098 | Enlace “¿Olvidaste tu contraseña?”: Tamaño pequeño. Color rojo (#b91c1c). Centrado debajo de los campos. | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-099 | Botón principal “Continuar”: Altura aproximada 50px. Ancho 100%. Fondo con degradado horizontal en tonos rojo a naranja. Texto blanco. Bordes redondeados (aprox. 10px–12px). | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-100 | Separador “O continúa con”: Texto pequeño en gris claro, centrado. Líneas horizontales finas a ambos lados en tono gris oscuro. | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-101 | Botón “Google”: Altura aproximada 48px. Fondo negro muy oscuro. Borde fino gris. Border-radius cercano a 10px. Texto blanco. Icono oficial de Google alineado a la izquierda. | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-102 | Enlace superior “Volver al inicio”: Ubicado en la parte superior izquierda. Tamaño pequeño. Color rojo. | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-103 | Botón modo oscuro (icono luna): Ubicado en la parte superior derecha. Forma cuadrada pequeña con bordes redondeados. Fondo oscuro. Icono en tono rojizo. | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-104 | Fondo general: Área principal en beige claro uniforme. Barra lateral izquierda en gris claro sólido. Cobertura completa del alto visible. | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-105 | Barra lateral: Fondo gris claro. Separación visual mediante contraste con el fondo principal. Tipografía en color oscuro. | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-106 | Ítem activo “Resumen”: Fondo naranja sólido (similar a #f97316). Texto blanco (#ffffff). Bordes ligeramente redondeados. | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-107 | Ítems inactivos (“Mesas”, “Reservas”, “Correos”, “Configuración”): Fondo gris claro o transparente. Texto oscuro. Sin resaltado. | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-108 | Título “Buenas tardes”: Tamaño grande (aprox. 32px–40px). Color gris muy oscuro o negro suave. Alineación izquierda. | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-109 | Texto descriptivo: Tamaño menor (14px–16px). Color gris medio para jerarquía visual. | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-110 | Tarjeta informativa superior: Fondo gris claro. Border-radius 12px–16px. Texto principal en color oscuro. | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-111 | Etiqueta “Hora actual”: Fondo naranja sólido. Texto blanco. Forma tipo píldora. Tamaño reducido (12px–13px). | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-112 | Tarjetas de métricas: Fondo gris claro uniforme. Bordes redondeados consistentes (12px–16px). Sombra suave y discreta. | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-113 | Valores numéricos (0 / $0): Tamaño destacado (20px–24px). Color oscuro de alto contraste. | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-114 | Textos secundarios (“de 0 totales”, “actualmente”, “para hoy”, “hasta ahora”): Tamaño pequeño (12px–14px). Color gris medio. | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-115 | Tarjeta “Mi balance”: Fondo gris claro consistente con las demás tarjetas. Monto “$0” en tamaño destacado y color oscuro. Texto “total facturado” en gris medio y tamaño reducido. | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-116 | Sección “Próximas reservas”: Contenedor ancho en gris claro. Bordes redondeados uniformes. | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-117 | Título en color oscuro. Texto descriptivo en gris medio. Mensaje “No hay reservas próximas.” en color gris estándar sin resaltado adicional. | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-118 | Bloque de usuario inferior: Integrado en la barra lateral con fondo gris claro. Nombre en color oscuro. Correo en gris medio. | Hecho | Excel (REQ. no funcionales Frontend) |
| NFF-119 | Opción “Cerrar sesión”: Texto oscuro sin fondo. Cambio leve de tono en estado hover. | Hecho | Excel (REQ. no funcionales Frontend) |
