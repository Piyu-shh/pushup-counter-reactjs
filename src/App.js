import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/pages/Home';
import PushUpTracker from './components/pages/PushupTracker';
import ProfilePage from './components/pages/ProfilePage';
import TutorialPage from './components/pages/TutorialPage';

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pushup" element={<PushUpTracker />} />
          <Route path="/ProfilePage" element={<ProfilePage />} />
          <Route path="/tutorials" element={<TutorialPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
