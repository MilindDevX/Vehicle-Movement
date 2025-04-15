import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, Tooltip } from 'react-leaflet';
import L from "leaflet";
import { coordinates } from "../data/coordinates";
import "leaflet/dist/leaflet.css";
import icon from "leaflet/dist/images/marker-icon.png";
import iconRetina from "leaflet/dist/images/marker-icon-2x.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

// Icons
import car from "../images/car.png";
import start from "../images/start.png";
import end from "../images/end.png";

const DefaultIcon = L.icon({
  iconUrl: icon,
  iconRetinaUrl: iconRetina,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Custom car icon
const carIcon = new L.Icon({
  iconUrl: car,
  iconSize: [32, 32],
});
// Custom start and end point icons
const startIcon = new L.Icon({
  iconUrl: start,
  iconSize: [25, 41],
});

const endIcon = new L.Icon({
  iconUrl: end,
  iconSize: [25, 41],
});
function MapComponent() {
  const [currentPosition, setCurrentPosition] = useState(0);
  const [isMoving, setIsMoving] = useState(true);
  const positions = coordinates.map((point) => [point.latitude, point.longitude]);

  const startPosition = positions[0];
  const endPosition = positions[positions.length - 1];

  useEffect(() => {
    let interval;
    if (isMoving) {
      interval = setInterval(() => {
        setCurrentPosition((prev) => {
          if (prev + 1 >= positions.length - 1) {
            setIsMoving(false);
            return positions.length - 1;
          }
          return prev + 1;
        });
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isMoving, positions.length]);

  const handleReset = () => {
    setCurrentPosition(0);
    setIsMoving(true);
  };

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <MapContainer
        center={positions[0]}
        zoom={15}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
        />
        {/* Vehicle Marker */}
        <Marker position={positions[currentPosition]} icon={carIcon}>
          <Popup>Vehicle</Popup>
        </Marker>

        {/* Start Point Marker with Label */}
        <Marker position={startPosition} icon={startIcon}>
          <Tooltip permanent direction="top" offset={[0, -10]}>
            <div style={{ fontWeight: 'bold', color: 'green' }}>Rishihood University</div>
          </Tooltip>
          <Popup>Rishihood University</Popup>
        </Marker>
        
        {/* End Point Marker with Label */}
        <Marker position={endPosition} icon={endIcon}>
          <Tooltip permanent direction="top" offset={[0, -10]}>
            <div style={{ fontWeight: 'bold', color: 'red' }}>Pacific Mall Delhi</div>
          </Tooltip>
          <Popup>Pacific Mall Delhi</Popup>
        </Marker>
        
        {/* Route Line */}
        <Polyline 
          positions={positions} 
          color="blue"
          weight={4}
          opacity={0.7}
        >
          <Tooltip sticky>Route from Rishihood to Pacific Mall</Tooltip>
        </Polyline>
      </MapContainer>

      {/* Control Button */}
      <button 
        onClick={handleReset}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          zIndex: 1000,
          padding: '8px 16px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '14px',
          boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
        }}
      >
        ↻ Reset Journey
      </button>
      
    </div>
  );
}

export default MapComponent;
