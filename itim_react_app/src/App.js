import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Notice the change here
import { LandingPage } from './LandingPage/LandingPage';
import { AdminPage } from './AdminPage/AdminPage'

function App() {
  return (
    <Router>
      <Routes> {/* Change from Switch to Routes */}
        <Route exact path="/" element={<LandingPage />} /> {/* Change component to element */}
        <Route path="/Admin" element={<AdminPage />} /> {/* Change component to element */}
      </Routes> {/* Change from Switch to Routes */}
    </Router>
  )
}

export default App;
