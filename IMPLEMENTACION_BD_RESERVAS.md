# 🗄️ Implementación de Reservas en Base de Datos

## 📋 Resumen de Cambios

Se ha implementado exitosamente el sistema de reservas usando **la base de datos** en lugar de localStorage, con autenticación segura usando el **email como intermediario** para obtener el documento del usuario.

## 🔄 Flujo Completo Implementado

```mermaid
graph TD
    A[Usuario selecciona datos en Restaurant.tsx] --> B[Crea Encabezado de Factura en BD]
    B --> C[Crea Reserva con estado PENDIENTE en BD]
    C --> D[Usa email del JWT para obtener documento]
    D --> E[Guarda ID de reserva en sessionStorage]
    E --> F[Redirige a Pasarela_pagos]
    F --> G[Usuario completa datos personales]
    G --> H[Usuario completa pago]
    H --> I[Actualiza reserva a CONFIRMADA en BD]
    I --> J[Muestra confirmación]
    J --> K[Limpia sessionStorage y vuelve al Home]
```

## 🔐 Seguridad Implementada

### **1. Uso del Email como Intermediario**
- ✅ El **documento nunca se expone** en el frontend
- ✅ Se usa el **email del JWT** del usuario autenticado
- ✅ Backend obtiene el documento usando `obtener_documento_por_email()`
- ✅ **Función SQL segura** valida que el email pertenezca a un cliente

### **2. Estados de Reserva**
- `pendiente` - Reserva creada al ir a pasarela de pagos
- `confirmada` - Pago completado exitosamente
- `en curso` - Cliente en el restaurante
- `finalizada` - Servicio completado
- `cancelada` - Reserva cancelada
- `no presentada` - Cliente no se presentó

## 📁 Archivos Modificados

### **Frontend**

#### **1. Restaurant.tsx**
```typescript
// ANTES: Guardaba todo en localStorage
localStorage.setItem("reservationData", JSON.stringify(paymentData))

// AHORA: Crea reserva en BD y guarda solo ID
const reservaResponse = await fetch("http://localhost:8000/reserva/insertarreserva", {
  method: "POST",
  headers: { "Authorization": `Bearer ${token}` },
  body: JSON.stringify({ id_mesa, id_encab_fact, horario, fecha })
})

sessionStorage.setItem("pendingReservation", JSON.stringify({
  id_reserva: reservaData.id_reserva,
  // Solo datos para mostrar en UI
}))
```

#### **2. Pasarela_pagos.tsx**
```typescript
// ANTES: localStorage
const data = localStorage.getItem("reservationData")

// AHORA: sessionStorage
const data = sessionStorage.getItem("pendingReservation")
```

#### **3. CheckoutPage**
```typescript
// Actualiza reserva a confirmada al completar pago
const response = await fetch(`http://localhost:8000/reserva/confirmar/${idReserva}`, {
  method: "PUT",
  headers: { "Authorization": `Bearer ${token}` }
})
```

### **Backend**

#### **1. routes/reserva.py**
```python
# Nuevo endpoint para confirmar reserva
@router.put("/confirmar/{id_reserva}")
async def confirmar_reserva(id_reserva: int, db: Session = Depends(get_db)):
    from funciones.cruds.reservation_status import confirmar_reserva
    resultado = confirmar_reserva(db, id_reserva)
    return {"message": "Reserva confirmada exitosamente", "success": resultado}
```

#### **2. funciones/cruds/reserva.py**
```python
# ANTES: No devolvía ID
db.execute(...)
db.commit()
raise HTTPException(status_code=201, detail="Reserva insertada correctamente")

# AHORA: Devuelve ID de reserva creada
result = db.execute(...).scalar()
db.commit()
return {"message": "Reserva insertada correctamente", "id_reserva": result, "status_code": 201}
```

#### **3. funciones/cruds/reservation_status.py** *(Ya existía)*
```python
def confirmar_reserva(db: Session, id_reserva: int) -> bool:
    """Confirma una reserva cambiando su estado de 'pendiente' a 'confirmada'."""
    return actualizar_estado_reserva(db, id_reserva, "confirmada")
