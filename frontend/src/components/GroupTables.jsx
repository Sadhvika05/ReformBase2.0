import React, { useState, useEffect } from 'react';
import axios from '../api/axios';

const GroupTables = ({ group }) => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const response = await axios.get(`/data/${group._id}/tables`);
      if (Array.isArray(response.data.tables)) {
        setTables(response.data.tables);
      } else {
        console.error('Error: Data fetched is not an array');
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tables:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4 flex-1 overflow-y-auto">
      {tables.map((table) => (
        <div key={table._id} className="border rounded-lg p-4 bg-gray-50">
          <div className="flex justify-between items-center">
            <span className="text-xl font-semibold">{table.name}</span>
            <div className="flex space-x-2 text-gray-500">
              <button onClick={() => { /* handle edit table */ }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5 hover:text-gray-700"
                >
                  <path d="M12 20h9"></path>
                  <path d="M16.5 3.5l4 4L7 21l-4.5 1.5L5 17z"></path>
                </svg>
              </button>
              <button onClick={() => { /* handle delete table */ }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5 hover:text-gray-700"
                >
                  <path d="M3 6h18"></path>
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GroupTables;
