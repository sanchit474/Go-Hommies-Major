import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Home } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 p-4'>
      <div className='text-center'>
        <AlertCircle size={80} className='mx-auto text-red-500 mb-4' />
        <h1 className='text-4xl font-bold text-gray-800 mb-2'>Access Denied</h1>
        <p className='text-gray-600 mb-8 max-w-md'>
          You don't have permission to access this resource. Please log in with the correct role.
        </p>
        <button
          onClick={() => navigate('/login')}
          className='inline-flex items-center gap-2 bg-[#6B8E23] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#5a7a1c] transition'
        >
          <Home size={20} />
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default NotFound;
