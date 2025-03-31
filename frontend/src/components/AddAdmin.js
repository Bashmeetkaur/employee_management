import React, { useState } from 'react';
import axios from 'axios';

function AddAdmin({ token }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState(''); // New email state
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        'http://localhost:5000/api/auth/register',
        { username, email, password },
        { headers: { 'x-auth-token': token } }
      );
      setSuccess('Admin added successfully');
      setError('');
      setUsername('');
      setEmail(''); // Clear email field
      setPassword('');
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to add admin');
      setSuccess('');
    }
  };

  return (
    <div>
      <h2>Add Admin</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Add Admin</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  );
}

export default AddAdmin;