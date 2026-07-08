import React, { useEffect, useRef } from 'react'
import { CircleMarker, MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png'
import iconUrl from 'leaflet/dist/images/marker-icon.png'
import shadowUrl from 'leaflet/dist/images/marker-shadow.png'

L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
})

function ActiveSpotMarker({ spot, onSelect, active }) {
  const markerRef = useRef(null)
  const map = useMap()

  useEffect(() => {
    if (active && markerRef.current) {
      markerRef.current.openPopup()
      map.panTo([spot.lat, spot.lng])
    }
  }, [active, map, spot])

  return (
    <Marker
      ref={markerRef}
      position={[spot.lat, spot.lng]}
      eventHandlers={{ click: () => onSelect?.(spot) }}
    >
      <Popup>
        <b>{spot.title}</b>
        <br />
        {spot.distance}
      </Popup>
    </Marker>
  )
}

export default function MapView({ center, spots, onSelect, activeId }) {
  if (!center) return null

  return (
    <div style={{ height: 280, borderRadius: 12, overflow: 'hidden', margin: '12px 16px' }}>
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={15}
        zoomControl={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <CircleMarker
          center={[center.lat, center.lng]}
          radius={8}
          pathOptions={{ color: '#0a86f3', fillColor: '#2fb1ff', fillOpacity: 0.9 }}
        />
        {spots.map((spot) => (
          <ActiveSpotMarker
            key={spot.id}
            spot={spot}
            onSelect={onSelect}
            active={activeId === spot.id}
          />
        ))}
      </MapContainer>
    </div>
  )
}
