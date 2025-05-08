import React, { useRef, useCallback } from "react";
import { GoogleMap, useLoadScript } from "@react-google-maps/api";
import { Latlng } from "../types";
import { Button } from "@mui/material";
import ReplayIcon from "@mui/icons-material/Replay";

const center: Latlng = {
  lat: 0,
  lng: 0,
};

const options: google.maps.MapOptions = {
  disableDefaultUI: true,
  restriction: {
    latLngBounds: {
      north: 85,
      south: -85,
      west: -180,
      east: 180,
    },
    strictBounds: true,
  },
  keyboardShortcuts: false,
};

type BackgroundMapProps = {
  style?: React.CSSProperties;
  children?: React.ReactNode;
  showPanToButton?: boolean;
  onStreetViewPositionChange?: (position: Latlng) => void;
  onStreetViewVisibleChange?: (visible: boolean) => void;
  showPegMan?: boolean;
};

function MapComponent({
  children,
  showPanToButton,
  onStreetViewPositionChange: streetViewPositionChange,
  onStreetViewVisibleChange: streetViewVisibleChange,
  showPegMan,
}: BackgroundMapProps) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const mapRef = useRef<google.maps.Map | null>(null);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;

    const streetView = map.getStreetView();
    streetView.setOptions({
      disableDefaultUI: true,
    });

    streetView.addListener("visible_changed", () => {
      const visible = streetView.getVisible();
      if (streetViewVisibleChange) {
        streetViewVisibleChange(visible);
      }
    });

    // Listen for position changes while in Street View
    streetView.addListener("position_changed", () => {
      const position = streetView.getPosition();
      if (position && streetViewPositionChange) {
        streetViewPositionChange(position.toJSON() as Latlng);
      }
    });
  }, []);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps</div>;

  return (
    <GoogleMap
      mapContainerStyle={styles.mapContainerStyle}
      zoom={2.3}
      center={center}
      options={{ ...options, streetViewControl: showPegMan }}
      onLoad={onMapLoad}
    >
      {children}
      {showPanToButton && (
        <Button
          style={styles.iconButton}
          variant="contained"
          onClick={() => {
            if (mapRef.current) {
              mapRef.current.panTo(center);
              mapRef.current.setZoom(2.3);
            }
          }}
        >
          <ReplayIcon />
        </Button>
      )}
    </GoogleMap>
  );
}

const styles: Record<string, React.CSSProperties> = {
  iconButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
  },
  mapContainerStyle: {
    width: "100%",
    height: "100%",
    position: "relative",
  },
};

export default MapComponent;
