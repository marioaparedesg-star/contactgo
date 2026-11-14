// /cuenta — Página de cuenta del cliente (Server Component: aquí solo metadata)
import type { Metadata } from 'next'
import CuentaLoader from './CuentaLoader'

export const metadata: Metadata = {
  title: 'Mi cuenta — ContactGo',
  description: 'Gestiona tus pedidos, recetas, direcciones y más.',
  robots: { index: false, follow: false },
}

export default function CuentaPage() {
  return <CuentaLoader />
}
