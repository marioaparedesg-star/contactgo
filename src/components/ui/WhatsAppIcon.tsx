// Logo oficial de WhatsApp (imagen real subida por el cliente) — reemplaza
// al genérico MessageCircle de lucide-react en todos los botones y textos
// que representan WhatsApp, admin y web pública.
// Nota: usa la imagen a color (círculo verde + teléfono blanco), no un trazo
// monocromático — así se distingue de un vistazo, sin depender de heredar
// el color de texto del botón donde se use.
export default function WhatsAppIcon({ className = 'w-4 h-4' }: { className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src="/icons/whatsapp.png" alt="WhatsApp" className={`${className} object-contain shrink-0`} />
}
