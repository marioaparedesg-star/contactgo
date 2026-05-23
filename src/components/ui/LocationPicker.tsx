'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { MapPin, Locate, Search, Check, Loader2 } from 'lucide-react'

export interface LocationData {
  lat: number
  lng: number
  direccion_completa: string
}

interface Props {
  initialLat?: number | null
  initialLng?: number | null
  initialAddress?: string | null
  onSave: (data: LocationData) => void
  onCancel?: () => void
}

declare global {
  interface Window { google: any; _gmapsLoaded?: boolean }
}

const SD = { lat: 18.4861, lng: -69.9312 }

function loadGoogleMaps(apiKey: string): Promise<void> {
  if (window._gmapsLoaded && window.google?.maps) return Promise.resolve()
  if (window._gmapsLoaded) {
    // Script tag exists but not loaded yet — wait
    return new Promise(resolve => {
      const check = setInterval(() => {
        if (window.google?.maps) { clearInterval(check); resolve() }
      }, 100)
    })
  }
  window._gmapsLoaded = true
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&language=es&region=DO`
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Google Maps failed to load'))
    document.head.appendChild(script)
  })
}

export default function LocationPicker({ initialLat, initialLng, initialAddress, onSave, onCancel }: Props) {
  const mapRef    = useRef<HTMLDivElement>(null)
  const mapObj    = useRef<any>(null)
  const marker    = useRef<any>(null)
  const geocoder  = useRef<any>(null)

  const [loading,  setLoading]  = useState(true)
  const [locating, setLocating] = useState(false)
  const [address,  setAddress]  = useState(initialAddress ?? '')
  const [search,   setSearch]   = useState('')
  const [coords,   setCoords]   = useState({
    lat: initialLat  ?? SD.lat,
    lng: initialLng ?? SD.lng,
  })
  const [saved, setSaved] = useState(false)

  const reverseGeocode = useCallback((lat: number, lng: number) => {
    if (!geocoder.current) return
    geocoder.current.geocode({ location: { lat, lng } }, (results: any[], status: string) => {
      if (status === 'OK' && results[0]) setAddress(results[0].formatted_address)
    })
  }, [])

  const moveMarker = useCallback((lat: number, lng: number) => {
    setCoords({ lat, lng })
    marker.current?.setPosition({ lat, lng })
    mapObj.current?.panTo({ lat, lng })
    reverseGeocode(lat, lng)
  }, [reverseGeocode])

  // Init map after script loads
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY
    if (!apiKey) { setLoading(false); return }

    loadGoogleMaps(apiKey).then(() => {
      if (!mapRef.current) return

      const center = initialLat && initialLng
        ? { lat: initialLat, lng: initialLng }
        : SD

      const map = new window.google.maps.Map(mapRef.current, {
        center,
        zoom: initialLat ? 16 : 13,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        zoomControlOptions: {
          position: window.google.maps.ControlPosition.RIGHT_CENTER,
        },
        styles: [
          { featureType: 'poi', stylers: [{ visibility: 'off' }] },
        ],
      })
      mapObj.current = map

      const pin = new window.google.maps.Marker({
        position: center,
        map,
        draggable: true,
        animation: window.google.maps.Animation.DROP,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 13,
          fillColor: '#16a34a',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 3,
        },
      })
      marker.current = pin

      geocoder.current = new window.google.maps.Geocoder()

      map.addListener('click', (e: any) => {
        moveMarker(e.latLng.lat(), e.latLng.lng())
      })
      pin.addListener('dragend', (e: any) => {
        moveMarker(e.latLng.lat(), e.latLng.lng())
      })

      if (initialLat && initialLng) reverseGeocode(initialLat, initialLng)

      setLoading(false)
    }).catch(() => setLoading(false))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getMyLocation = () => {
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      pos => {
        moveMarker(pos.coords.latitude, pos.coords.longitude)
        mapObj.current?.setZoom(17)
        setLocating(false)
      },
      () => {
        setLocating(false)
        alert('No se pudo obtener tu ubicación. Mueve el pin manualmente.')
      },
      { timeout: 10000, enableHighAccuracy: true }
    )
  }

  const searchAddress = () => {
    if (!search.trim() || !geocoder.current) return
    geocoder.current.geocode(
      { address: `${search}, República Dominicana` },
      (results: any[], status: string) => {
        if (status === 'OK' && results[0]) {
          const loc = results[0].geometry.location
          moveMarker(loc.lat(), loc.lng())
          mapObj.current?.setZoom(17)
          setSearch('')
        } else {
          alert('Dirección no encontrada. Sé más específico.')
        }
      }
    )
  }

  const handleSave = () => {
    onSave({ lat: coords.lat, lng: coords.lng, direccion_completa: address })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-center">
        <MapPin className="w-8 h-8 text-amber-500 mx-auto mb-2" />
        <p className="text-sm font-semibold text-amber-800">Mapa no disponible</p>
        <p className="text-xs text-amber-600 mt-1">
          Configura <code>NEXT_PUBLIC_GOOGLE_MAPS_KEY</code> en Vercel.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">

      {/* Buscar + GPS */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && searchAddress()}
            placeholder="Buscar calle, sector, lugar..."
            className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 bg-white"
          />
        </div>
        <button onClick={searchAddress}
          className="px-4 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors">
          Ir
        </button>
        <button onClick={getMyLocation} disabled={locating} title="Usar mi ubicación"
          className="px-3 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50 transition-colors">
          {locating
            ? <Loader2 className="w-4 h-4 animate-spin" />
            : <Locate className="w-4 h-4" />}
        </button>
      </div>

      {/* Mapa */}
      <div className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-gray-100"
        style={{ height: 300 }}>
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 z-10">
            <Loader2 className="w-7 h-7 text-primary-600 animate-spin" />
            <p className="text-xs text-gray-500">Cargando mapa...</p>
          </div>
        )}
        <div ref={mapRef} className="w-full h-full" style={{ opacity: loading ? 0 : 1 }} />
        {!loading && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/55 text-white text-xs px-3 py-1.5 rounded-full pointer-events-none whitespace-nowrap">
            Toca el mapa o arrastra el pin
          </div>
        )}
      </div>

      {/* Dirección detectada */}
      {address && !loading && (
        <div className="flex items-start gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
          <MapPin className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
          <p className="text-sm text-green-800 leading-snug">{address}</p>
        </div>
      )}

      {/* Coords */}
      {!loading && (
        <p className="text-[11px] text-gray-400 text-center font-mono">
          {coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}
        </p>
      )}

      {/* Botones */}
      <div className="flex gap-2">
        <button onClick={handleSave} disabled={loading}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all disabled:opacity-40 ${
            saved
              ? 'bg-green-600 text-white'
              : 'bg-primary-600 hover:bg-primary-700 text-white'
          }`}>
          {saved
            ? <><Check className="w-4 h-4" /> ¡Guardado!</>
            : <><MapPin className="w-4 h-4" /> Confirmar ubicación</>}
        </button>
        {onCancel && (
          <button onClick={onCancel}
            className="px-4 py-3 rounded-xl text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
            Cancelar
          </button>
        )}
      </div>

    </div>
  )
}
