// Edge Function: notificar-solicitud
//
// Se dispara desde un Database Webhook de Supabase (Database -> Webhooks)
// cada vez que se inserta una fila nueva en la tabla "solicitudes".
// Envía un correo con los datos de la solicitud usando la API de Resend.
//
// Variables de entorno necesarias (Edge Functions -> Manage secrets):
//   RESEND_API_KEY  -> tu API key de resend.com
//   NOTIFY_EMAIL    -> el correo que debe recibir la notificación

Deno.serve(async (req: Request) => {
  try {
    const payload = await req.json();
    const record = payload.record ?? {};

    const nombre = record.nombre ?? "(sin nombre)";
    const telefono = record.telefono ?? "";
    const direccion = record.direccion ?? "";
    const motivo = record.motivo ?? "";
    const fecha = record.fecha_preferida ?? "";
    const franja = record.franja_horaria ?? "";

    const telefonoLimpio = telefono.replace(/\D/g, "");
    const linkWhatsApp = telefonoLimpio ? `https://wa.me/57${telefonoLimpio}` : "";

    const asunto = `Nueva solicitud de consulta: ${nombre}`;
    const cuerpoTexto =
      `Nombre: ${nombre}\n` +
      `Teléfono/WhatsApp: ${telefono}\n` +
      `Dirección/barrio: ${direccion}\n` +
      `Fecha preferida: ${fecha}\n` +
      `Franja horaria: ${franja}\n` +
      `Motivo: ${motivo}\n` +
      (linkWhatsApp ? `\nEscríbele por WhatsApp: ${linkWhatsApp}` : "");

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    const NOTIFY_EMAIL = Deno.env.get("NOTIFY_EMAIL");

    if (!RESEND_API_KEY || !NOTIFY_EMAIL) {
      return new Response(
        JSON.stringify({ error: "Faltan las variables RESEND_API_KEY o NOTIFY_EMAIL" }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Consultas Médicas <onboarding@resend.dev>",
        to: [NOTIFY_EMAIL],
        subject: asunto,
        text: cuerpoTexto,
      }),
    });

    if (!resendResponse.ok) {
      const detalle = await resendResponse.text();
      return new Response(
        JSON.stringify({ error: "Resend rechazó el envío", detalle }),
        { status: 502, headers: { "Content-Type": "application/json" } },
      );
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Error inesperado", detalle: String(err) }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
});
