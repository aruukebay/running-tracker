
import WorkoutList from './components/WorkoutList';
import WorkoutForm from './components/WorkoutForm';
import LoginPage from './components/LoginPage'; 
import PrivateRoute from './components/PrivateRoute'; 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          
          {}
          <Route path="/login" element={<LoginPage />} />
          
          {}
          
          {}
          <Route 
            path="/" 
            element={<PrivateRoute><WorkoutList /></PrivateRoute>} 
          />
          
          {}
          <Route 
            path="/log" 
            element={<PrivateRoute><WorkoutForm /></PrivateRoute>}
          />
          
          {}
          <Route 
            path="/edit/:workoutId" 
            element={<PrivateRoute><WorkoutForm /></PrivateRoute>} 
          />
          
          {}
          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;