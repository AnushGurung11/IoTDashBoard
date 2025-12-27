import './index.css';
import NavBar from './components/NavBar'; 
import CurrentData from './components/CurrentData';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AllRecords from './pages/AllRecords';

function App() {
    return (
        <>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/allrecords" element={<AllRecords />} />
        </Routes>
        </>
            )
}

export default App
