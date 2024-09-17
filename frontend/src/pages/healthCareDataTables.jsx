import React from 'react';
import { useNavigate } from 'react-router-dom';

const DataTables = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="max-w-7xl w-full bg-white p-6 shadow-md rounded-lg flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <svg
              onClick={() => navigate('/health-care')}
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 cursor-pointer text-gray-700 hover:text-gray-900"
            >
              <path d="M12 19l-7-7 7-7"></path>
              <path d="M19 12H5"></path>
            </svg>
            <h1 className="text-xl font-semibold text-gray-800">Research Areas</h1>
          </div>
          <div className="flex items-center space-x-4">
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
              className="h-6 w-6 text-gray-700 hover:text-gray-900"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            <button
              className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2"
              onClick={() => navigate('/profile')}
            >
              My Profile
            </button>
          </div>
        </div>
        <div className="flex items-center mb-6">
          {/* <img
            className="h-10 w-10 rounded-full"
            alt="Health Care"
            src="/placeholder.svg?height=100&width=100"
          /> */}
          <h2 className="text-3xl font-bold ml-4 text-gray-800">Health Care</h2>
          <input
            className="ml-auto w-1/3 p-2 border border-gray-300 rounded-md text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent"
            placeholder="Search"
          />
        </div>
        <div className="space-y-4 flex-1 overflow-y-auto">
          {[
            'Global Comparisons',
            'Budgets',
            'Health Profiles',
            'AP & TS',
            'India Health Data'
          ].map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-4 border rounded-lg bg-gray-50 hover:shadow-lg transition-shadow duration-300"
            >
              <span className="text-gray-800">{item}</span>
              <div className="flex space-x-2 text-gray-500">
                <button>
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
                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
                    <path d="M15 5l4 4"></path>
                  </svg>
                </button>
                <button>
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
                    <path d="M5 12h14"></path>
                    <path d="M12 5v14"></path>
                  </svg>
                </button>
                <button>
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
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-6">
          <button
            className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2"
          >
            Create Group
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataTables;
