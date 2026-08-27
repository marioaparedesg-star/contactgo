'use client'

import { useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import { Upload, Camera, Loader2, ShoppingBag, RotateCcw, AlertCircle } from 'lucide-react'

// Los 12 tonos reales de AIR OPTIX® COLORS, con un color representativo
// para la superposición. No son el pigmento exacto del lente físico (eso
// varía según el color natural del ojo de cada persona) — es una vista
// previa estilizada para dar una idea real del efecto, no una promesa
// exacta de resultado clínico.
const COLORES = [
  { nombre: 'Brilliant Blue', hex: '#2E7BC4' },
  { nombre: 'Blue', hex: '#4A90D9' },
  { nombre: 'True Sapphire', hex: '#1B4B8A' },
  { nombre: 'Turquoise', hex: '#2AAFA0' },
  { nombre: 'Gray', hex: '#8B9199' },
  { nombre: 'Sterling Gray', hex: '#A8ADB5' },
  { nombre: 'Amethyst', hex: '#8B6BAE' },
  { nombre: 'Gemstone Green', hex: '#2F8F6F' },
  { nombre: 'Green', hex: '#4A9B5E' },
  { nombre: 'Pure Hazel', hex: '#A67C52' },
  { nombre: 'Honey', hex: '#C4915C' },
  { nombre: 'Brown', hex: '#6B4A32' },
] as const

// Índices de landmarks del iris en el modelo FaceMesh de MediaPipe
// (con refine_landmarks activado): 468-472 ojo izquierdo, 473-477 ojo
// derecho. El primer índice de cada grupo es el centro, los otros 4
// son el contorno — se usan para calcular el radio real del iris.
const IRIS_IZQ = [468, 469, 470, 471, 472]
const IRIS_DER = [473, 474, 475, 476, 477]

type Estado = 'inicial' | 'cargando_modelo' | 'procesando' | 'listo' | 'sin_rostro' | 'error'

export default function ProbadorClient() {
  const [estado, setEstado] = useState<Estado>('inicial')
  const [colorActivo, setColorActivo] = useState<typeof COLORES[number]>(COLORES[0])
  const [mostrarOriginal, setMostrarOriginal] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imagenRef = useRef<HTMLImageElement | null>(null)
  const irisRef = useRef<{ x: number; y: number; r: number }[] | null>(null)
  const landmarkerRef = useRef<any>(null)

  const cargarModelo = useCallback(async () => {
    if (landmarkerRef.current) return landmarkerRef.current

    // No se usa import() con la URL directa porque Webpack intenta
    // resolverla como módulo local en tiempo de build y falla ("Unhandled
    // scheme"). En su lugar se inyecta un <script type="module"> real en
    // el navegador — así el import ocurre en tiempo de ejecución, en el
    // cliente, nunca durante la compilación del sitio.
    await new Promise<void>((resolve, reject) => {
      if ((window as any).__mpVisionLoaded) return resolve()
      const script = document.createElement('script')
      script.type = 'module'
      script.textContent = `
        import { FaceLandmarker, FilesetResolver } from 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/vision_bundle.mjs';
        window.__mpFaceLandmarker = FaceLandmarker;
        window.__mpFilesetResolver = FilesetResolver;
        window.__mpVisionLoaded = true;
        window.dispatchEvent(new Event('mp-vision-loaded'));
      `
      window.addEventListener('mp-vision-loaded', () => resolve(), { once: true })
      script.onerror = () => reject(new Error('No se pudo cargar el motor de detección'))
      document.head.appendChild(script)
      setTimeout(() => reject(new Error('Tiempo de espera agotado cargando el motor')), 15000)
    })

    const FaceLandmarker = (window as any).__mpFaceLandmarker
    const FilesetResolver = (window as any).__mpFilesetResolver

    const vision = await FilesetResolver.forVisionTasks(
      'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm'
    )
    const landmarker = await FaceLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
        delegate: 'GPU',
      },
      outputFaceBlendshapes: false,
      runningMode: 'IMAGE',
      numFaces: 1,
    })
    landmarkerRef.current = landmarker
    return landmarker
  }, [])

  const dibujarConColor = useCallback((color: typeof COLORES[number]) => {
    const canvas = canvasRef.current
    const img = imagenRef.current
    const iris = irisRef.current
    if (!canvas || !img || !iris) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

    for (const { x, y, r } of iris) {
      ctx.save()
      ctx.globalCompositeOperation = 'multiply'
      ctx.globalAlpha = 0.75
      const grad = ctx.createRadialGradient(x, y, 0, x, y, r)
      grad.addColorStop(0, color.hex)
      grad.addColorStop(0.75, color.hex)
      grad.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()

      // Un pequeño brillo blanco para que no se vea plano ni artificial
      ctx.save()
      ctx.globalCompositeOperation = 'screen'
      ctx.globalAlpha = 0.35
      ctx.fillStyle = '#FFFFFF'
      ctx.beginPath()
      ctx.arc(x - r * 0.3, y - r * 0.3, r * 0.18, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    }
  }, [])

  const procesarImagen = useCallback(async (file: File) => {
    setEstado('cargando_modelo')
    try {
      const landmarker = await cargarModelo()
      setEstado('procesando')

      const img = new Image()
      const url = URL.createObjectURL(file)
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve()
        img.onerror = () => reject(new Error('No se pudo leer la imagen'))
        img.src = url
      })
      imagenRef.current = img

      const canvas = canvasRef.current
      if (!canvas) return
      // Limitar el tamaño para que el proceso sea rápido en celulares
      const maxLado = 900
      const escala = Math.min(1, maxLado / Math.max(img.width, img.height))
      canvas.width = img.width * escala
      canvas.height = img.height * escala

      const resultado = landmarker.detect(img)
      URL.revokeObjectURL(url)

      if (!resultado.faceLandmarks || resultado.faceLandmarks.length === 0) {
        setEstado('sin_rostro')
        return
      }

      const puntos = resultado.faceLandmarks[0]
      const calcularIris = (indices: number[]) => {
        const centro = puntos[indices[0]]
        const cx = centro.x * canvas.width
        const cy = centro.y * canvas.height
        let radioMax = 0
        for (let i = 1; i < indices.length; i++) {
          const p = puntos[indices[i]]
          const dx = (p.x * canvas.width) - cx
          const dy = (p.y * canvas.height) - cy
          radioMax = Math.max(radioMax, Math.sqrt(dx * dx + dy * dy))
        }
        return { x: cx, y: cy, r: radioMax * 1.05 }
      }

      irisRef.current = [calcularIris(IRIS_IZQ), calcularIris(IRIS_DER)]
      dibujarConColor(colorActivo)
      setEstado('listo')
    } catch (err) {
      console.error('[probador-virtual]', err)
      setEstado('error')
    }
  }, [cargarModelo, dibujarConColor, colorActivo])

  const handleArchivo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) procesarImagen(file)
  }

  const elegirColor = (color: typeof COLORES[number]) => {
    setColorActivo(color)
    setMostrarOriginal(false)
    if (estado === 'listo') dibujarConColor(color)
  }

  const reiniciar = () => {
    setEstado('inicial')
    irisRef.current = null
    imagenRef.current = null
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <span className="inline-block bg-teal-50 text-teal-700 text-xs font-bold px-3 py-1 rounded-full mb-3">
            ✨ Nuevo — Gratis
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900">Probador Virtual de Colores</h1>
          <p className="text-gray-500 mt-2 text-sm md:text-base">
            Sube tu foto y descubre al instante cómo te ven los 12 tonos de AIR OPTIX® Colors.
          </p>
        </div>

        {/* Zona de carga / resultado */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-4 md:p-6">
          {estado === 'inicial' && (
            <div className="border-2 border-dashed border-gray-200 rounded-2xl py-16 px-6 text-center">
              <Camera className="w-10 h-10 text-primary-600 mx-auto mb-4" />
              <p className="font-bold text-gray-900 mb-1">Sube una foto de tu rostro</p>
              <p className="text-sm text-gray-400 mb-6">De frente, con buena luz, mirando a la cámara</p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="btn-primary px-6 py-3 inline-flex items-center gap-2"
              >
                <Upload className="w-4 h-4" /> Elegir foto
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" capture="user" onChange={handleArchivo} className="hidden" />
              <p className="text-[11px] text-gray-300 mt-4">Tu foto se procesa en tu propio navegador — nunca se sube a ningún servidor.</p>
            </div>
          )}

          {(estado === 'cargando_modelo' || estado === 'procesando') && (
            <div className="py-20 text-center">
              <Loader2 className="w-8 h-8 text-primary-600 animate-spin mx-auto mb-4" />
              <p className="text-sm text-gray-500">{estado === 'cargando_modelo' ? 'Preparando el probador…' : 'Detectando tus ojos…'}</p>
            </div>
          )}

          {estado === 'sin_rostro' && (
            <div className="py-16 text-center px-6">
              <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-4" />
              <p className="font-bold text-gray-900 mb-1">No pudimos detectar un rostro claro</p>
              <p className="text-sm text-gray-400 mb-6">Intenta con una foto de frente, bien iluminada, sin lentes de sol</p>
              <button onClick={reiniciar} className="btn-primary px-6 py-3 inline-flex items-center gap-2">
                <RotateCcw className="w-4 h-4" /> Intentar de nuevo
              </button>
            </div>
          )}

          {estado === 'error' && (
            <div className="py-16 text-center px-6">
              <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-4" />
              <p className="font-bold text-gray-900 mb-1">Algo no salió bien</p>
              <p className="text-sm text-gray-400 mb-6">Intenta con otra foto, o revisa tu conexión a internet</p>
              <button onClick={reiniciar} className="btn-primary px-6 py-3 inline-flex items-center gap-2">
                <RotateCcw className="w-4 h-4" /> Intentar de nuevo
              </button>
            </div>
          )}

          {estado === 'listo' && (
            <div>
              <div className="relative rounded-2xl overflow-hidden bg-gray-100">
                <canvas
                  ref={canvasRef}
                  className="w-full h-auto block"
                  style={{ display: mostrarOriginal ? 'none' : 'block' }}
                />
                {mostrarOriginal && imagenRef.current && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={imagenRef.current.src} alt="Foto original" className="w-full h-auto block" />
                )}
                <button
                  onMouseDown={() => setMostrarOriginal(true)}
                  onMouseUp={() => setMostrarOriginal(false)}
                  onMouseLeave={() => setMostrarOriginal(false)}
                  onTouchStart={() => setMostrarOriginal(true)}
                  onTouchEnd={() => setMostrarOriginal(false)}
                  className="absolute bottom-3 right-3 bg-black/60 text-white text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm select-none"
                >
                  Mantén para ver original
                </button>
              </div>

              <p className="text-center font-bold text-gray-900 mt-4">{colorActivo.nombre}</p>

              {/* Selector de los 12 tonos reales */}
              <div className="flex flex-wrap justify-center gap-3 mt-4">
                {COLORES.map(c => (
                  <button
                    key={c.nombre}
                    onClick={() => elegirColor(c)}
                    aria-label={c.nombre}
                    className={`w-10 h-10 rounded-full border-2 transition-transform ${colorActivo.nombre === c.nombre ? 'border-primary-600 scale-110' : 'border-white'} shadow-sm`}
                    style={{ backgroundColor: c.hex, outline: colorActivo.nombre === c.nombre ? '2px solid #01B2B7' : 'none', outlineOffset: '2px' }}
                  />
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <Link
                  href="/producto/air-optix-colors-lentes-contacto-color-dominicana"
                  className="btn-primary flex-1 py-3 flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" /> Comprar AIR OPTIX Colors
                </Link>
                <button
                  onClick={reiniciar}
                  className="flex-1 py-3 rounded-xl border border-gray-200 font-semibold text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" /> Probar otra foto
                </button>
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-[11px] text-gray-400 mt-6 max-w-lg mx-auto">
          Vista previa referencial — el resultado real varía según el color natural de tus ojos. AIR OPTIX® Colors requiere
          evaluación con tu graduación; algunos colores están disponibles sin graduación (plano).
        </p>
      </div>

      <Footer />
    </div>
  )
}
