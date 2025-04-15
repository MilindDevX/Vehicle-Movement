import React, { useState, useEffect } from "react";
import { coordinates } from "../data/coordinates";
import { FaPlay, FaPause, FaRedo } from "react-icons/fa";

import {MapContainer,TileLayer,Marker,Popup,Polyline,Tooltip} from "react-leaflet";
import L from "leaflet";
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
  const buttonStyle = {
    padding: '8px 12px',
    background: '#fff',
    border: '1px solid #ddd',
    borderRadius: '4px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    fontSize: '14px',
    transition: 'all 0.2s',
    ':hover': {
      background: '#f5f5f5'
    }
  };
  const [currentPosition, setCurrentPosition] = useState(0); 
  const [isMoving, setIsMoving] = useState(true); 
  const [isPaused, setIsPaused] = useState(false);
  const positions = coordinates.map((point) => [
    point.latitude,
    point.longitude,
  ]); // Convert coordinates to [lat, lng] format
  const isTripComplete = currentPosition >= positions.length - 1;

  // Start and end positions
  const startPosition = positions[0];
  const endPosition = positions[positions.length - 1];
  
  // Pause and resume functionality
  useEffect(() => {
    let interval;
    if (isMoving && !isPaused) {
      interval = setInterval(() => {
        setCurrentPosition((prev) =>
          prev >= positions.length - 1 ? prev : prev + 1
        );
      }, 300);
    }
    return () => clearInterval(interval);
  }, [isMoving, isPaused, positions.length]);

  const handlePlayPause = () => {
    setIsPaused(!isPaused);
    if (isTripComplete) setIsMoving(false);
  };

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
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        
        {/* Polyline for the route */}
        <Polyline
          positions={positions}
          color={isTripComplete ? "green" : "blue"}
          weight={4}
          opacity={0.7}
        />

        {/* Start Point Marker */}
        <Marker position={startPosition} icon={startIcon}>
          <Tooltip permanent direction="top" offset={[0, -27]}>
            <div style={{ fontWeight: "bold", color: "green" }}>
              Rishihood University
            </div>
          </Tooltip>
        </Marker>

        {/* Vehicle Marker */}
        <Marker position={positions[currentPosition]} icon={carIcon}>
          <Popup permanent direction="top" offset={[0, -20]}>
            <div style={{ textAlign: "center", zIndex: 1000 }}>
              Lat: {positions[currentPosition][0].toFixed(5)}
              <br />
              Lng: {positions[currentPosition][1].toFixed(5)}
            </div>
          </Popup>
        </Marker>

        {/* End Point Marker */}
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

      {/* Information Panel */}
      <div
        style={{
          position: "absolute",
          top: "10px",
          left: "80px",
          zIndex: 1000,
          background: "rgba(255, 255, 255, 0.9)",
          padding: "10px 15px",
          borderRadius: "8px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
          maxWidth: "300px",
        }}
      >
        <h3 style={{ margin: "0 0 8px 0" }}>🚗 Vehicle Movement Simulator</h3>
        <p style={{ margin: "4px 0" }}>
          <b>Route:</b> Rishihood → Pacific Mall Sonipat
        </p>
        <p style={{ margin: "4px 0" }}>
          <b>Data:</b> Simulated GPS coordinates
        </p>
        <p style={{ margin: "4px 0" }}>
          <b>Interval:</b> 0.3 seconds
        </p>
      </div>


      {/* Control Buttons */}
      <div style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        zIndex: 1000,
        display: 'flex',
        gap: '8px',
        background: 'rgba(255, 255, 255, 0.9)',
        padding: '8px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
      }}>
        <button 
          onClick={handlePlayPause}
          style={buttonStyle}
          aria-label={isPaused ? 'Resume' : 'Pause'}
        >
          {isPaused ? <FaPlay size={14} /> : <FaPause size={14} />}
          <span style={{ marginLeft: '6px' }}>
            {isPaused ? 'Resume' : 'Pause'}
          </span>
        </button>
        <button 
          onClick={handleReset}
          style={buttonStyle}
          aria-label="Reset"
        >
          <FaRedo size={14} />
          <span style={{ marginLeft: '6px' }}>Reset</span>
        </button>
      </div>

      {/* Trip Completion Alert */}
      {isTripComplete && !isMoving && (
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          background: '#4CAF50',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '8px',
          boxShadow: '0 2px 15px rgba(0,0,0,0.3)',
          animation: 'fadeIn 0.5s'
        }}>
          🎉 Trip completed! Click <b>Reset</b> to replay.
        </div>
      )}

      
    </div>
  );
}

export default MapComponent;
