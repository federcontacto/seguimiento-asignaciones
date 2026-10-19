# Entorno de pruebas (`siniestros-equipo-dev`)

Copia de producción (`siniestros-equipo`) con datos ficticios, para probar cambios
antes de que le lleguen al equipo.

| | Producción | Pruebas |
|---|---|---|
| Proyecto Firebase | `siniestros-equipo` | `siniestros-equipo-dev` |
| App | https://siniestros-equipo.web.app | https://siniestros-equipo-dev.web.app |
| Firestore | datos reales | datos ficticios |
| Drive | el de cada verificador | una cuenta de prueba |

## 1. Consola (una sola vez)

1. **Crear el proyecto**: Firebase console → Agregar proyecto → `siniestros-equipo-dev`
   (sin Google Analytics).
2. **Plan Blaze**: Uso y facturación → vincular la cuenta "Firebase Payment".
   Crear presupuesto con alerta en **USD 5** (Billing → Presupuestos y alertas).
3. **Firestore**: crear base `(default)` en **southamerica-east1** (misma región que producción).
4. **Authentication**: habilitar Email/contraseña. Crear un usuario supervisor de prueba.
5. **Hosting**: habilitarlo (queda `siniestros-equipo-dev.web.app`).
6. **App web**: Configuración del proyecto → Agregar app web → copiar el `firebaseConfig`
   (no es secreto, va en el frontend).

## 2. Deploy de las functions

```bash
firebase use --add            # elegir siniestros-equipo-dev, alias: dev
firebase use dev
firebase deploy --only functions
```

El primer deploy pide los secretos `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`:
cargar cualquier valor provisorio, se reemplazan en el paso 3.

Al terminar, copiar la URL de `driveAuthCallback` y pegarla en
`functions/.env.siniestros-equipo-dev` → `DRIVE_CALLBACK_URL=`.

## 3. OAuth de Drive

1. Google Cloud console (proyecto dev) → APIs y servicios → **Pantalla de consentimiento**:
   tipo Externo, estado **Prueba**, agregar como usuarios de prueba las cuentas que van a conectar Drive.
2. Habilitar **Google Drive API**.
3. Credenciales → Crear **ID de cliente OAuth** → Aplicación web.
   URI de redireccionamiento autorizado: la `DRIVE_CALLBACK_URL` del paso 2.
4. Cargar los secretos reales y redeployar:

```bash
firebase functions:secrets:set GOOGLE_CLIENT_ID
firebase functions:secrets:set GOOGLE_CLIENT_SECRET
firebase deploy --only functions
```

## 4. Frontend y datos

- `firebase deploy --only hosting,firestore:rules` con el alias `dev` activo.
- Cargar la configuración (`config/*`: tarifas, conclusiones, plantillas, links, resultados)
  y algunos casos ficticios. **Nunca copiar casos reales.**

## Uso diario

```bash
firebase use dev    && firebase deploy --only functions:procesarPDF   # probar
firebase use default && firebase deploy --only functions:procesarPDF  # producción
```

Chequear siempre con `firebase use` en qué proyecto estás antes de deployar.
