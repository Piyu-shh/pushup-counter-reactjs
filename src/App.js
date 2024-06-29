import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';
import Home from './components/pages/Home'
import PushUpTracker from './components/pages/PushupTracker'
function App() {
  return (
    <>
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" exact Component={Home}/>
        <Route path="/pushup" element={<PushUpTracker/>} />
      </Routes>
    </Router>
    </>
  );
}

export default App;