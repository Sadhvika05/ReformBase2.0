import React from 'react';
import Modal from 'react-modal';
import { useAuth } from '../context/AuthContext';

Modal.setAppElement('#root');

const ProfileModal = ({ isOpen, onRequestClose }) => {
  const { user } = useAuth();

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="modal"
      overlayClassName="overlay"
    >
      <h2 className="text-2xl font-semibold mb-4">My Profile</h2>
      <div className="flex items-center mb-4">
        <img
          src="https://via.placeholder.com/150"
          alt="User Avatar"
          className="w-16 h-16 rounded-full mr-4"
        />
        <div>
          <p className="text-lg font-semibold">{user ? user.username : 'Loading...'}</p>
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Name</label>
        <p>{user ? user.username : ''}</p>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Email</label>
        <p>{user ? user.email : ''}</p>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Role</label>
        <p>{user ? user.role : ''}</p>
      </div>
      <button
        onClick={onRequestClose}
        className="bg-gray-800 text-white px-4 py-2 rounded mt-4"
      >
        Close
      </button>
    </Modal>
  );
};

export default ProfileModal;