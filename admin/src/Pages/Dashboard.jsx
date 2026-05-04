import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Users, Home, TrendingUp, Calendar, BarChart3 } from 'lucide-react';
import { Sidebar, AdminHeader } from '../Components';
import apiInstance from '../utils/api';
import { setAnalytics, setLoading, setError } from '../Store/AdminDataSlice';

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className='bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition'>
    <div className='flex items-start justify-between'>
      <div>
        <p className='text-gray-600 text-sm font-medium'>{label}</p>
        <p className='text-3xl font-bold text-gray-800 mt-2'>{value}</p>
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon size={24} className='text-white' />
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const dispatch = useDispatch();
  const { analytics, loading } = useSelector((state) => state.adminData);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    dispatch(setLoading(true));
    try {
      const response = await apiInstance.get('admin/analytics');
      dispatch(setAnalytics(response.data || analytics));
    } catch (err) {
      dispatch(setError('Failed to load analytics'));
      console.error('Analytics error:', err);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className='flex h-screen bg-gray-50'>
      <Sidebar />

      <div className='flex-1 flex flex-col overflow-hidden md:ml-0'>
        <AdminHeader />

        {/* Main Content */}
        <main className='flex-1 overflow-y-auto p-6'>
          <div className='max-w-7xl mx-auto'>
            {/* Header */}
            <div className='mb-8'>
              <h1 className='text-3xl font-bold text-gray-800'>Admin Dashboard</h1>
              <p className='text-gray-600 mt-2'>Welcome back! Here's your platform overview.</p>
            </div>

            {/* Stats Grid */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
              <StatCard
                icon={Users}
                label='Total Users'
                value={analytics.totalUsers || 0}
                color='bg-blue-500'
              />
              <StatCard
                icon={Home}
                label='Active Providers'
                value={analytics.activeProviders || 0}
                color='bg-green-500'
              />
              <StatCard
                icon={Calendar}
                label='Total Bookings'
                value={analytics.totalBookings || 0}
                color='bg-purple-500'
              />
              <StatCard
                icon={TrendingUp}
                label='Total Revenue'
                value={`₹${analytics.totalRevenue?.toLocaleString() || 0}`}
                color='bg-orange-500'
              />
            </div>

            {/* Quick Actions */}
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
              <div className='lg:col-span-2 bg-white rounded-xl p-6 shadow-md border border-gray-100'>
                <h2 className='text-xl font-bold text-gray-800 mb-4'>Recent Activity</h2>
                <div className='space-y-4'>
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className='flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition'
                    >
                      <div className='w-2 h-2 bg-[#6B8E23] rounded-full'></div>
                      <div className='flex-1'>
                        <p className='text-sm font-medium text-gray-800'>
                          Sample activity event {i + 1}
                        </p>
                        <p className='text-xs text-gray-500'>2 hours ago</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className='bg-white rounded-xl p-6 shadow-md border border-gray-100'>
                <h2 className='text-xl font-bold text-gray-800 mb-4'>Quick Links</h2>
                <div className='space-y-3'>
                  <a
                    href='/users'
                    className='flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition text-gray-700 font-medium'
                  >
                    <Users size={20} className='text-[#6B8E23]' />
                    Manage Users
                  </a>
                  <a
                    href='/hotels'
                    className='flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition text-gray-700 font-medium'
                  >
                    <Home size={20} className='text-[#6B8E23]' />
                    Manage Hotels
                  </a>
                  <a
                    href='/analytics'
                    className='flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition text-gray-700 font-medium'
                  >
                    <BarChart3 size={20} className='text-[#6B8E23]' />
                    View Analytics
                  </a>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
