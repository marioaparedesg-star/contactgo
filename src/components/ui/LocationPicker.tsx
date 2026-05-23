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
  interface Window {
    google: any
    initMapCallback: () => void
  }
}

export default function LocationPicker({ initialLat, initialLng, initialAddress, onSave, onCancel }: Props) {
  const mapRef     = useRef<HTMLDivElement>(null)
  const mapObj     = useRef<any>(null)
  const markerRef  = useRef<any>(null)
  const geocoder   = useRef<any>(null)
  const [loading,  setLoading]  = useState(true)
  const [locating, setLocating] = useState(false)
  const [address,  setAddress]  = useState(initialAddress ?? '')
  const [search,   setSearch]   = useState('')
  const [coords,   setCoords]   = useState({ lat: initialLat ?? 18.4861, lng: initialLng ?? -69.9312 })
  const [saved,    setSaved]    = useState(false)

  const SD_CENTER = { lat: 18.4861, lng: -69.9312 }

  const reverseGeocode = useCallback((lat: number, lng: number) => {
    if (!geocoder.current) return
    geocoder.current.geocode({ location: { lat, lng } }, (results: any[], status: string) => {
      if (status === 'OK' && results[0]) {
        setAddress(results[0].formatted_address)
      }
    })
  }, [])

  const moveMarker = useCallback((lat: number, lng: number) => {
    const pos = { lat, lng }
    setCoords(pos)
    if (markerRef.current) {
      markerRef.current.setPosition(pos)
    }
    if (mapObj.current) {
      mapObj.current.panTo(pos)
    }
    reverseGeocode(lat, lng)
  }, [reverseGeocode])

  const initMap = useCallback(() => {
    if (!mapRef.current || !window.google) return
    const center = (initialLat && initialLng)
      ? { lat: initialLat, lng: initialLng }
      : SD_CENTER

    mapObj.current = new window.google.maps.Map(mapRef.current, {
      center,
      zoom: initialLat ? 16 : 13,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      zoomControlOptions: { position: window.google.maps.ControlPosition.RIGHT_CENTER },
      styles: [
        { featureType: 'poi', stylers: [{ visibility: 'off' }] },
        { featureType: 'transit', stylers: [{ visibility: 'simplified' }] },
      ],
    })

    markerRef.current = new window.google.maps.Marker({
      position: center,
      map: mapObj.current,
      draggable: true,
      animation: window.google.maps.Animation.DROP,
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 12,
        fillColor: '#16a34a',
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 3,
      },
    })

    geocoder.current = new window.google.maps.Geocoder()

    // Click en mapa mueve el pin
    mapObj.current.addListener('click', (e: any) => {
      moveMarker(e.latLng.lat(), e.latLng.lng())
    })

    // Arrastrar pin actualiza dirección
    markerRef.current.addListener('dragend', (e: any) => {
      moveMarker(e.latLng.lat(), e.latLng.lng())
    })

    if (initialLat && initialLng) {
      reverseGeocode(initialLat, initialLng)
    }

    setLoading(false)
  }, [initialLat, initialLng, moveMarker, reverseGeocode])

  // Cargar Google Maps
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY
    if (!apiKey) {
      setLoading(false)
      return
    }

    if (window.google?.maps) {
      initMap()
      return
    }

    window.initMapCallback = initMap
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMapCallback&language=es&region=DO`
    script.async = true
    script.defer = true
    document.head.appendChild(script)

    return () => {
      delete window.initMapCallback
    }
  }, [initMap])

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

  const searchAddress = async () => {
    if (!search.trim() || !geocoder.current) return
    const query = `${search}, República Dominicana`
    geocoder.current.geocode({ address: query }, (results: any[], status: string) => {
      if (status === 'OK' && results[0]) {
        const loc = results[0].geometry.location
        moveMarker(loc.lat(), loc.lng())
        mapObj.current?.setZoom(17)
        setSearch('')
      } else {
        alert('Dirección no encontrada. Intenta ser más específico.')
      }
    })
  }

  const handleSave = () => {
    onSave({ lat: coords.lat, lng: coords.lng, direccion_completa: address })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  // Fallback sin API key
  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-center">
        <MapPin className="w-8 h-8 text-amber-500 mx-auto mb-2" />
        <p className="text-sm font-semibold text-amber-800">Mapa no disponible</p>
        <p className="text-xs text-amber-600 mt-1">Configura <code>NEXT_PUBLIC_GOOGLE_MAPS_KEY</code> en las variables de entorno para activar el mapa.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Barra de búsqueda */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && searchAddress()}
            placeholder="Buscar calle, sector, lugar..."
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 bg-white"
          />
        </div>
        <button onClick={searchAddress}
          className="px-4 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-800">
          Buscar
        </button>
        <button onClick={getMyLocation} disabled={locating}
          title="Usar mi ubicación actual"
          className="px-3 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50 transition-colors">
          {locating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Locate className="w-4 h-4" />}
        </button>
      </div>

      {/* Mapa */}
      <div className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-sm" style={{ height: 320 }}>
        {loading && (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10">
            <Loader2 className="w-6 h-6 text-primary-600 animate-spin" />
          </div>
        )}
        <div ref={mapRef} className="w-full h-full" />
        {/* Hint overlay */}
        {!loading && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-3 py-1.5 rounded-full pointer-events-none">
            Toca el mapa o arrastra el pin para ajustar
          </div>
        )}
      </div>

      {/* Dirección detectada */}
      {address && (
        <div className="flex items-start gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
          <MapPin className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
          <p className="text-sm text-green-800 leading-snug">{address}</p>
        </div>
      )}

      {/* Coords */}
      <p className="text-[11px] text-gray-400 text-center">
        {coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}
      </p>

      {/* Acciones */}
      <div className="flex gap-2">
        <button onClick={handleSave}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
            saved ? 'bg-green-600 text-white' : 'bg-primary-600 hover:bg-primary-700 text-white'
          }`}>
          {saved ? <><Check className="w-4 h-4" />¡Guardado!</> : <><MapPin className="w-4 h-4" />Confirmar ubicación</>}
        </button>
        {onCancel && (
          <button onClick={onCancel}
            className="px-4 py-3 rounded-xl text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50">
            Cancelar
          </button>
        )}
      </div>
    </div>
  )
}
