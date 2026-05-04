import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import apiInstance from '../utils/api';
import { loginSuccess, loginFailure } from '../Store/AuthSlice';

const Signup = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    businessName: '',
    phone: '',
    businessType: 'hotel',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const validateStep1 = () => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!formData.email.includes('@')) {
      setError('Invalid email format');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.businessName.trim()) {
      setError('Business name is required');
      return false;
    }
    if (!formData.phone.trim()) {
      setError('Phone number is required');
      return false;
    }
    if (formData.phone.length < 10) {
      setError('Invalid phone number');
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!validateStep2()) return;

    setLoading(true);
    setError('');

    try {
      const response = await apiInstance.post('serviceprovider/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      const { token, name, email: userEmail, role } = response.data;

      // Verify the response contains necessary fields
      if (!token || !role) {
        throw new Error('Registration successful but login failed. Please login manually.');
      }

      dispatch(
        loginSuccess({
          id: null,
          email: userEmail,
          name: name,
          role: 'service_provider',
          token,
        })
      );

      navigate('/provider');
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Signup failed. Please try again.';
      setError(errorMessage);
      dispatch(loginFailure(errorMessage));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8'>
      <div className='w-full max-w-md'>
        <div className='bg-white rounded-lg shadow-lg p-8'>
          {/* Header */}
          <div className='text-center mb-8'>
            <h1 className='text-3xl font-semibold'>
              <span className='text-blue-600'>Service Provider</span>
              {' '}
              <span className='text-gray-900'>Signup</span>
            </h1>
            <p className='text-gray-500 text-sm mt-2'>Step {step} of 2</p>
          </div>

          {/* Progress Bar */}
          <div className='mb-8 flex gap-2'>
            <div
              className={`h-1 flex-1 rounded-full transition ${
                step >= 1 ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            />
            <div
              className={`h-1 flex-1 rounded-full transition ${
                step >= 2 ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className='bg-red-50 border border-red-200 rounded-lg p-3 mb-6 text-sm text-red-600'>
              {error}
            </div>
          )}

          {/* Step 1: Personal Details */}
          {step === 1 && (
            <form className='space-y-4'>
              {/* Full Name */}
              <div>
                <label className='block text-gray-700 text-sm font-medium mb-2'>Full Name</label>
                <input
                  type='text'
                  name='name'
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder='Enter your full name'
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                />
              </div>

              {/* Email */}
              <div>
                <label className='block text-gray-700 text-sm font-medium mb-2'>Email</label>
                <input
                  type='email'
                  name='email'
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder='Enter your email'
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                />
              </div>

              {/* Password */}
              <div>
                <label className='block text-gray-700 text-sm font-medium mb-2'>Password</label>
                <input
                  type='password'
                  name='password'
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder='At least 6 characters'
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label className='block text-gray-700 text-sm font-medium mb-2'>Confirm Password</label>
                <input
                  type='password'
                  name='confirmPassword'
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder='Confirm your password'
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                />
              </div>

              {/* Next Button */}
              <button
                type='button'
                onClick={handleNextStep}
                className='w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition mt-6'
              >
                Next
              </button>

              {/* Login Link */}
              <p className='text-center text-gray-600 text-sm mt-4'>
                Already have an account?{' '}
                <Link to='/login' className='text-blue-600 font-semibold hover:underline'>
                  Login here
                </Link>
              </p>
            </form>
          )}

          {/* Step 2: Business Details */}
          {step === 2 && (
            <form onSubmit={handleSignup} className='space-y-4'>
              {/* Business Name */}
              <div>
                <label className='block text-gray-700 text-sm font-medium mb-2'>Business Name</label>
                <input
                  type='text'
                  name='businessName'
                  value={formData.businessName}
                  onChange={handleInputChange}
                  placeholder='Enter your business name'
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className='block text-gray-700 text-sm font-medium mb-2'>Phone Number</label>
                <input
                  type='tel'
                  name='phone'
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder='+91 XXXXXXXXXX'
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                />
              </div>

              {/* Business Type */}
              <div>
                <label className='block text-gray-700 text-sm font-medium mb-2'>Business Type</label>
                <select
                  name='businessType'
                  value={formData.businessType}
                  onChange={handleInputChange}
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                >
                  <option value='hotel'>Hotel</option>
                  <option value='resort'>Resort</option>
                  <option value='guesthouse'>Guest House</option>
                  <option value='homestay'>Homestay</option>
                  <option value='airbnb'>Airbnb/Vacation Rental</option>
                </select>
              </div>

              {/* Submit Button */}
              <button
                type='submit'
                disabled={loading}
                className='w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed mt-6'
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>

              {/* Back Button */}
              <button
                type='button'
                onClick={() => setStep(1)}
                className='w-full bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition'
              >
                Back
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;

