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
        origin: 'http://45.248.150.228:3000', // Allow the frontend origin
        methods: ['GET', 'POST'], // HTTP methods allowed
    },
});

// Handle socket connections
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Handle alarm trigger
    socket.on('trigger-alarm', () => {
        console.log('Alarm triggered');
        io.emit('alarm', { status: 'RED' }); // Broadcast alarm to all connected clients
    });

    // Handle alarm removal
    socket.on('remove-alarm', () => {
        console.log('Alarm removed');
        io.emit('alarm', { status: 'OFF' }); // Broadcast alarm removal to all connected clients
    });

    // Handle socket disconnection
    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
    });
});

// Start the server
const PORT = 4565;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://45.248.150.228:${PORT}`);
});