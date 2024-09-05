import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchData, updateData } from '../api/data';
import { useAuth } from '../context/AuthContext';

const DataDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [content, setContent] = useState('');

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await fetchData(id);
        setData(result);
        setContent(JSON.stringify(result.content, null, 2));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    getData();
  }, [id]);

  const handleUpdate = async () => {
    try {
      const updatedData = JSON.parse(content);
      await updateData(id, { content: updatedData });
      navigate('/health-care/data-tables');
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="max-w-7xl w-full bg-white p-6 shadow-md rounded-lg flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold text-gray-800">Data Detail</h1>
          <button onClick={() => navigate('/health-care/data-tables')} className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700">Back</button>
        </div>
        <textarea
          className="w-full h-64 p-4 border rounded-md"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          readOnly={user.role !== 'admin' && user.role !== 'moderator'}
        />
        {(user.role === 'admin' || user.role === 'moderator') && (
          <button onClick={handleUpdate} className="bg-blue-600 text-white px-4 py-2 rounded-md mt-4 hover:bg-blue-700">Save</button>
        )}
      </div>
    </div>
  );
};

export default DataDetail;