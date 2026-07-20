import React, { useCallback, useEffect, useRef } from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100%',
};

function GoogleMapView({ center, spots, onSelect, activeId }) {
  const mapRef = useRef(null);

  const onLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  // 내 위치 + 흡연구역이 전부 화면 안에 들어오도록 지도 범위를 맞춘다.
  useEffect(() => {
    if (!mapRef.current) return;
    const bounds = new window.google.maps.LatLngBounds();
    bounds.extend(center);
    spots.forEach((spot) => bounds.extend({ lat: spot.lat, lng: spot.lng }));
    mapRef.current.fitBounds(bounds, 60);
  }, [center, spots]);

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={16}
      onLoad={onLoad}
      options={{
        disableDefaultUI: true, // 줌 컨트롤 등 기본 UI 비활성화
      }}
    >
      <Marker
        position={center}
        title="내 위치"
        icon={{
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: '#0A86F3',
          fillOpacity: 1,
          strokeColor: 'white',
          strokeWeight: 2,
        }}
        zIndex={200}
      />
      {spots.map((spot) => (
        <Marker
          key={spot.id}
          position={{ lat: spot.lat, lng: spot.lng }}
          title={spot.title}
          onClick={() => onSelect(spot)}
          zIndex={spot.id === activeId ? 100 : 1}
        />
      ))}
    </GoogleMap>
  );
}

export default React.memo(GoogleMapView);