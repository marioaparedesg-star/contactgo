import { redirect } from 'next/navigation'
export default function CalculadoraRedirect() { redirect('/receta') }
export const metadata = {
  title: 'Calculadora de Lentes de Contacto | ContactGo',
  description: 'Convierte tu receta de gafas a lentes de contacto. Gratis, instantáneo, con IA.',
}
