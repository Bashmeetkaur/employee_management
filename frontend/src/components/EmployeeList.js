/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function EmployeeList({ token, selectedEmployee, setSelectedEmployee }) {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'developer'
  });
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/employees', {
        headers: { 'x-auth-token': token }
      });
      setEmployees(res.data);
    } catch (err) {
      setError('Failed to fetch employees. Please try again.');
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing && selectedEmployee) {
        await axios.put(`http://localhost:5000/api/employees/${selectedEmployee._id}`, formData, {
          headers: { 'x-auth-token': token }
        });
      } else {
        await axios.post('http://localhost:5000/api/employees', formData, {
          headers: { 'x-auth-token': token }
        });
      }
      fetchEmployees();
      setFormData({ name: '', email: '', role: 'developer' });
      setIsEditing(false);
      setSelectedEmployee(null);
      setError('');
    } catch (err) {
      setError(err.response?.data?.errors?.[0]?.msg || 'Failed to save employee. Please check your input.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await axios.delete(`http://localhost:5000/api/employees/${id}`, {
          headers: { 'x-auth-token': token }
        });
        fetchEmployees();
        setError('');
      } catch (err) {
        setError('Failed to delete employee.');
      }
    }
  };

  const handleUpdate = (employee) => {
    setFormData({
      name: employee.name,
      email: employee.email,
      role: employee.role
    });
    setSelectedEmployee(employee);
    setIsEditing(true);
  };

  return (
    <div>
      <h2>Employees</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
        <select name="role" value={formData.role} onChange={handleInputChange} required>
          <option value="developer">Developer</option>
          <option value="manager">Manager</option>
          <option value="designer">Designer</option>
          <option value="other">Other</option>
        </select>
        <button type="submit">{isEditing ? 'Update Employee' : 'Add Employee'}</button>
        {isEditing && <button type="button" onClick={() => { setIsEditing(false); setSelectedEmployee(null); setFormData({ name: '', email: '', role: 'developer' }); }}>Cancel</button>}
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <h1>List of Employees</h1>
      <ul>
        {employees.map((emp) => (
          <li key={emp._id}>
            {emp.name} ({emp.email}) - {emp.role}
            {emp.lastUpdatedBy && <span> (Last updated by: {emp.lastUpdatedBy.username})</span>}
            <button onClick={() => handleUpdate(emp)}>Update</button>
            <button onClick={() => handleDelete(emp._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default EmployeeList;