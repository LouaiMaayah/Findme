import React, {
  useRef,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from "react";
import { GoogleMap, useLoadScript } from "@react-google-maps/api";
import { Latlng, MarkerData } from "../types";
import { Button } from "@mui/material";
import ReplayIcon from "@mui/icons-material/Replay";
import { Marker } from "@react-google-maps/api";

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
  markers?: MarkerData[];
  isInStreetView?: boolean;
};

export type MapComponentRef = {
  toggleStreetView: () => void;
  getStreetViewPosition: () => Latlng | null;
};

const MapComponent = forwardRef<MapComponentRef, BackgroundMapProps>(
  (
    {
      children,
      showPanToButton,
      onStreetViewVisibleChange: streetViewVisibleChange,
      showPegMan,
      markers,
      isInStreetView,
    },
    ref
  ) => {
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

      if (isInStreetView) {
        streetView.setVisible(true);
      }

      streetView.addListener("visible_changed", () => {
        const visible = streetView.getVisible();
        if (streetViewVisibleChange) {
          streetViewVisibleChange(visible);
        }
      });
    }, []);

    useImperativeHandle(ref, () => ({
      toggleStreetView: () => {
        if (mapRef.current) {
          const streetView = mapRef.current.getStreetView();
          const isVisible = streetView.getVisible();
          streetView.setVisible(!isVisible);
        }
      },
      getStreetViewPosition: () => {
        if (mapRef.current) {
          const streetView = mapRef.current.getStreetView();
          const pos = streetView.getPosition();
          return pos ? (pos.toJSON() as Latlng) : null;
        }
        return null;
      },
    }));

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
        {markers?.map((marker) => {
          return (
            <Marker
              key={`${marker.position.lat}-${marker.position.lng}`}
              position={marker.position}
              icon={marker.icon}
            />
          );
        })}
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
);

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
