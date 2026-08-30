import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import CollectionPage from './pages/CollectionPage';
import CardDetail from './pages/CardDetail';
import AddCard from './pages/AddCard';

export default function App() {
  return (
    <div id="app-root" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#fff' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/"            element={<Dashboard />} />
          <Route path="/collection"  element={<CollectionPage />} />
          <Route path="/card/:id"    element={<CardDetail />} />
          <Route path="/add"         element={<AddCard />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
