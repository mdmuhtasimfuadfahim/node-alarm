const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
    },
});

// Middleware
app.use(cors());

// Socket connection
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Handle alarm trigger
    socket.on('trigger-alarm', () => {
        console.log('Alarm triggered');
        io.emit('alarm', { status: 'RED' }); // Broadcast to all clients
    });

    // Handle disconnect
    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
    });
});

// API Endpoint
app.get('/', (req, res) => {
    res.send('Socket server is running!');
});

// Start server
const PORT = 4565;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
});
