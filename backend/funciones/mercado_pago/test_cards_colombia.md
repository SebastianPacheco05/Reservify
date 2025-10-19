# Tarjetas de Prueba Mercado Pago - Colombia

## Tarjetas de Crédito

### Visa

- **Número**: `4013 5406 8274 6260`
- **Código de seguridad**: `123`
- **Fecha de vencimiento**: `11/30`
- **Titular**: Usar códigos especiales para simular estados

### Mastercard

- **Número**: `5254 1336 7440 3564`
- **Código de seguridad**: `123`
- **Fecha de vencimiento**: `11/30`
- **Titular**: Usar códigos especiales para simular estados

### American Express

- **Número**: `3743 781877 55283`
- **Código de seguridad**: `1234`
- **Fecha de vencimiento**: `11/30`
- **Titular**: Usar códigos especiales para simular estados

## Tarjetas de Débito

### Visa Débito

- **Número**: `4915 1120 5524 6507`
- **Código de seguridad**: `123`
- **Fecha de vencimiento**: `11/30`
- **Titular**: Usar códigos especiales para simular estados

## Códigos de Estado en el Nombre del Titular

Para simular diferentes estados de pago, usa estos códigos en el campo "Nombre del titular":

- **APRO**: Pago aprobado
- **OTHE**: Rechazado por error general
- **CONT**: Pendiente de pago
- **CALL**: Rechazado con validación para autorizar
- **FUND**: Rechazado por importe insuficiente
- **SECU**: Rechazado por código de seguridad inválido
- **EXPI**: Rechazado debido a un problema de fecha de vencimiento
- **FORM**: Rechazado debido a un error de formulario

## Email para Pruebas

- **Email del comprador**: `test_user_123456@testuser.com` (debe ser diferente al email de tu cuenta de Mercado Pago)

## Notas Importantes

1. Estas tarjetas solo funcionan en el entorno de sandbox de Mercado Pago
2. Asegúrate de usar las credenciales de prueba (ACCESS_TOKEN que contenga "TEST")
3. El site_id debe ser "MCO" para Colombia
4. El email del pagador debe ser diferente al de tu cuenta de Mercado Pago
5. Verifica que tu ACCESS_TOKEN sea de sandbox (debe contener "TEST" en el token)

## Solución de Problemas

Si sigues viendo el error "No es posible continuar el pago con esta tarjeta":

1. **Verifica las credenciales**: Asegúrate de que tu ACCESS_TOKEN sea de sandbox
2. **Email del pagador**: Usa un email completamente diferente al de tu cuenta de Mercado Pago
3. **Cuentas de prueba**: Crea cuentas de prueba en Mercado Pago Developers
4. **Logs**: Revisa los logs del servidor para ver errores específicos
