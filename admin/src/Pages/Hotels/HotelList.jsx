import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Trash2, Edit, Plus, Search } from 'lucide-react';
import { Sidebar, AdminHeader } from '../../Components';
import apiInstance from '../../utils/api';
import { setHotels, setLoading, setError } from '../../Store/AdminDataSlice';

const HotelList = () => {
  const dispatch = useDispatch();
  const { hotels, loading } = useSelector((state) => state.adminData);
  const [searchTerm, setSearchTerm] = React.useState('');

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    dispatch(setLoading(true));
    try {
      const response = await apiInstance.get('admin/hotels');
      dispatch(setHotels(response.data || []));
    } catch (err) {
      dispatch(setError('Failed to load hotels'));
      console.error('Hotels error:', err);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const filteredHotels = hotels.filter(
    (hotel) =>
      hotel.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='flex h-screen bg-gray-50'>
      <Sidebar />

      <div className='flex-1 flex flex-col overflow-hidden'>
        <AdminHeader />

        <main className='flex-1 overflow-y-auto p-6'>
          <div className='max-w-7xl mx-auto'>
            {/* Header */}
            <div className='mb-8 flex justify-between items-start'>
              <div>
                <h1 className='text-3xl font-bold text-gray-800'>Hotel Management</h1>
                <p className='text-gray-600 mt-2'>Manage all hotels and bookings.</p>
              </div>
              <button className='flex items-center gap-2 bg-[#6B8E23] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#5a7a1c] transition'>
                <Plus size={20} />
                Add Hotel
              </button>
            </div>

            {/* Search Bar */}
            <div className='mb-6'>
              <div className='relative'>
                <Search className='absolute left-3 top-3 text-gray-400' size={20} />
                <input
                  type='text'
                  placeholder='Search by name or location...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B8E23]'
                />
              </div>
            </div>

            {/* Hotels Table */}
            <div className='bg-white rounded-xl shadow-md overflow-hidden border border-gray-100'>
              <table className='w-full'>
                <thead className='bg-gray-50 border-b border-gray-200'>
                  <tr>
                    <th className='px-6 py-4 text-left text-sm font-semibold text-gray-700'>
                      Hotel Name
                    </th>
                    <th className='px-6 py-4 text-left text-sm font-semibold text-gray-700'>
                      Location
                    </th>
                    <th className='px-6 py-4 text-left text-sm font-semibold text-gray-700'>
                      Price/Night
                    </th>
                    <th className='px-6 py-4 text-left text-sm font-semibold text-gray-700'>
                      Rooms
                    </th>
                    <th className='px-6 py-4 text-left text-sm font-semibold text-gray-700'>
                      Rating
                    </th>
                    <th className='px-6 py-4 text-right text-sm font-semibold text-gray-700'>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-200'>
                  {loading ? (
                    <tr>
                      <td colSpan='6' className='px-6 py-8 text-center text-gray-500'>
                        Loading hotels...
                      </td>
                    </tr>
                  ) : filteredHotels.length === 0 ? (
                    <tr>
                      <td colSpan='6' className='px-6 py-8 text-center text-gray-500'>
                        No hotels found.
                      </td>
                    </tr>
                  ) : (
                    filteredHotels.map((hotel) => (
                      <tr key={hotel._id} className='hover:bg-gray-50 transition'>
                        <td className='px-6 py-4 text-sm text-gray-800 font-medium'>{hotel.name}</td>
                        <td className='px-6 py-4 text-sm text-gray-600'>{hotel.location}</td>
                        <td className='px-6 py-4 text-sm font-semibold text-[#6B8E23]'>
                          ₹{hotel.price}
                        </td>
                        <td className='px-6 py-4 text-sm text-gray-600'>{hotel.rooms || 0}</td>
                        <td className='px-6 py-4 text-sm'>
                          <span className='flex items-center gap-1'>
                            ⭐ {hotel.rating || 'N/A'}
                          </span>
                        </td>
                        <td className='px-6 py-4 text-right'>
                          <button className='p-2 hover:bg-blue-50 rounded-lg transition text-blue-600 mr-2'>
                            <Edit size={18} />
                          </button>
                          <button className='p-2 hover:bg-red-50 rounded-lg transition text-red-600'>
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default HotelList;
