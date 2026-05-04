import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LogOut, Bell, Settings } from 'lucide-react';
import { logout } from '../Store/AuthSlice';

const AdminHeader = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className='bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40'>
      <div className='flex justify-between items-center px-6 py-4'>
        <div>
          <h2 className='text-xl font-semibold text-gray-800'>GoHomies Admin</h2>
          <p className='text-xs text-gray-500 capitalize'>{user.role?.replace('_', ' ')}</p>
        </div>

        <div className='flex items-center gap-6'>
          <button className='p-2 hover:bg-gray-100 rounded-lg transition'>
            <Bell size={20} className='text-gray-600' />
          </button>
          <button className='p-2 hover:bg-gray-100 rounded-lg transition'>
            <Settings size={20} className='text-gray-600' />
          </button>
          <div className='w-8 h-8 bg-[#6B8E23] rounded-full flex items-center justify-center text-white font-bold'>
            {user.name?.charAt(0).toUpperCase() || 'A'}
          </div>
          <button
            onClick={handleLogout}
            className='flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition text-sm font-medium'
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
