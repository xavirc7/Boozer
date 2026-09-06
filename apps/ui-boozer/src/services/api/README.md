# API del frontend

El frontend usa tres operaciones. Por defecto `apiServices` devuelve respuestas
simuladas de `api.mock.ts`, sin realizar peticiones al backend. Las pantallas ya
consumen esta misma interfaz. No hay persistencia: el estado vive en memoria.

- `payment.startPayment(...)`: activar lectura del datáfono y esperar estado final.
- `payment.cancelPayment(transactionId)`: desactivar lectura y esperar confirmación.
- `result.listenBreathalyzer(transactionId, playerIndex)`: esperar el valor final.

`client.ts` gestiona HTTP; `index.ts` selecciona simulación o API real. Las sesiones,
nombres y turnos siguen siendo responsabilidad del store, sin endpoint de sesión.

## Contrato esperado para la futura integración

Este documento describe lo que espera el frontend; **el backend actual no se ha
modificado y todavía no implementa este contrato completo**. Para activar las
peticiones reales una vez acordado e implementado, configura `VITE_API_MODE=real`
en `apps/ui-boozer/.env` y reinicia Vite (o reconstruye la imagen compilada).
Vite y Nginx reenvían `/api` al backend.

### Activar datáfono

`POST /api/payments/initiate`

```json
{ "transaction_id": "UUID-del-intento", "amount": 2, "player_count": 2 }
```

El importe corresponde al precio actual en EUR. El backend debe validar el precio.
La petición queda pendiente hasta devolver:

```json
{ "transaction_id": "UUID-del-intento", "status": "accepted" }
```

Estados finales: `accepted`, `rejected`, `cancelled`. Una cancelación por tiempo
debe incluir `"reason": "timeout"`; una cancelación solicitada por el usuario,
`"reason": "user_cancelled"`. El backend gestiona el límite
de 30 segundos esperando una tarjeta. El frontend no confirma cancelaciones por
su cuenta. Un fallo de red o un timeout HTTP deja el estado sin confirmar y permite
comprobar el mismo intento, sin generar otro cobro. El timeout HTTP es de 60 segundos.

El UUID identifica **el intento de activar el lector**, no una transacción bancaria.
Se genera antes de llamar al backend para poder cancelar mientras esa llamada
está pendiente. Repetir el mismo UUID debe esperar/devolver el mismo resultado,
no activar otro cobro. Peticiones con el mismo ID y parámetros distintos deben
rechazarse. Una cancelación adelantada debe impedir la activación posterior de ese ID.

### Cancelar lectura del datáfono

`POST /api/payments/{transaction_id}/cancel`

Respuesta con el mismo formato. `cancelled` confirma que se ha desactivado la
lectura. `processing` indica que ya se ha presentado una tarjeta y no se permite
cancelar. Si ya terminó, devuelve `accepted` o `rejected`. Esta operación no anula
ni reembolsa pagos. La decisión ante una carrera tarjeta/cancelación pertenece
siempre al backend/dispositivo.

La pantalla muestra «Cancelando pago…» y espera la respuesta antes de salir.
Si recibe `processing`, permanece esperando el resultado del pago y deshabilita
el botón Atrás. Se intercepta también la navegación interna y Atrás del navegador.
El reinicio por inactividad no borra una operación de pago sin resolver.
Cerrar o recargar el navegador no garantiza una petición de cancelación: se muestra
el aviso nativo mientras hay un pago pendiente y el backend conserva la autoridad.

### Escuchar alcoholímetro

`POST /api/hardware/alcoholimeter/start`

```json
{ "transaction_id": "UUID-del-intento", "player_index": 0 }
```

```json
{
  "test_id": "identificador-de-lectura",
  "transaction_id": "UUID-del-intento",
  "player_index": 0,
  "status": "completed",
  "bac_level": 1.5,
  "unit": "g/l"
}
```

La unidad esperada coincide con la interfaz actual: g/l; debe acordarse con el
backend antes de activar la integración. Se recibe y muestra el valor final, sin
consultas intermedias ni envío posterior de un resultado calculado en el frontend.
La animación de espera no representa progreso real ni segundos restantes.
En grupo, un pago cubre una lectura por jugador (índice desde 0). Repetir el mismo
par `(transaction_id, player_index)` debe devolver la misma lectura.

## Simulación y pruebas

El simulador representa una tarjeta presentada a los 5 segundos, respuesta de
pago 2 segundos después y lectura a los 3 segundos. Cada tercer intento nuevo
se rechaza (`rejectEvery: 3`). Cada cuarto intento simula que no se presenta tarjeta
y responde con cancelación por tiempo a los 30 segundos (`timeoutEvery: 4`).
Si coinciden ambos, prevalece el timeout. Repetir un ID no avanza el contador;
el contador se conserva durante la vida del simulador, aunque se reinicie la partida.
Configura cualquiera de estas frecuencias a 0 para desactivarla.
La cancelación tarda 300 ms en confirmarse. Los tiempos, rechazo y timeout se
pueden configurar en `createMockApiServices` para pruebas; no son lógica de control
del dispositivo real.

Desde `apps/ui-boozer`, `npm test` comprueba los servicios y `npm run build` compila
el frontend. Los adapters antiguos de `services/hardware` han sido sustituidos por
esta interfaz común, sin eventos de progreso ni consultas de sesión.
