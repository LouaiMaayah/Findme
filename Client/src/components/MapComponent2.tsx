import React from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const options: google.maps.MapOptions = {
  disableDefaultUI: true,
  restriction: {
    latLngBounds: {
      north: 85,
      south: -85,
      west: -180,
      east: 179,
    },
    strictBounds: true,
  },
  keyboardShortcuts: false,
  streetViewControl: true,
  streetViewControlOptions: {},
};

const center = {
  lat: 0,
  lng: 100,
};

function TestMap() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: [], // No extra libraries needed
  });

  const mapRef = React.useRef<google.maps.Map | null>(null);

  const onLoad = React.useCallback((map: google.maps.Map) => {
    mapRef.current = map;

    map.setCenter(center);
    map.setZoom(2); // Zoom to a real-world location
  }, []);

  const onUnmount = React.useCallback(() => {
    mapRef.current = null;
  }, []);

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={options}
    />
  ) : (
    <div>Loading map...</div>
  );
}

export default React.memo(TestMap);
