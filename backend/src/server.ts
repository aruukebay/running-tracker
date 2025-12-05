// src/server.ts
import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { v4 as uuidv4 } from 'uuid'; 
import { Workout } from './types/workout'; 

const app = express();
const PORT = 3001; 

const allowedOrigins = [
  'http://localhost:5173', // For local development
  'https://YOUR-VERCEL-DOMAIN.vercel.app', // <--- REPLACE THIS WITH YOUR ACTUAL VERCEL URL
];

const corsOptions: cors.CorsOptions = {
  origin: allowedOrigins
};



// user credentials 
const VALID_EMAIL = 'runner@example.com';
const VALID_PASSWORD = 'password123';

// mock token to be stored on the frontend (usually a JWT in a real app)
const MOCK_TOKEN = 'mock-auth-token-123-abc'; 
app.use(express.json());
app.use(cors(corsOptions));

// DB 
let workouts: Workout[] = [
  // workout 1
  { id: '1', date: '2025-12-04', distance: 5.5, duration: '00:30:15', type: 'Easy Run', notes: 'Feeling great!' },
  // workout 2
  { id: '2', date: '2025-12-01', distance: 10.0, duration: '00:58:45', type: 'Long run', notes: 'Hilly route.' },
];


// 1. CORS: Allows your React frontend (on port 3000) to talk to this backend (on port 3001)
app.use(cors()); 
// 2. Body Parser: Parses incoming JSON request bodies
app.use(bodyParser.json()); 


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


// POST /api/login
app.post('/api/login', (req: Request, res: Response) => {
  // TypeScript safety: Use optional chaining and default values
  const { email = '', password = '' } = req.body;

  // 1. Check if email and password match hardcoded values
  if (email.trim() === VALID_EMAIL && password.trim() === VALID_PASSWORD) {
    // 2. Return success status and the token
    return res.json({ 
      success: true, 
      token: MOCK_TOKEN,
      user: { email: VALID_EMAIL } // Optional: send basic user info
    });
  } else {
    // 3. Return 401 Unauthorized status on failure
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid email or password' 
    });
  }
});



// server listener 
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});