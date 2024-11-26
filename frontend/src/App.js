// frontend/src/App.js

import { Routes, Route } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<div className="p-4">댄스 아카데미에 오신 것을 환영합니다!</div>} />
      </Routes>
    </div>
  );
}

export default App;