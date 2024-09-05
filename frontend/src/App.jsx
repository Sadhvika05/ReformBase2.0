import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import HealthCare from './pages/healthCare';
import DataTables from './pages/DataTables';
import DataDetail from './components/DataDetail';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import TableModal from './pages/TableModal';

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<ProtectedRoute element={<Home />} />} />
        <Route path="/health-care" element={<ProtectedRoute element={<HealthCare />} />} />
        <Route path="/health-care/data-tables" element={<ProtectedRoute element={<DataTables />} />} />
        <Route path="/datatables" element={<TableModal/>}/>
        <Route path="/data/:id" element={<ProtectedRoute element={<DataDetail />} />} />
        {/* Add other routes here */}
      </Routes>
    </AuthProvider>
  );
};

export default App;