import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import CreateGroupModal from '../components/CreateGroupModal';
import RenameGroupModal from '../components/RenameGroupModal';  // Fixed import name
import GroupTables from '../components/GroupTables';
//import Import from '../components/Import';  // Import the Import component

const DataTables = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [showRenameGroupModal, setShowRenameGroupModal] = useState(false);
  const [showTableModal, setShowTableModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);  // State for Import Modal

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await axios.get('/data');
      setGroups(response.data);
    } catch (error) {
      console.error('Error fetching groups:', error);
    }
  };

  const handleCreateGroup = async (groupName) => {
    try {
      await axios.post('/data', { name: groupName });
      setShowCreateGroupModal(false);
      fetchGroups();
    } catch (error) {
      console.error('Error creating group:', error);
    }
  };

  const handleRenameGroup = async (groupId, newName) => {
    try {
      await axios.put(`/data/${groupId}`, { name: newName });
      setShowRenameGroupModal(false);
      fetchGroups();
    } catch (error) {
      console.error('Error renaming group:', error);
    }
  };

  const handleDeleteGroup = async (groupId) => {
    try {
      await axios.delete(`/data/${groupId}`);
      fetchGroups();
    } catch (error) {
      console.error('Error deleting group:', error);
    }
  };

  const handleTableModal = (group) => {
    setSelectedGroup(group);
    setShowTableModal(true);
  };

  // const handleImportModal = () => {
  //   setShowImportModal(true);
  // };

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
          <h2 className="text-3xl font-bold ml-4 text-gray-800">Health Care</h2>
          <input
            className="ml-auto w-1/3 p-2 border border-gray-300 rounded-md text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent"
            placeholder="Search"
          />
        </div>
        <div className="space-y-4 flex-1 overflow-y-auto">
          {groups.map((group) => (
            <div key={group._id} className="border rounded-lg p-4 bg-gray-50">
              <div className="flex justify-between items-center">
                <span className="text-xl font-semibold">{group.name}</span>
                <div className="flex space-x-2 text-gray-500">
                  {(user.role === 'admin' || user.role === 'moderator') && (
                    <button onClick={() => navigate(`/healthprofile/${encodeURIComponent(group.name)}/tables`)}>
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
                  )}
                  <button onClick={() => setShowRenameGroupModal(true)}>
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
                  {(user.role === 'admin' || user.role === 'moderator') && (
                    <button onClick={() => handleDeleteGroup(group._id)}>
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
                        <path d="M10 11v6"></path>
                        <path d="M14 11v6"></path>
                      </svg>
                    </button>
                  )}
                </div>
              </div>
              <GroupTables group={group} />
            </div>
          ))}
        </div>
        {(user.role === 'admin' || user.role === 'moderator') && (
          <div className="flex justify-end mt-6">
            <button
              className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2"
              onClick={() => setShowCreateGroupModal(true)}
            >
              Create Group
            </button>
          </div>
        )}
      </div>

      {showCreateGroupModal && (
        <CreateGroupModal
          onClose={() => setShowCreateGroupModal(false)}
          onSave={handleCreateGroup}
        />
      )}

      {showRenameGroupModal && selectedGroup && (
        <RenameGroupModal
          group={selectedGroup}
          onClose={() => setShowRenameGroupModal(false)}
          onSave={handleRenameGroup}
        />
      )}

      {showTableModal && selectedGroup && (
        <TableModal
          group={selectedGroup}
          onClose={() => setShowTableModal(false)}
        />
      )}

      {showImportModal && (
        <Import
          onClose={() => setShowImportModal(false)}
        />
      )}
    </div>
  );
};

export default DataTables;
