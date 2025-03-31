import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import EmployeeList from './components/EmployeeList';
import AddAdmin from './components/AddAdmin';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import './App.css';

function App() {
  const [token, setToken] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showAddAdmin, setShowAddAdmin] = useState(false);

  useEffect(() => {
    localStorage.removeItem('token');
  }, []);

  const handleLogin = (newToken, username, email) => {
    setToken(newToken);
    setUsername(username);
    setEmail(email);
    localStorage.setItem('token', newToken);
  };

  const handleLogout = () => {
    setToken('');
    setUsername('');
    setEmail('');
    localStorage.removeItem('token');
    setSelectedEmployee(null);
    setShowAddAdmin(false);
  };

  return (
    <Router>
      <div className="App">
        <h1>Admin Dashboard</h1>
        <Routes>
          <Route
            path="/"
            element={
              token ? (
                <>
                  <div className="nav-buttons">
                    <button onClick={() => setShowAddAdmin(false)}>Manage Employees</button>
                    <button onClick={() => setShowAddAdmin(true)}>Add Admin</button>
                    <button onClick={handleLogout}>Logout</button>
                  </div>
                  <p>Logged in as: <strong>{username}</strong> ({email})</p>
                  {showAddAdmin ? (
                    <AddAdmin token={token} />
                  ) : (
                    <EmployeeList token={token} selectedEmployee={selectedEmployee} setSelectedEmployee={setSelectedEmployee} />
                  )}
                </>
              ) : (
                <Login onLogin={handleLogin} />
              )
            }
          />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;