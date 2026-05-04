import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Home, Calendar, TrendingUp, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Sidebar, AdminHeader } from '../../Components';
import apiInstance from '../../utils/api';

const ProviderDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyHotels();
  }, []);

  const fetchMyHotels = async () => {
    setLoading(true);
    try {
      const res = await apiInstance.get('hotels/my');
      setHotels(res.data || []);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Derive stats from real hotel data
  const totalProperties = hotels.length;
  const totalRevenue = hotels.reduce((sum, h) => sum + (Number(h.pricePerNight) || 0), 0);

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
              <p className='text-gray-600 mt-2'>
                Welcome back, <span className='font-semibold text-[#6B8E23]'>{user.name || 'Provider'}</span>. Manage your properties and bookings.
              </p>
            </div>

            {/* Stats Grid */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
              <StatCard
                icon={Home}
                label='My Properties'
                value={loading ? '...' : totalProperties}
                color='bg-blue-500'
              />
              <StatCard
                icon={Calendar}
                label='Total Bookings'
                value={0}
                color='bg-purple-500'
              />
              <StatCard
                icon={TrendingUp}
                label='Listed Revenue Potential'
                value={loading ? '...' : `₹${totalRevenue.toLocaleString()}`}
                color='bg-orange-500'
              />
            </div>

            {/* Properties + Bookings */}
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>

              {/* My Properties */}
              <div className='lg:col-span-2 bg-white rounded-xl p-6 shadow-md border border-gray-100'>
                <div className='flex justify-between items-center mb-6'>
                  <h2 className='text-xl font-bold text-gray-800'>My Properties</h2>
                  <Link
                    to='/provider/listings'
                    className='flex items-center gap-2 bg-[#6B8E23] text-white px-4 py-2 rounded-lg font-bold hover:bg-[#5a7a1c] transition text-sm'
                  >
                    <Plus size={18} />
                    Add Property
                  </Link>
                </div>

                {loading ? (
                  <div className='flex justify-center py-10'>
                    <div className='w-8 h-8 border-4 border-[#6B8E23] border-t-transparent rounded-full animate-spin' />
                  </div>
                ) : hotels.length === 0 ? (
                  <div className='text-center py-10'>
                    <Home size={40} className='text-gray-300 mx-auto mb-3' />
                    <p className='text-gray-500 text-sm'>No properties yet.</p>
                    <Link
                      to='/provider/listings'
                      className='inline-block mt-3 text-[#6B8E23] font-semibold text-sm hover:underline'
                    >
                      Add your first hotel →
                    </Link>
                  </div>
                ) : (
                  <div className='space-y-3'>
                    {hotels.slice(0, 5).map((hotel) => (
                      <div
                        key={hotel.id}
                        className='flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition'
                      >
                        <div className='w-14 h-14 bg-gradient-to-br from-[#6B8E23] to-[#5a7a1c] rounded-lg flex items-center justify-center shrink-0'>
                          <Home size={22} className='text-white' />
                        </div>
                        <div className='flex-1 min-w-0'>
                          <p className='text-sm font-semibold text-gray-800 truncate'>{hotel.name}</p>
                          <p className='text-xs text-gray-500 truncate'>{hotel.location} • {hotel.totalSeats} rooms</p>
                        </div>
                        <div className='text-right shrink-0'>
                          <p className='text-sm font-bold text-gray-800'>₹{Number(hotel.pricePerNight).toLocaleString()}/night</p>
                          <p className={`text-xs font-semibold ${hotel.isActive ? 'text-green-600' : 'text-gray-400'}`}>
                            {hotel.isActive ? 'Active' : 'Inactive'}
                          </p>
                        </div>
                      </div>
                    ))}
                    {hotels.length > 5 && (
                      <Link
                        to='/provider/listings'
                        className='block text-center text-sm text-[#6B8E23] font-semibold hover:underline pt-2'
                      >
                        View all {hotels.length} properties →
                      </Link>
                    )}
                  </div>
                )}
              </div>

              {/* Recent Bookings placeholder */}
              <div className='bg-white rounded-xl p-6 shadow-md border border-gray-100'>
                <h2 className='text-xl font-bold text-gray-800 mb-4'>Recent Bookings</h2>
                <div className='flex flex-col items-center justify-center py-10 text-center'>
                  <Calendar size={36} className='text-gray-300 mb-3' />
                  <p className='text-gray-500 text-sm'>No bookings yet.</p>
                  <p className='text-gray-400 text-xs mt-1'>Bookings will appear here once travellers book your hotels.</p>
                </div>
              </div>
            </div>

            {/* Performance Summary */}
            <div className='bg-white rounded-xl p-6 shadow-md border border-gray-100 mt-6'>
              <h2 className='text-lg font-bold text-gray-800 mb-4'>Quick Stats</h2>
              <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                <div>
                  <p className='text-gray-500 text-sm'>Active Hotels</p>
                  <p className='text-2xl font-bold text-[#6B8E23] mt-1'>
                    {loading ? '...' : hotels.filter((h) => h.isActive).length}
                  </p>
                </div>
                <div>
                  <p className='text-gray-500 text-sm'>Total Rooms</p>
                  <p className='text-2xl font-bold text-blue-600 mt-1'>
                    {loading ? '...' : hotels.reduce((s, h) => s + (h.totalSeats || 0), 0)}
                  </p>
                </div>
                <div>
                  <p className='text-gray-500 text-sm'>Available Rooms</p>
                  <p className='text-2xl font-bold text-purple-600 mt-1'>
                    {loading ? '...' : hotels.reduce((s, h) => s + (h.availableSeats ?? h.totalSeats ?? 0), 0)}
                  </p>
                </div>
                <div>
                  <p className='text-gray-500 text-sm'>Avg. Price/Night</p>
                  <p className='text-2xl font-bold text-orange-500 mt-1'>
                    {loading || hotels.length === 0
                      ? '₹0'
                      : `₹${Math.round(hotels.reduce((s, h) => s + Number(h.pricePerNight || 0), 0) / hotels.length).toLocaleString()}`}
                  </p>
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
