# Consultas Médicas a Domicilio — Dr. Andrés Felipe Dueñas Niño

Sitio web de consultas médicas generales a domicilio en Bogotá.

## Activar el sitio (GitHub Pages, gratis)

1. En este repositorio: **Settings → Pages**.
2. En "Build and deployment" → Source: **Deploy from a branch**.
3. Branch: **main**, carpeta **/(root)** → Save.
4. En 1-2 minutos el sitio queda publicado en `https://danyalexvg.github.io/consultas-medicas-domicilio/`.

## Conectar el formulario a la base de datos (Supabase, gratis)

1. Crea una cuenta en [supabase.com](https://supabase.com) → **New Project**.
2. Ve a **SQL Editor** → pega y ejecuta el contenido de `schema.sql` (crea la tabla `solicitudes` con permisos correctos).
3. Ve a **Project Settings → API** y copia:
   - **Project URL**
   - **anon public key**
4. Abre `index.html`, busca cerca del final el bloque:
   ```js
   const SUPABASE_URL = "TU_SUPABASE_URL_AQUI";
   const SUPABASE_ANON_KEY = "TU_SUPABASE_ANON_KEY_AQUI";
   ```
   y reemplaza esos dos valores por los tuyos.
5. Guarda, haz commit y push. El formulario de la sección "Agendar en línea" quedará escribiendo directo en tu base de datos.

## Notificación automática por correo (Supabase Edge Function + Resend, gratis)

Cada vez que se guarda una solicitud nueva, esto te manda un correo automático con los datos.

1. Crea una cuenta gratis en [resend.com](https://resend.com) → **API Keys → Create API Key** → copia la key (empieza con `re_...`).
   - Sin verificar un dominio propio, Resend solo te deja enviar al correo con el que te registraste — es justo lo que necesitas para recibir tus propias notificaciones.
2. En tu proyecto de Supabase: **Edge Functions → Deploy a new function**.
   - Nombre: `notificar-solicitud`
   - Pega el contenido de `supabase/functions/notificar-solicitud/index.ts` (de este repo) en el editor → Deploy.
3. En **Edge Functions → Manage secrets** (o dentro de la función, pestaña Secrets), agrega:
   - `RESEND_API_KEY` = la key que copiaste de Resend
   - `NOTIFY_EMAIL` = el correo donde quieres recibir las notificaciones (ej. el tuyo)
4. Ve a **Database → Webhooks → Create a new hook**.
   - Table: `solicitudes`
   - Events: **Insert**
   - Type: **Supabase Edge Functions**
   - Función: `notificar-solicitud` → Save.
5. Listo. Prueba llenando el formulario del sitio — en segundos debería llegarte el correo.

## Ver las solicitudes de pacientes (tu CRM)

Entra a tu proyecto en Supabase → **Table Editor → solicitudes**. Ahí ves cada solicitud (nombre, teléfono, dirección, motivo, fecha, franja horaria) y puedes cambiar el campo `estado` a `pendiente` / `confirmada` / `atendida` / `cancelada` a mano, como un mini-CRM.

## Editar contenido del sitio

Todo el contenido (textos, teléfono, horarios, colores) está en `index.html`. Los datos marcados entre corchetes `[ ]` son placeholders pendientes de completar (registro médico, foto del doctor, testimonios reales).
