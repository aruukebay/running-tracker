import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import { type Workout } from '../types/workout';

const API_BASE_URL = 'https://running-tracker-x6r2.onrender.com';
const API_URL = `${API_BASE_URL}/api/workouts`; 

const WorkoutList: React.FC = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchWorkouts();
  }, []); 

  const fetchWorkouts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<Workout[]>(API_URL);
      setWorkouts(response.data);
    } catch (err) {
      console.error('Error fetching workouts:', err);
      setError('Failed to fetch workouts. Is the backend server running?');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading-state">Loading Workouts...</div>;
  }

  if (error) {
    return <div className="error-state">Error: {error}</div>;
  }

  if (workouts.length === 0) {
    return <div className="empty-state">No workouts logged yet. Start running!</div>;
  }

  return (
    <div className="dashboard-container">
      <header className="header">
        <h1>🏃‍♀️ Run Tracker Dashboard</h1>
              {}
            <button
                  className="fab-button"
                  onClick={() => navigate('/log')} 
              >
                  +
            </button>
      </header>
      
      <section className="workout-list">
        {workouts.map((workout) => (
          <div key={workout.id} className="workout-card">
            <div className="card-header">
              <span className={`run-type ${workout.type.replace(/\s/g, '-').toLowerCase()}`}>
                { workout.type }
              </span>
              <span className="run-date">{": "+new Date(workout.date).toLocaleDateString() }</span>
            </div>
            
            <div className="card-details">
              <div className="detail-item">
                <span className="label">Distance: </span>
                <span className="value distance-value">{workout.distance} km</span>
              </div>
              <div className="detail-item">
                <span className="label">Duration: </span>
                <span className="value">{workout.duration}</span>
              </div>
            </div>

            {workout.notes && <p className="run-notes">Notes: {workout.notes}</p>}
            
            {}
                <button
                    className="edit-button"
                    onClick={() => navigate(`/edit/${workout.id}`, { state: { workout } })} 
                >
                    Edit
                </button>
          </div>
        ))}
      </section>
    </div>
  );
};

export default WorkoutList;