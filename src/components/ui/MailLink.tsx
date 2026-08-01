'use client'
// ============================================================
// MailLink — link de email que evita el bug de hidratación causado
// por Cloudflare "Ofuscación de correo electrónico" (Scrape Shield).
//
// Cloudflare reescribe automáticamente cualquier <a href="mailto:...">
// estático en el HTML servido, y usa un script propio para "decodificar"
// el email en el navegador MUTANDO EL DOM directamente. Cuando ese
// script corre antes de que React termine de hidratar la página, React
// detecta que el DOM ya no coincide con lo que esperaba renderizar y
// lanza errores de hidratación (#418/#423/#425) — visibles en consola
// aunque la página funcione visualmente (React se recupera solo
// re-renderizando del lado del cliente).
//
// Fix: nunca poner el mailto: como atributo href estático en el HTML
// servido. Se construye en el navegador al hacer clic — mismo
// resultado para el usuario, cero interferencia de Cloudflare.
// ============================================================
export default function MailLink({
  email = 'info@contactgo.net',
  className,
  children,
}: {
  email?: string
  className?: string
  children?: React.ReactNode
}) {
  const [user, domain] = email.split('@')
  return (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault()
        window.location.href = `mailto:${user}@${domain}`
      }}
      className={className}
    >
      {children ?? email}
    </a>
  )
}
