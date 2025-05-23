import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FakeAuth from './FakeAuth';
import TodayPlanDemo from './TodayPlanDemo';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FakeAuth />} />
        <Route path="/today" element={<TodayPlanDemo />} />
      </Routes>
    </Router>
  );
}

export default App;