// /api/azul/iniciar — DESACTIVADO
// Esta ruta es código legacy no utilizado. Toda la lógica de pago
// va por /api/azul/preparar (con validación de monto desde Supabase).
// Se mantiene el archivo para no generar 404 si hay alguna referencia vieja.
import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json(
    { error: 'Este endpoint está desactivado. Usa /api/azul/preparar' },
    { status: 410 } // 410 Gone
  )
}
