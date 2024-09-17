import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/card';
import CardContent from '../components/ui/cardContent';

const HealthCare = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold text-black">Health Care</h1>
          <button className="hover:bg-gray-700 hover:text-white p-2 rounded bg-gray-800 text-white">My Profile</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <Card onClick={() => navigate('/health-care/data-tables')} className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent>
              <h2 className="font-semibold text-lg text-black">DATA TABLES</h2>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent>
              <h2 className="font-semibold text-lg text-black">LITERATURE</h2>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent>
              <h2 className="font-semibold text-lg text-black">FIGURES</h2>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HealthCare;
