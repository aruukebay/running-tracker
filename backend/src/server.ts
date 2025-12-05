// src/server.ts
import express, { Request, Response } from 'express';
import cors from 'cors';
// Removed body-parser, as express.json() is the modern replacement
import { v4 as uuidv4 } from 'uuid'; 
import { Workout } from './types/workout'; 

const app = express();
// FIX 1: Use process.env.PORT for deployment
const PORT = process.env.PORT || 3001; 

const allowedOrigins = [
  'http://localhost:5173', // For local development
  'https://running-tracker-x6r2.onrender.com', 
];

const corsOptions: cors.CorsOptions = {
  origin: allowedOrigins
};


// user credentials 
const VALID_EMAIL = 'runner@example.com';
const VALID_PASSWORD = 'password123';

// mock token to be stored on the frontend (usually a JWT in a real app)
const MOCK_TOKEN = 'mock-auth-token-123-abc'; 

// --- MIDDLEWARES (The correct, non-redundant order) ---
// 1. Body Parser: Parses incoming JSON request bodies (CRITICAL for req.body to work)
app.use(express.json()); 
// 2. CORS: Applies the configured cross-origin rules
app.use(cors(corsOptions)); 


// DB 
let workouts: Workout[] = [
  // workout 1
  { id: '1', date: '2025-12-04', distance: 5.5, duration: '00:30:15', type: 'Easy Run', notes: 'Feeling great!' },
  // workout 2
  { id: '2', date: '2025-12-01', distance: 10.0, duration: '00:58:45', type: 'Long run', notes: 'Hilly route.' },
];


// POST /api/login (Authentication Route)
app.post('/api/login', (req: Request, res: Response) => {
  // TypeScript safety: Use optional chaining and default values
  // Logging is the best way to debug: console.log("Received login body:", req.body);
  const { email = '', password = '' } = req.body;

  // 1. Check if email and password match hardcoded values (using trim() for safety)
  if (email.trim() === VALID_EMAIL && password.trim() === VALID_PASSWORD) {
    // 2. Return success status and the token
    return res.json({ 
      success: true, 
      token: MOCK_TOKEN,
      user: { email: VALID_EMAIL }
    });
  } else {
    // 3. Return 401 Unauthorized status on failure
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid email or password' 
    });
  }
});


// GET /api/workouts - Read All (Sorted)
app.get('/api/workouts', (req: Request, res: Response) => {
  // sort by date newest first 
  const sortedWorkouts = workouts.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  res.json(sortedWorkouts);
});

// POST /api/workouts - Create
app.post('/api/workouts', (req: Request, res: Response) => {
  // TypeScript helps ensure req.body matches Workout structure (mostly)
  const newWorkout: Workout = {
    id: uuidv4(), // Generate a unique ID
    ...req.body,  // Spread the data sent from the client
  };

  // Basic validation (optional but recommended for production)
  if (!newWorkout.date || !newWorkout.distance || !newWorkout.duration) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  workouts.push(newWorkout);
  // Status 201 is used for successful resource creation
  res.status(201).json(newWorkout); 
});


// Note: The duplicate POST /api/workouts route has been removed.


// PUT /api/workouts/:id - Update
app.put('/api/workouts/:id', (req: Request, res: Response) => {
  const { id } = req.params; // Get ID from URL parameter
  const index = workouts.findIndex(w => w.id === id);

  if (index === -1) {
    // If workout is not found
    return res.status(404).json({ message: 'Workout not found' });
  }

  // Create the updated workout object
  const updatedWorkout: Workout = { 
    id, // Keep the original ID
    ...req.body // Use the new data from the request body
  };
  
  // Replace the old workout with the new one
  workouts[index] = updatedWorkout;

  res.json(workouts[index]);
});


// server listener 
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});