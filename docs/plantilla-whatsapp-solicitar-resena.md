# Plantilla de WhatsApp: solicitar_resena_v2
Crear en: business.facebook.com → WhatsApp Manager → Plantillas de mensajes → Crear plantilla

──────────────────────────────────────────
Nombre de la plantilla:  solicitar_resena_v2
Categoría:                MARKETING
Idioma:                    Español (España) o Español (México) — el que
                            tengas habilitado; ambos funcionan para RD.
──────────────────────────────────────────

CUERPO DEL MENSAJE (Body):
────────────────────────────────────────────────────────
¡Hola {{1}}! 👋 Gracias por comprar en ContactGo.

¿Cómo fue tu experiencia con tus lentes de contacto? Tu opinión
ayuda a que más personas encuentren los lentes correctos. Solo
toma 1 minuto dejar una reseña ⭐
────────────────────────────────────────────────────────
Variable {{1}} = nombre del cliente (ej: "Mario")

Texto de ejemplo para la variable (Meta lo pide al crear la plantilla):
  {{1}} → Mario

BOTÓN (Call to Action):
  Tipo:   Visitar sitio web (Website URL)
  Texto del botón:  ⭐ Dejar reseña
  Tipo de URL:       Estática (Static)
  URL:               https://g.page/r/Cb-RwE6S9vzgEAE/review

──────────────────────────────────────────
Notas:
- Meta normalmente aprueba plantillas de categoría MARKETING en
  minutos a 24 horas.
- Si Meta la rechaza, generalmente es por lenguaje promocional
  agresivo — este texto ya está redactado en tono neutral/informativo
  para minimizar ese riesgo.
- Una vez aprobada, avísame y conecto automáticamente esta plantilla
  al flujo de "pedido entregado hace 3 días" (ya existe la función
  sendReviewRequest() en el código, solo hay que activarla).
──────────────────────────────────────────
