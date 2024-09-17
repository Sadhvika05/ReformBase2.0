import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios'; // Import the axios instance

const RegisterPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();  // We can use the login function after registering
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/auth/register', {
        email,
        username,
        password,
        role,
      });
      if (response.status === 201) {
        // Automatically log in the user after registration
        const loginResponse = await axios.post('/auth/login', {
          email,
          password,
        });
        login(loginResponse.data.token); // Pass the token received from the API
        navigate('/');
      } else {
        console.error('Registration failed:', response.data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6">Register</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Username</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-md"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-md"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700">Role</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-md"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
