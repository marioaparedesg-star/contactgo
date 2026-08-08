import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  return NextResponse.json({
    'cf-connecting-ip': req.headers.get('cf-connecting-ip'),
    'x-forwarded-for': req.headers.get('x-forwarded-for'),
    'x-real-ip': req.headers.get('x-real-ip'),
    'x-vercel-forwarded-for': req.headers.get('x-vercel-forwarded-for'),
    'true-client-ip': req.headers.get('true-client-ip'),
  })
}
