import React, { useState } from 'react';
import { io } from 'socket.io-client';
import './App.css'; // For red animation styles

let socket; // Declare socket globally

function App() {
  const [alarm, setAlarm] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  const triggerAlarm = () => {
    if (!isConnected) {
      // Establish socket connection
      socket = io('http://45.248.150.228:4565');
      setIsConnected(true);

      // Listen for alarm events
      socket.on('alarm', (data) => {
        setAlarm(data.status); // Update alarm state when alarm is triggered
      });

      console.log('Socket connected');
    }

    if (socket && isConnected) {
      socket.emit('trigger-alarm'); // Emit alarm event
    }
  };

  const removeAlarm = () => {
    if (socket) {
      socket.disconnect(); // Disconnect the socket
      setIsConnected(false);
      setAlarm(null); // Reset alarm state
      console.log('Socket disconnected');
    }
  };

  return (
    <div style={styles.container}>
      <h1>Socket Alarm App</h1>
      <button onClick={triggerAlarm} style={styles.button}>
        Trigger Alarm
      </button>
      <button onClick={removeAlarm} style={styles.removeButton} disabled={!isConnected}>
        Remove Alarm
      </button>

      {alarm === 'RED' && isConnected && (
        <div className="alarm-animation" style={styles.alarm}>
          <h2>🚨 Alarm Triggered!</h2>
          <audio autoPlay loop>
            <source src="alarm-sound.mp3" type="audio/mpeg" />
          </audio>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    textAlign: 'center',
    padding: '50px',
    fontFamily: 'Arial, sans-serif',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#007BFF',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    margin: '5px',
  },
  removeButton: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#DC3545',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    margin: '5px',
  },
  alarm: {
    marginTop: '20px',
    fontSize: '24px',
    fontWeight: 'bold',
  },
};

export default App;
