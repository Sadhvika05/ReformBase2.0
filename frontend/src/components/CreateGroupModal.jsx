import React, { useState } from 'react';

const CreateGroupModal = ({ onClose, onSave }) => {
  const [groupName, setGroupName] = useState('');

  const handleSave = () => {
    if (groupName) {
      onSave(groupName);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl mb-4">Create Group</h2>
        <input
          type="text"
          className="w-full px-4 py-2 border rounded-md mb-4"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="Group Name"
        />
        <div className="flex justify-end">
          <button
            className="bg-gray-800 text-white px-4 py-2 rounded-md mr-2 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2"
            onClick={handleSave}
          >
            Save
          </button>
          <button
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupModal;

