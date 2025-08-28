import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Register routes
app.use('/', routes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  
  // Equipment namespace
  const equipmentNamespace = io.of('/equipment');
  equipmentNamespace.on('connection', (socket) => {
    console.log('Equipment client connected:', socket.id);
  });
  
  // Rentals namespace
  const rentalsNamespace = io.of('/rentals');
  rentalsNamespace.on('connection', (socket) => {
    console.log('Rentals client connected:', socket.id);
  });
  
  // Alerts namespace
  const alertsNamespace = io.of('/alerts');
  alertsNamespace.on('connection', (socket) => {
    console.log('Alerts client connected:', socket.id);
  });
  
  // Telemetry namespace
  const telemetryNamespace = io.of('/telemetry');
  telemetryNamespace.on('connection', (socket) => {
    console.log('Telemetry client connected:', socket.id);
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});