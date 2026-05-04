import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Trash2, Edit, Search } from 'lucide-react';
import { Sidebar, AdminHeader } from '../../Components';
import apiInstance from '../../utils/api';
import { setUsers, setLoading, setError } from '../../Store/AdminDataSlice';

const UserList = () => {
  const dispatch = useDispatch();
  const { users, loading } = useSelector((state) => state.adminData);
  const [searchTerm, setSearchTerm] = React.useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    dispatch(setLoading(true));
    try {
      const response = await apiInstance.get('admin/users');
      dispatch(setUsers(response.data || []));
    } catch (err) {
      dispatch(setError('Failed to load users'));
      console.error('Users error:', err);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
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
              <h1 className='text-3xl font-bold text-gray-800'>User Management</h1>
              <p className='text-gray-600 mt-2'>Manage all users on the platform.</p>
            </div>

            {/* Search Bar */}
            <div className='mb-6'>
              <div className='relative'>
                <Search className='absolute left-3 top-3 text-gray-400' size={20} />
                <input
                  type='text'
                  placeholder='Search by name or email...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B8E23]'
                />
              </div>
            </div>

            {/* Users Table */}
            <div className='bg-white rounded-xl shadow-md overflow-hidden border border-gray-100'>
              <table className='w-full'>
                <thead className='bg-gray-50 border-b border-gray-200'>
                  <tr>
                    <th className='px-6 py-4 text-left text-sm font-semibold text-gray-700'>Name</th>
                    <th className='px-6 py-4 text-left text-sm font-semibold text-gray-700'>Email</th>
                    <th className='px-6 py-4 text-left text-sm font-semibold text-gray-700'>Role</th>
                    <th className='px-6 py-4 text-left text-sm font-semibold text-gray-700'>
                      Joined Date
                    </th>
                    <th className='px-6 py-4 text-right text-sm font-semibold text-gray-700'>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-200'>
                  {loading ? (
                    <tr>
                      <td colSpan='5' className='px-6 py-8 text-center text-gray-500'>
                        Loading users...
                      </td>
                    </tr>
                  ) : filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan='5' className='px-6 py-8 text-center text-gray-500'>
                        No users found.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user._id} className='hover:bg-gray-50 transition'>
                        <td className='px-6 py-4 text-sm text-gray-800 font-medium'>{user.name}</td>
                        <td className='px-6 py-4 text-sm text-gray-600'>{user.email}</td>
                        <td className='px-6 py-4 text-sm'>
                          <span className='px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium capitalize'>
                            {user.role || 'user'}
                          </span>
                        </td>
                        <td className='px-6 py-4 text-sm text-gray-600'>
                          {new Date(user.createdAt).toLocaleDateString()}
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

export default UserList;
