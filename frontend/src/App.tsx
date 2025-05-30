import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Reserva from './pages/Reserva';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/Reserva" element={<Reserva />} />
    </Routes>
  );
}

export default App;
