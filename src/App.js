import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';
import Home from './components/pages/Home'
import PushUpTracker from './components/pages/PushupTracker'
import ProfilePage from './components/pages/ProfilePage'
function App() {
  return (
    <>
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" exact Component={Home}/>
        <Route path="/pushup" element={<PushUpTracker/>} />
        <Route path="/ProfilePage" element={<ProfilePage/>} />
      </Routes>
    </Router>
    </>
  );
}

export default App;