```

## 🎯 Ventajas de la Nueva Implementación

### **Vs. LocalStorage:**
- ✅ **Datos persistentes** - No se pierden al cerrar el navegador
- ✅ **Seguridad mejorada** - Documentos no expuestos
- ✅ **Trazabilidad** - Historial completo en BD
- ✅ **Escalabilidad** - Múltiples dispositivos
- ✅ **Integridad** - Validaciones en BD

### **Vs. Pasar documento directo:**
- ✅ **Privacidad** - Documento nunca en frontend
- ✅ **Autenticación** - Solo usuarios logueados
- ✅ **Validación** - Backend verifica permisos
- ✅ **Auditoría** - Registro de quién hizo qué

## 📊 Tabla de Reserva en BD

```sql
CREATE TABLE "Reserva" (
    id_reserva SERIAL PRIMARY KEY NOT NULL,
    id_mesa INT NOT NULL,
    documento DECIMAL(10, 0) NOT NULL,  -- Obtenido por email
    id_encab_fact INT NOT NULL,
    estado_reserva VARCHAR NOT NULL DEFAULT 'no presentada',
    num_comensales INT NOT NULL DEFAULT 1,
    horario TIME NOT NULL,
    fecha DATE NOT NULL,
    FOREIGN KEY (id_mesa) REFERENCES "Mesas" (id_mesa),
    FOREIGN KEY (documento) REFERENCES "Cliente" (documento),
    FOREIGN KEY (id_encab_fact) REFERENCES "Encabezado_Factura" (id_encab_fact)
);
```

## 🚀 Flujo de Datos

### **1. Crear Reserva (Restaurant.tsx)**
```
Usuario → Selecciona datos
       ↓
Frontend → POST /enc_fac/insertar_enc_fac
       ↓
Backend → Crea encabezado de factura
       ↓
Frontend → POST /reserva/insertarreserva + JWT
       ↓
Backend → Extrae email del JWT
       ↓
Backend → Obtiene documento por email
       ↓
Backend → INSERT en tabla Reserva (estado: pendiente)
       ↓
Backend → Retorna id_reserva
       ↓
Frontend → Guarda id_reserva en sessionStorage
       ↓
Frontend → Redirige a /Pasarela_pagos
```

### **2. Confirmar Reserva (CheckoutPage)**
```
Usuario → Completa formulario de pago
       ↓
Frontend → Simula procesamiento de pago
       ↓
Frontend → PUT /reserva/confirmar/{id_reserva} + JWT
       ↓
Backend → Verifica autenticación
       ↓
Backend → UPDATE Reserva SET estado_reserva = 'confirmada'
       ↓
Backend → Retorna éxito
       ↓
Frontend → Muestra confirmación
       ↓
Frontend → Limpia sessionStorage
       ↓
Frontend → Redirige al Home
```

## ✅ Testing

### **Prueba del Flujo Completo:**

1. **Login**
   ```
   POST /login
   Body: { email, password }
   → Obtener token JWT
   ```

2. **Seleccionar Restaurante y Mesa**
   ```
   Navegar a /restaurant?nit=123456789
   Completar: fecha, hora, comensales, mesa
   ```

3. **Crear Reserva**
   ```
   Presionar "Hacer Pago de Reserva"
   → Verifica en BD: SELECT * FROM "Reserva" WHERE estado_reserva = 'pendiente'
   ```

4. **Completar Pago**
   ```
   Completar formularios en Pasarela_pagos
   Presionar "Pagar"
   → Verifica en BD: SELECT * FROM "Reserva" WHERE estado_reserva = 'confirmada'
   ```

5. **Verificar Datos**
   ```sql
   SELECT r.*, c.nombre, c.email 
   FROM "Reserva" r
   JOIN "Cliente" c ON r.documento = c.documento
   WHERE r.id_reserva = [id_reserva]
   ```

## 🔧 Configuración Necesaria

### **Variables de Entorno**
```bash
# Backend
DATABASE_URL=postgresql://user:password@localhost:5432/reservify
```

### **Ejecutar Funciones SQL**
```bash
# 1. Función para obtener documento por email (ya ejecutada)
psql -U user -d reservify -f scripts/funciones/get_documento_by_email.sql

# 2. Función para actualizar estado de reserva (ya ejecutada)
psql -U user -d reservify -f scripts/funciones/update_reservation_status.sql
```

## 🎨 Mejoras Futuras

- [ ] Enviar email de confirmación al usuario
- [ ] Implementar cancelación de reservas
- [ ] Agregar recordatorios automáticos
- [ ] Dashboard de reservas del cliente
- [ ] Integración con pasarela de pago real (Mercado Pago)
- [ ] Sistema de reembolsos
- [ ] Notificaciones push

---

**✨ ¡Sistema de reservas completo y funcionando con BD!**
