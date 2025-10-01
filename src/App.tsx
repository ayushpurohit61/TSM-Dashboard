import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import FleetPage from './pages/FleetPage';
 

function App() {
  return (
    <Router>
      <div className="flex">
        <Sidebar activeTab="transporters" setActiveTab={() => {}} />
        <div className="flex-1">
          <Routes>
            <Route path="/fleet" element={<FleetPage />} />
            {/* Add other routes here */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
