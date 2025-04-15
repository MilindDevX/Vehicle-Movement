import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  Tooltip,
} from "react-leaflet";
import L from "leaflet";
import { coordinates } from "../data/coordinates";
import "leaflet/dist/leaflet.css";
import icon from "leaflet/dist/images/marker-icon.png";
import iconRetina from "leaflet/dist/images/marker-icon-2x.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import { FaPlay, FaPause, FaRedo } from "react-icons/fa";
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
  const [currentPosition, setCurrentPosition] = useState(0); // Current index of the vehicle
  const [isMoving, setIsMoving] = useState(true); // Is the vehicle moving?
  const [isPaused, setIsPaused] = useState(false); // Is the vehicle paused?
  const positions = coordinates.map((point) => [point.latitude,point.longitude,]); // Convert coordinates to [lat, lng] format

  // Start and end positions
  const startPosition = positions[0];
  const endPosition = positions[positions.length - 1];

  // Pause and resume functionality
  useEffect(() => {
    let interval;
    if (isMoving && !isPaused) {
      interval = setInterval(() => {
        setCurrentPosition((prev) => {
          if (prev >= positions.length - 1) {
            setIsMoving(false);
            return prev;
          }
          return prev + 1;
        });
      }, 300);
    }
    return () => clearInterval(interval);
  }, [isMoving, isPaused, positions.length]);

  const handlePlayPause = () => setIsPaused(!isPaused);

  const handleReset = () => {
    setCurrentPosition(0);
    setIsMoving(true);
    setIsPaused(false);
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
        />
        {/* Vehicle Marker */}
        <Marker position={positions[currentPosition]} icon={carIcon}>
          <Popup permanent direction="top" offset={[0, -20]}>
            <div style={{ textAlign: 'center', zIndex: 1000 }}>
              Lat: {positions[currentPosition][0].toFixed(5)}<br />
              Lng: {positions[currentPosition][1].toFixed(5)}
            </div>
          </Popup>
        </Marker>

        {/* Start Point Marker with Label */}
        <Marker position={startPosition} icon={startIcon}>
          <Tooltip permanent direction="top" offset={[0, -27]}>
            <div style={{ fontWeight: "bold", color: "green" }}>
              Rishihood University
            </div>
          </Tooltip>
        </Marker>

        {/* End Point Marker with Label */}
        <Marker position={endPosition} icon={endIcon}>
          <Tooltip permanent direction="bottom" offset={[0, 20]}>
            <div style={{ fontWeight: "bold", color: "red" }}>
              Pacific Mall Delhi
            </div>
          </Tooltip>
        </Marker>

        {/* Route Line */}
        <Polyline positions={positions} color="blue" weight={4} opacity={0.7}>
          <Tooltip sticky>Route from Rishihood to Pacific Mall</Tooltip>
        </Polyline>
      </MapContainer>

      {/* Control Button */}
      <div
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          display: "flex",
          gap: "8px",
          zIndex: 1000,
        }}
      >
        <button
          onClick={handlePlayPause}
          style={{
            padding: "8px 12px",
            background: "#fff",
            border: "1px solid #ddd",
            borderRadius: "4px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          }}
        >
          {isPaused ? <FaPlay size={14} /> : <FaPause size={14} />}
        </button>
        <button
          onClick={handleReset}
          style={{
            padding: "8px 12px",
            background: "#fff",
            border: "1px solid #ddd",
            borderRadius: "4px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          }}
        >
          <FaRedo size={14} />
        </button>
      </div>
    </div>
  );
}

export default MapComponent;
