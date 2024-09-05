import axios from './axios';

// Fetch all data
export const fetchData = async () => {
  try {
    const response = await axios.get('/data');
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

// Create new data
export const createData = async (data) => {
  try {
    const response = await axios.post('/data', data);
    return response.data;
  } catch (error) {
    console.error('Error creating data:', error);
    throw error;
  }
};

// Update data
export const updateData = async (id, data) => {
  try {
    const response = await axios.put(`/data/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating data:', error);
    throw error;
  }
};

// Delete data
export const deleteData = async (id) => {
  try {
    const response = await axios.delete(`/data/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting data:', error);
    throw error;
  }
};