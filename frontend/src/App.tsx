// frontend/src/App.tsx

import WorkoutList from './components/WorkoutList';
import WorkoutForm from './components/WorkoutForm';
import LoginPage from './components/LoginPage'; // <-- NEW
import PrivateRoute from './components/PrivateRoute'; // <-- NEW
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          
          {/* PUBLIC ROUTE: Login Page */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* PROTECTED ROUTES: All workout pages must be wrapped in PrivateRoute */}
          
          {/* Dashboard Route (Root Path) */}
          <Route 
            path="/" 
            element={<PrivateRoute><WorkoutList /></PrivateRoute>} // <-- PROTECTED
          />
          
          {/* Log New Workout Route */}
          <Route 
            path="/log" 
            element={<PrivateRoute><WorkoutForm /></PrivateRoute>} // <-- PROTECTED
          />
          
          {/* Edit Existing Workout Route */}
          <Route 
            path="/edit/:workoutId" 
            element={<PrivateRoute><WorkoutForm /></PrivateRoute>} // <-- PROTECTED
          />
          
          {/* Fallback */}
          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;