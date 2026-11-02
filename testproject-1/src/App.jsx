import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Success from './components/Success';
import Error from './components/Error';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/success" element={<Success />} />
            <Route path="/error" element={<Error />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;