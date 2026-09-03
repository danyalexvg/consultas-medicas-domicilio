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

## Ver las solicitudes de pacientes (tu CRM)

Entra a tu proyecto en Supabase → **Table Editor → solicitudes**. Ahí ves cada solicitud (nombre, teléfono, dirección, motivo, fecha, franja horaria) y puedes cambiar el campo `estado` a `pendiente` / `confirmada` / `atendida` / `cancelada` a mano, como un mini-CRM.

## Editar contenido del sitio

Todo el contenido (textos, teléfono, horarios, colores) está en `index.html`. Los datos marcados entre corchetes `[ ]` son placeholders pendientes de completar (registro médico, foto del doctor, testimonios reales).
