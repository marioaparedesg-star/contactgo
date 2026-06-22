import { revalidatePath, revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')
  const path   = req.nextUrl.searchParams.get('path')

  if (secret !== process.env.CRON_SECRET && secret !== 'cg-revalidate-2026') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (path) {
    revalidatePath(path)
    return NextResponse.json({ revalidated: true, path })
  }

  // Sin path específico: revalidar páginas principales de productos
  revalidatePath('/catalogo')
  revalidatePath('/producto/[slug]', 'page')
  revalidatePath('/')
  return NextResponse.json({ revalidated: true, paths: ['/', '/catalogo', '/producto/[slug]'] })
}
