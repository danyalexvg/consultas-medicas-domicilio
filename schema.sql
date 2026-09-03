-- Pega esto completo en Supabase: tu proyecto -> SQL Editor -> New query -> Run

create table public.solicitudes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  nombre text not null,
  telefono text not null,
  direccion text not null,
  motivo text not null,
  fecha_preferida date not null,
  franja_horaria text not null,
  estado text not null default 'pendiente'
    check (estado in ('pendiente', 'confirmada', 'atendida', 'cancelada'))
);

-- Activa seguridad a nivel de fila: por defecto nadie puede leer ni escribir nada
alter table public.solicitudes enable row level security;

-- Permite que CUALQUIERA (paciente anónimo desde la web) pueda CREAR una solicitud...
create policy "Cualquiera puede crear una solicitud"
on public.solicitudes
for insert
to anon
with check (true);

-- ...pero nadie externo puede leer, editar ni borrar solicitudes de otros pacientes.
-- Tú sí puedes ver y gestionar todo desde el Table Editor de Supabase (entras con tu cuenta).
