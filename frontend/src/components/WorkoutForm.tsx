// src/components/WorkoutForm.tsx

import React, { useState, type FormEvent, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { type Workout } from '../types/workout'; // Use type-only import

const API_URL = 'http://localhost:3001/api/workouts';

// Define the initial state structure for a new workout
const EMPTY_WORKOUT: Workout = {
  id: '',
  date: new Date().toISOString().substring(0, 10), // Default to today's date (YYYY-MM-DD)
  distance: 0,
  duration: '00:00:00',
  type: 'Easy Run', // Default type
  notes: '',
};

interface WorkoutFormProps {
  // Optional prop for editing: If a workout is passed, we are in edit mode.
  // We'll primarily use route params for ID lookup, but this structure is clean.
  initialWorkout?: Workout;
}

const WorkoutForm: React.FC<WorkoutFormProps> = () => {
  const navigate = useNavigate();
  // We use URL parameters to determine if we are editing an existing workout
  const { workoutId } = useParams<{ workoutId: string }>(); 
  
  // State to hold the form data
  const [formData, setFormData] = useState<Workout>(EMPTY_WORKOUT);
  const isEditing = !!workoutId; // True if workoutId exists in the URL

  // --- Step A: Fetch Existing Workout Data for Edit Mode ---
  useEffect(() => {
    if (isEditing) {
      // ...
    }
  }, [isEditing, workoutId]);
  
  // --- Step B: Handle Form Input Changes ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData(prevData => ({
      ...prevData,
      // Convert distance to number, if needed, otherwise keep as string
      [name]: name === 'distance' ? parseFloat(value) || 0 : value,
    }));
  };

  // --- Step C: Handle Form Submission (Create or Edit) ---
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      if (isEditing) {
        // EDIT MODE: PUT request
        await axios.put(`${API_URL}/${workoutId}`, formData);
        alert('Workout updated successfully!');
      } else {
        // CREATE MODE: POST request
        // The backend generates the ID, so we don't send the empty one.
        const { id, ...dataToSend } = formData;
        
        await axios.post(API_URL, dataToSend);
        alert('Workout logged successfully!');
      }
      
      // Redirect back to the dashboard after success
      navigate('/');
      
    } catch (error) {
      console.error('Error submitting workout:', error);
      alert('Failed to save workout. Check server logs.');
    }
  };

  return (
    <div className="form-container">
      <h2>{isEditing ? 'Edit Workout' : 'Log a Run'}</h2>
      <form onSubmit={handleSubmit} className="workout-form">
        
        {/* 1. Date */}
        <label>Date</label>
        <input 
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />

        {/* 2. Distance */}
        <label>Distance (km)</label>
        <input
          type="number"
          name="distance"
          value={formData.distance}
          onChange={handleChange}
          min="0.1"
          step="0.1"
          required
        />

        {/* 3. Duration */}
        <label>Duration (hh:mm:ss)</label>
        <input
          type="text"
          name="duration"
          value={formData.duration}
          onChange={handleChange}
          placeholder="e.g., 01:15:30"
          required
        />
        
        {/* 4. Type */}
        <label>Type</label>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          required
        >
          {/* Workout types defined in the interface */}
          <option value="Easy Run">Easy Run </option>
          <option value="Long run">Long Run </option>
          <option value="Intervals">Intervals </option>
          <option value="Recovery">Recovery </option>
        </select>
        
        {/* 5. Optional Notes */}
        <label>Notes</label>
        <textarea
          name="notes"
          value={formData.notes || ''}
          onChange={handleChange}
          rows={3}
          placeholder="Optional notes about the run..."
        />

        <button type="submit">
          {isEditing ? 'Save Changes' : 'Log Run'}
        </button>
        <button type="button" onClick={() => navigate('/')} className="cancel-button">
          Cancel
        </button>
      </form>
    </div>
  );
};

export default WorkoutForm;