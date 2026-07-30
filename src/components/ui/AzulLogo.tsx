// ============================================================
// AzulLogo — logo oficial de AZUL Banco Popular
// Reemplaza los emojis 💳 / 🔒 en contextos donde se menciona AZUL
// Uso: <AzulLogo size="sm" /> · <AzulLogo size="md" className="mr-2" />
// ============================================================
import NextImage from 'next/image'

type AzulLogoProps = {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  showText?: boolean
  alt?: string
}

const SIZES = {
  xs: { w: 16, h: 16 },
  sm: { w: 20, h: 20 },
  md: { w: 28, h: 28 },
  lg: { w: 40, h: 40 },
  xl: { w: 56, h: 56 },
}

export default function AzulLogo({ size = 'sm', className = '', showText = false, alt = 'AZUL — Banco Popular' }: AzulLogoProps) {
  const { w, h } = SIZES[size]
  return (
    <span className={`inline-flex items-center gap-1.5 align-middle ${className}`}>
      <NextImage
        src="/brand/azul-logo.png"
        alt={alt}
        width={w}
        height={h}
        className="rounded-md object-contain shadow-sm"
        style={{ width: w, height: h }}
        priority={false}
      />
      {showText && <span className="font-semibold">AZUL</span>}
    </span>
  )
}
