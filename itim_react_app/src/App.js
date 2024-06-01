import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { LandingPage } from './LandingPage/LandingPage';
import { AdminPage } from './AdminPage/AdminPage';
import { AuthProvider } from './Authentication/AuthContext';
import ProtectedRoute from './ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route exact path="/" element={<LandingPage />} />
          <Route path="/Admin" element={<ProtectedRoute element={<AdminPage />} />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
