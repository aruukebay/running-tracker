// src/types/workout.ts

// the structure for a single running workout entry

export interface Workout {
  id: string; // an identifier
  date: string; // date of the run
  distance: number; // dist in kilometers 
  duration: string; // time  
  type: 'Long run' | 'Easy Run' | 'Intervals' | 'Recovery'; // valid categories
  notes?: string; // a field for notes
}