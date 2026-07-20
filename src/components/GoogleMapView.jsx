import React from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100%',
};

function GoogleMapView({ center, spots, onSelect, activeId }) {
  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={16}
      options={{
        disableDefaultUI: true, // 줌 컨트롤 등 기본 UI 비활성화
      }}
    >
      {spots.map((spot) => (
        <Marker
          key={spot.id}
          position={{ lat: spot.lat, lng: spot.lng }}
          title={spot.name}
          onClick={() => onSelect(spot)}
          zIndex={spot.id === activeId ? 100 : 1}
        />
      ))}
    </GoogleMap>
  );
}

export default React.memo(GoogleMapView);