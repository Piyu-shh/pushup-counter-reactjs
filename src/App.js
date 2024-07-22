import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/pages/Home';
import PushUpTracker from './components/pages/PushupTracker';
import ProfilePage from './components/pages/ProfilePage';
import TutorialPage from './components/pages/TutorialPage';
import { AuthContextProvider } from './components/authContext';
import SquatsTracker from './components/pages/SquatsTracker'
import Cards from './components/Cards'
function App() {
  return (
    <>
    <AuthContextProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pushup" element={<PushUpTracker />} />
          <Route path="/ProfilePage" element={<ProfilePage />} />
          <Route path="/tutorials" element={<TutorialPage />} />
          <Route path="/squats" element={<SquatsTracker/>}/>
          <Route path="/cards" element={<Cards/>}/>
        </Routes>
      </Router>
    </AuthContextProvider>
    </>
  );
}

export default App;
