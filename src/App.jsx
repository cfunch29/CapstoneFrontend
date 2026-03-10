import './App.css';
import { Routes, Route } from 'react-router-dom';
import Auth from './pages/auth/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Navbar from './components/navbar/Navbar.jsx';
import ProtectedRoutes from "./components/ProtectedRoutes.jsx"
import Transactions from './pages/Transactions.jsx';
import Registration from './pages/Registration.jsx';

function App() {

  return (
    <>
    <Navbar />
    <h2>MOOLAH</h2>
     <Routes>
      <Route path='/auth' element={<Auth />} />
      <Route element={<ProtectedRoutes />}>
      <Route path='/dashboard' element={<Dashboard />} />
  
      <Route path='/registration' element={<Registration />} />
     
      <Route path='/transactions' element={<Transactions />} />
     </Route>
     </Routes>
    </>
  );
}

export default App
