import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import EmployeeList from './components/EmployeeList';
import AddAdmin from './components/AddAdmin';
import './App.css';

function App() {
  const [token, setToken] = useState('');
  const [username, setUsername] = useState(''); // New state for username
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showAddAdmin, setShowAddAdmin] = useState(false);

  useEffect(() => {
    // Clear token on initial load to ensure manual login
    localStorage.removeItem('token');
  }, []);

  const handleLogin = (newToken, username) => {
    setToken(newToken);
    setUsername(username); // Store the username
    localStorage.setItem('token', newToken);
  };

  const handleLogout = () => {
    setToken('');
    setUsername(''); // Clear username on logout
    localStorage.removeItem('token');
    setSelectedEmployee(null);
    setShowAddAdmin(false);
  };

  return (
    <div className="App">
      <h1>Admin Dashboard</h1>
      {token ? (
        <>
          <div className="nav-buttons">
            <button onClick={() => setShowAddAdmin(false)}>Manage Employees</button>
            <button onClick={() => setShowAddAdmin(true)}>Add Admin</button>
            <button onClick={handleLogout}>Logout</button>
          </div>
          <p>Logged in as: <strong>{username}</strong></p> {/* Display username */}
          {showAddAdmin ? (
            <AddAdmin token={token} />
          ) : (
            <EmployeeList token={token} selectedEmployee={selectedEmployee} setSelectedEmployee={setSelectedEmployee} />
          )}
        </>
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;