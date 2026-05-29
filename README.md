# VACON Web

Primera base estática para la web real de VACON: catálogo, carrito y flujo de pago/consulta.

## Editar datos

- Productos: modificar el array `products` en `app.js`.
- WhatsApp: hoy esta configurado como `+54 9 11 4061-5610`.
- Pago online: cargar un link en `business.paymentLink` o conectar un backend de Mercado Pago.
- Logo: reemplazar `VACON LOGO.png` manteniendo el mismo nombre, o actualizar la ruta en `index.html`.

## Abrir

Opción directa: abrí `index.html` en el navegador.

Opción con servidor local:

```powershell
node dev-server.js
```

Después entrá a `http://127.0.0.1:4173`.

## Próximo paso recomendado

Para pagos reales con Mercado Pago conviene agregar un backend que cree preferencias de pago desde el servidor. Eso evita exponer credenciales y permite registrar pedidos con estado de pago.
