export interface Workout {
  id: string; 
  date: string; 
  distance: number; 
  duration: string; 
  type: 'Long run' | 'Easy Run' | 'Intervals' | 'Recovery'; 
  notes?: string; 
}