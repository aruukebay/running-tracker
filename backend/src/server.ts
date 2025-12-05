import express, { Request, Response } from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid'; 
import { Workout } from './types/workout'; 

const app = express();
const PORT = process.env.PORT || 3001; 


// allow all cors
const corsOptions: cors.CorsOptions = {
  origin: '*', // <--- THIS ALLOWS EVERY DOMAIN
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Good practice to explicitly list methods
};

// user credentials 
const VALID_EMAIL = 'runner@example.com';
const VALID_PASSWORD = 'password123';

// mock token to be stored on the frontend 
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


// POST /api/login 
app.post('/api/login', (req: Request, res: Response) => {
  const { email = '', password = '' } = req.body;
  if (email.trim() === VALID_EMAIL && password.trim() === VALID_PASSWORD) {
    return res.json({ 
      success: true, 
      token: MOCK_TOKEN,
      user: { email: VALID_EMAIL }
    });
  } else {
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid email or password' 
    });
  }
});


// GET /api/workouts - view 
app.get('/api/workouts', (req: Request, res: Response) => {
  const sortedWorkouts = workouts.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  res.json(sortedWorkouts);
});

// POST /api/workouts - create
app.post('/api/workouts', (req: Request, res: Response) => {
  const newWorkout: Workout = {
    id: uuidv4(), 
    ...req.body, 
  };

  if (!newWorkout.date || !newWorkout.distance || !newWorkout.duration) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  workouts.push(newWorkout);
  res.status(201).json(newWorkout); 
});



// PUT /api/workouts/:id - update
app.put('/api/workouts/:id', (req: Request, res: Response) => {
  const { id } = req.params; // Get ID from URL parameter
  const index = workouts.findIndex(w => w.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Workout not found' });
  }

  const updatedWorkout: Workout = { 
    id, 
    ...req.body 
  };
  
  workouts[index] = updatedWorkout;

  res.json(workouts[index]);
});


// server listener 
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});