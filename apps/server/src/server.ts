import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Register routes
app.use('/', routes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

/**
 * Socket.IO namespaces
 */

// Equipment namespace
const equipmentNamespace = io.of('/equipment');
equipmentNamespace.on('connection', async (socket) => {
  console.log('Equipment client connected:', socket.id);

  // Example: emit all equipment on connection
  const allEquipment = await prisma.equipment.findMany();
  socket.emit('allEquipment', allEquipment);
});

// Rentals namespace
const rentalsNamespace = io.of('/rentals');
rentalsNamespace.on('connection', async (socket) => {
  console.log('Rentals client connected:', socket.id);

  // Example: emit all rentals on connection
  const allRentals = await prisma.rentals.findMany({
    include: { equipment: true, clients: true, sites: true }
  });
  socket.emit('allRentals', allRentals);
});

// Alerts namespace
const alertsNamespace = io.of('/alerts');
alertsNamespace.on('connection', (socket) => {
  console.log('Alerts client connected:', socket.id);

  // You can push alert events here as needed
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

/**
 * Example REST endpoints using new schema
 */

// Get all clients
app.get('/api/clients', async (req, res) => {
  try {
    const clients = await prisma.clients.findMany();
    res.json(clients);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch clients' });
  }
});

// Create a new client
app.post('/api/clients', async (req, res) => {
  const { client_name, reliability_score } = req.body;
  try {
    const client = await prisma.clients.create({
      data: { client_name, reliability_score }
    });
    res.json(client);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create client' });
  }
});

// Get all equipment
app.get('/api/equipment', async (req, res) => {
  try {
    const equipment = await prisma.equipment.findMany();
    res.json(equipment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch equipment' });
  }
});

// Create a new rental
app.post('/api/rentals', async (req, res) => {
  const { equipment_id, client_id, site_id, check_out_date, expected_return_date } = req.body;
  try {
    const rental = await prisma.rentals.create({
      data: {
        equipment_id,
        client_id,
        site_id,
        check_out_date: new Date(check_out_date),
        expected_return_date: new Date(expected_return_date),
      }
    });
    res.json(rental);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create rental' });
  }
});

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
