### Requerimientos de frontend (UX) de Reservify

#### Experiencia de usuario y feedback

- **FR-01 – Errores de validación y de API visibles en toast**
  - **Estado:** Hecho  
  - Los errores que devuelve el backend (validación de contraseña, email duplicado, formato inválido, etc.) deben mostrarse al usuario en un toast (notificación emergente), no solo en consola.
  - Implementación:
    - En flujos críticos (registro, login, reservas, pago, etc.) el mensaje de error devuelto por la API (`detail` o equivalente) se muestra en el toast como descripción.
    - Si `detail` es string se usa tal cual; si es array (p. ej. errores de validación FastAPI) se concatenan los mensajes.
    - Evita que el usuario no sepa por qué falló una acción (p. ej. "La contraseña no cumple la política de seguridad...").
  - Referencia: `frontend/src/pages/registrar.tsx` (handleSubmit), `ToastContainer` / `ToastProvider`, y mismo criterio aplicable a Login, checkout, perfiles, etc.
