import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import apiInstance from '../utils/api';
import { loginSuccess, loginFailure } from '../Store/AuthSlice';

const Login = () => {
  const [loginType, setLoginType] = useState('admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = loginType === 'admin' ? 'admin/login' : 'serviceprovider/login';

      const response = await apiInstance.post(endpoint, {
        email,
        password,
      });

      const { token, name, email: userEmail, role } = response.data;

      // Validate role matches login type
      const expectedRole = loginType === 'admin' ? 'ADMIN' : 'SERVICEPROVIDER';
      if (role !== expectedRole) {
        throw new Error(`Invalid credentials. Only ${expectedRole} can login here.`);
      }

      // Normalise role to match ProtectedRoute expectations
      const storedRole = loginType === 'admin' ? 'admin' : 'service_provider';

      dispatch(
        loginSuccess({
          id: null,
          email: userEmail,
          name: name,
          role: storedRole,
          token,
        })
      );

      navigate(storedRole === 'admin' ? '/dashboard' : '/provider');
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Login failed. Please try again.';
      setError(errorMessage);
      dispatch(loginFailure(errorMessage));
    } finally {
      setLoading(false);
    }
  };

  const toggleLoginType = () => {
    setLoginType(loginType === 'admin' ? 'provider' : 'admin');
    setError('');
    setEmail('');
    setPassword('');
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100 px-4'>
      <div className='w-full max-w-md'>
        <div className='bg-white rounded-lg shadow-lg p-8'>
          {/* Header */}
          <div className='text-center mb-8'>
            <h1 className='text-3xl font-semibold'>
              <span className='text-blue-600'>
                {loginType === 'admin' ? 'Admin' : 'Service Provider'}
              </span>
              {' '}
              <span className='text-gray-900'>Login</span>
            </h1>
          </div>

          {/* Error Message */}
          {error && (
            <div className='bg-red-50 border border-red-200 rounded-lg p-3 mb-6 text-sm text-red-600'>
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className='space-y-4'>
            {/* Email */}
            <div>
              <label className='block text-gray-700 text-sm font-medium mb-2'>Email</label>
              <input
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='Enter your email'
                required
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              />
            </div>

            {/* Password */}
            <div>
              <label className='block text-gray-700 text-sm font-medium mb-2'>Password</label>
              <input
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='Enter your password'
                required
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              />
            </div>

            {/* Submit Button */}
            <button
              type='submit'
              disabled={loading}
              className='w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed mt-6'
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {/* Toggle Link */}
          <div className='text-center mt-6'>
            <p className='text-gray-600 text-sm'>
              {loginType === 'admin' ? 'Service Provider Login?' : 'Admin Login?'}{' '}
              <button
                type='button'
                onClick={toggleLoginType}
                className='text-blue-600 font-semibold hover:underline'
              >
                Click here
              </button>
            </p>
          </div>

          {/* Signup Link for Providers */}
          {loginType === 'provider' && (
            <div className='text-center mt-4'>
              <p className='text-gray-600 text-sm'>
                Don't have an account?{' '}
                <Link to='/signup' className='text-blue-600 font-semibold hover:underline'>
                  Sign up here
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;

