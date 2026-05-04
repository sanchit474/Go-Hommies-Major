import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Home, Calendar, TrendingUp, Plus } from 'lucide-react';
import { Sidebar, AdminHeader } from '../../Components';
import apiInstance from '../../utils/api';
import { setAnalytics, setLoading, setError } from '../../Store/AdminDataSlice';

const ProviderDashboard = () => {
  const dispatch = useDispatch();
  const { analytics, loading } = useSelector((state) => state.adminData);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    fetchProviderDashboard();
  }, []);

  const fetchProviderDashboard = async () => {
    dispatch(setLoading(true));
    try {
      const response = await apiInstance.get('serviceprovider/dashboard');
      dispatch(setAnalytics(response.data || analytics));
    } catch (err) {
      dispatch(setError('Failed to load dashboard'));
      console.error('Dashboard error:', err);
    } finally {
      dispatch(setLoading(false));
    }
  };

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

  return (
    <div className='flex h-screen bg-gray-50'>
      <Sidebar />

      <div className='flex-1 flex flex-col overflow-hidden'>
        <AdminHeader />

        <main className='flex-1 overflow-y-auto p-6'>
          <div className='max-w-7xl mx-auto'>
            {/* Header */}
            <div className='mb-8'>
              <h1 className='text-3xl font-bold text-gray-800'>Service Provider Dashboard</h1>
              <p className='text-gray-600 mt-2'>Manage your properties and bookings.</p>
            </div>

            {/* Stats Grid */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
              <StatCard
                icon={Home}
                label='My Properties'
                value={analytics.properties || 0}
                color='bg-blue-500'
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
              {/* Properties */}
              <div className='lg:col-span-2 bg-white rounded-xl p-6 shadow-md border border-gray-100'>
                <div className='flex justify-between items-center mb-6'>
                  <h2 className='text-xl font-bold text-gray-800'>My Properties</h2>
                  <button className='flex items-center gap-2 bg-[#6B8E23] text-white px-4 py-2 rounded-lg font-bold hover:bg-[#5a7a1c] transition text-sm'>
                    <Plus size={18} />
                    Add Property
                  </button>
                </div>
                <div className='space-y-4'>
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className='flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition'>
                      <div className='w-16 h-16 bg-gradient-to-br from-[#6B8E23] to-[#5a7a1c] rounded-lg'></div>
                      <div className='flex-1'>
                        <p className='text-sm font-medium text-gray-800'>Property {i + 1}</p>
                        <p className='text-xs text-gray-500'>Location • 5 rooms</p>
                      </div>
                      <div className='text-right'>
                        <p className='text-sm font-bold text-gray-800'>₹5,500/night</p>
                        <p className='text-xs text-green-600'>Active</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Bookings */}
              <div className='bg-white rounded-xl p-6 shadow-md border border-gray-100'>
                <h2 className='text-xl font-bold text-gray-800 mb-4'>Recent Bookings</h2>
                <div className='space-y-3'>
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className='p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition'>
                      <p className='text-sm font-medium text-gray-800'>Booking {i + 1}</p>
                      <p className='text-xs text-gray-500 mt-1'>Guest • 2 nights</p>
                      <p className='text-xs text-[#6B8E23] font-bold mt-2'>₹11,000</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Performance Summary */}
            <div className='bg-white rounded-xl p-6 shadow-md border border-gray-100 mt-6'>
              <h2 className='text-lg font-bold text-gray-800 mb-4'>Performance This Month</h2>
              <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                <div>
                  <p className='text-gray-600 text-sm'>Occupancy Rate</p>
                  <p className='text-2xl font-bold text-[#6B8E23] mt-1'>85%</p>
                </div>
                <div>
                  <p className='text-gray-600 text-sm'>Avg. Rating</p>
                  <p className='text-2xl font-bold text-yellow-500 mt-1'>4.8⭐</p>
                </div>
                <div>
                  <p className='text-gray-600 text-sm'>Month Revenue</p>
                  <p className='text-2xl font-bold text-blue-600 mt-1'>₹1.2L</p>
                </div>
                <div>
                  <p className='text-gray-600 text-sm'>Response Rate</p>
                  <p className='text-2xl font-bold text-green-600 mt-1'>100%</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProviderDashboard;
