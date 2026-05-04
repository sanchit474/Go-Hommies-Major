import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LayoutDashboard, Users, Home, BarChart3, Calendar } from 'lucide-react';
import { MENU_ITEMS } from '../utils/constants';

const iconMap = {
  LayoutDashboard,
  Users,
  Home,
  BarChart3,
  Calendar,
};

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  const menuItems = MENU_ITEMS[user.role] || [];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='md:hidden fixed bottom-6 right-6 bg-[#6B8E23] text-white p-3 rounded-full shadow-lg z-50'
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 shadow-md transform transition-transform duration-300 pt-4 z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:relative md:shadow-none`}
      >
        <div className='px-6 py-4 border-b border-gray-200'>
          <h1 className='text-2xl font-bold text-[#6B8E23]'>GoHomies</h1>
          <p className='text-xs text-gray-500 mt-1 capitalize'>{user.role?.replace('_', ' ')} Panel</p>
        </div>

        <nav className='flex-1 px-4 py-6 space-y-2'>
          {menuItems.map((item) => {
            const Icon = iconMap[item.icon];
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition font-medium ${
                  isActive(item.path)
                    ? 'bg-[#6B8E23] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {Icon && <Icon size={20} />}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className='px-4 py-4 border-t border-gray-200 text-xs text-gray-500'>
          <p>v1.0.0</p>
          <p>© 2024 GoHomies</p>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className='fixed inset-0 bg-black bg-opacity-30 md:hidden z-30'
        />
      )}
    </>
  );
};

export default Sidebar;
