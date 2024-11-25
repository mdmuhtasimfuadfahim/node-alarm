const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// Configure CORS for HTTP routes
app.use(cors({
    origin: '*', // Allow all origins
}));

// Initialize Socket.IO with CORS for WebSocket connections
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000', // Allow the frontend origin
        methods: ['GET', 'POST'], // HTTP methods allowed
    },
});

let alarmState = 'OFF'; // Store the alarm state

// Handle socket connections
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Send the current alarm state to the new connection
    socket.emit('alarm', { status: alarmState });

    // Handle alarm trigger
    socket.on('trigger-alarm', () => {
        console.log('Alarm triggered');
        alarmState = 'RED'; // Update the alarm state
        io.emit('alarm', { status: alarmState }); // Broadcast alarm to all connected clients
    });

    // Handle alarm removal
    socket.on('remove-alarm', () => {
        console.log('Alarm removed');
        alarmState = 'OFF'; // Update the alarm state
        io.emit('alarm', { status: alarmState }); // Broadcast alarm removal to all connected clients
    });

    // Handle socket disconnection
    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
    });
});

// Start the server
const PORT = 4565;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
});