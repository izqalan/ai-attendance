/* eslint-disable import/no-named-as-default */
/* eslint-disable import/no-named-as-default-member */
import React from 'react';
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PrivateRoute from './routes/PrivateRoute';
import Login from './features/auth/Login';
import SignUp from './features/auth/SignUp';
// import { supabase } from './supabase';
import Dashboard from './features/dashboard';
import ResetPassword from './features/dashboard/ResetPassword';
import { selectAuthData } from './features/auth/authSlice';
import './styles/main.css';

const App = function app() {
  // const auth = supabase.auth.session();
  const auth = useSelector(selectAuthData);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route
            exact
            path="/login"
            element={<Login />}
          />
          <Route
            exact
            path="/register"
            element={<SignUp />}
          />
          <Route
            exact
            path="/"
            element={(
              <PrivateRoute
                component={Dashboard}
                auth={auth}
              />
            )}
          />
          <Route
            path="/change-password"
            element={<ResetPassword />}
          />
          <Route
            path="/dashboard"
            element={(
              <PrivateRoute
                component={Dashboard}
                auth={auth}
              />
            )}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
