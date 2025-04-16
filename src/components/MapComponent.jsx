import React, { useState, useEffect } from "react";
import { coordinates } from "../data/coordinates";
import { FaPlay, FaPause, FaRedo } from "react-icons/fa";

import {MapContainer,TileLayer,Marker,Popup,Polyline,Tooltip} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import icon from "leaflet/dist/images/marker-icon.png";
import iconRetina from "leaflet/dist/images/marker-icon-2x.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

// Constants
const totalTripTime = 70;
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
  // Css for buttons
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
  // State variables
  const [currentPosition, setCurrentPosition] = useState(0); 
  const [isMoving, setIsMoving] = useState(true); 
  const [isPaused, setIsPaused] = useState(false);
  const [isTripComplete, setIsTripComplete] = useState(false);
  
  const positions = coordinates.map((coords) => [
    coords.latitude,
    coords.longitude,
  ]); // Convert coordinates to [lat, lng] format


  // Start and end positions
  const startPosition = positions[0];
  const endPosition = positions[positions.length - 1];
  
  // Time management
  const calculateTimeRemaining = () => {
    const progressPercentage = currentPosition / (positions.length - 1);
    return Math.round(totalTripTime * (1 - progressPercentage));
  };

  // Format time as "Xh Ym"
  const formatTime = (minutes) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs}h ${mins}m`;
  };

  useEffect(() => {
    let interval;
    if (isMoving && !isPaused) {
      interval = setInterval(() => {
        setCurrentPosition(prevPosition => {
          const newPosition = prevPosition >= positions.length - 1 ? prevPosition : prevPosition + 1;
          if (newPosition >= positions.length - 1) {
            setIsTripComplete(true);
            setIsMoving(false);
          }
          return newPosition;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isMoving, isPaused, positions.length]);

  // Button functionality
  function handlePlayPause(){
    if (isTripComplete) return;
    setIsPaused(!isPaused);
  };

  function handleReset(){
    setCurrentPosition(0);
    setIsMoving(true);
    setIsPaused(false);
    setIsTripComplete(false);
  };

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <MapContainer
        center={positions[0]}
        zoom={15}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

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
          <Popup>
            <div style={{ padding: '0px' }}>
              <p><b>Coordinates:</b><br />
                Lat: {positions[currentPosition][0].toFixed(5)}<br />
                Lng: {positions[currentPosition][1].toFixed(5)}
              </p>
            </div>
          </Popup>
          
          <Tooltip sticky>
            Click for details
          </Tooltip>
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
        <Polyline positions={positions} color={"blue"} weight={4} opacity={0.7}>
          <Tooltip sticky>Route from Rishihood to Pacific Mall</Tooltip>
        </Polyline>
      </MapContainer>

      {/* Information Panel */}
      <div
        style={{
          position: "absolute",
          top: "20px",
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
          <b>Route:</b> Rishihood → Pacific Mall Delhi
        </p>
        <p style={{ margin: "4px 0" }}>
          <b>Data:</b> Simulated GPS coordinates
        </p>
        <p style={{ margin: "4px 0" }}>
          <b>Interval:</b> 0.3 seconds
        </p>
        <p><b>Time Remaining:</b> {formatTime(calculateTimeRemaining())}</p>
        <p><b>Total Trip Time:</b> 1h 10m</p>
      </div>


      {/* Control Buttons */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '10px',
        zIndex: 1000,
        display: 'flex',
        gap: '8px',
        background: 'rgba(255, 255, 255, 0.9)',
        padding: '8px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
      }}>
        {/* Play/Pause Button */}
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
        {/* Reset Button */}
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
      {isTripComplete && (
        <div style={{
          position: 'absolute',
          bottom: '40px',
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
