import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './features/auth/Login';

const App = function app() {
  return (
    <div className="App">
      Routes
      <Router>
        <Routes>
          <Route
            exact
            path="/login"
            element={<Login />}
          />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
