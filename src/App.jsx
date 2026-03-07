import './App.css';
import { Routes, Route } from 'react-router-dom';
import Auth from './pages/auth/Login';
import Dashboard from './pages/Dashboard';
import Navbar from './components/navbar/Navbar.jsx';

function App() {

  return (
    <>
    <Navbar />
    <h2>MOOLAH</h2>
     <Routes>
      <Route path='/auth' element={<Auth />} />
      <Route element={<ProtectedRoutes />}>
      <Route path='/dashboard' element={<Dashboard />} />
     </Route>
     </Routes>
    </>
  );
}

export default App
