import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Sidebar, AdminHeader } from '../../Components';

const AnalyticsDashboard = () => {
  const { analytics } = useSelector((state) => state.adminData);

  // Sample data for charts
  const bookingData = [
    { month: 'Jan', bookings: 120, revenue: 45000 },
    { month: 'Feb', bookings: 180, revenue: 65000 },
    { month: 'Mar', bookings: 220, revenue: 78000 },
    { month: 'Apr', bookings: 200, revenue: 72000 },
    { month: 'May', bookings: 260, revenue: 92000 },
    { month: 'Jun', bookings: 310, revenue: 110000 },
  ];

  const revenueByCategory = [
    { name: 'Hotels', value: 45, fill: '#6B8E23' },
    { name: 'Flights', value: 30, fill: '#3b82f6' },
    { name: 'Cars', value: 15, fill: '#f59e0b' },
    { name: 'Others', value: 10, fill: '#8b5cf6' },
  ];

  return (
    <div className='flex h-screen bg-gray-50'>
      <Sidebar />

      <div className='flex-1 flex flex-col overflow-hidden'>
        <AdminHeader />

        <main className='flex-1 overflow-y-auto p-6'>
          <div className='max-w-7xl mx-auto'>
            {/* Header */}
            <div className='mb-8'>
              <h1 className='text-3xl font-bold text-gray-800'>Analytics Dashboard</h1>
              <p className='text-gray-600 mt-2'>Track your platform performance and metrics.</p>
            </div>

            {/* Key Metrics */}
            <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-8'>
              <div className='bg-white rounded-xl p-6 shadow-md border border-gray-100'>
                <p className='text-gray-600 text-sm font-medium'>Total Users</p>
                <p className='text-3xl font-bold text-gray-800 mt-2'>{analytics.totalUsers || 0}</p>
                <p className='text-xs text-green-600 mt-2'>+12% from last month</p>
              </div>
              <div className='bg-white rounded-xl p-6 shadow-md border border-gray-100'>
                <p className='text-gray-600 text-sm font-medium'>Total Bookings</p>
                <p className='text-3xl font-bold text-gray-800 mt-2'>{analytics.totalBookings || 0}</p>
                <p className='text-xs text-green-600 mt-2'>+8% from last month</p>
              </div>
              <div className='bg-white rounded-xl p-6 shadow-md border border-gray-100'>
                <p className='text-gray-600 text-sm font-medium'>Active Providers</p>
                <p className='text-3xl font-bold text-gray-800 mt-2'>{analytics.activeProviders || 0}</p>
                <p className='text-xs text-green-600 mt-2'>+5% from last month</p>
              </div>
              <div className='bg-white rounded-xl p-6 shadow-md border border-gray-100'>
                <p className='text-gray-600 text-sm font-medium'>Total Revenue</p>
                <p className='text-3xl font-bold text-gray-800 mt-2'>₹{(analytics.totalRevenue || 0).toLocaleString()}</p>
                <p className='text-xs text-green-600 mt-2'>+15% from last month</p>
              </div>
            </div>

            {/* Charts */}
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
              {/* Booking & Revenue Trend */}
              <div className='lg:col-span-2 bg-white rounded-xl p-6 shadow-md border border-gray-100'>
                <h2 className='text-lg font-bold text-gray-800 mb-4'>Booking & Revenue Trend</h2>
                <ResponsiveContainer width='100%' height={300}>
                  <LineChart data={bookingData}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='month' />
                    <YAxis yAxisId='left' />
                    <YAxis yAxisId='right' orientation='right' />
                    <Tooltip />
                    <Legend />
                    <Line yAxisId='left' type='monotone' dataKey='bookings' stroke='#6B8E23' strokeWidth={2} name='Bookings' />
                    <Line yAxisId='right' type='monotone' dataKey='revenue' stroke='#3b82f6' strokeWidth={2} name='Revenue (₹)' />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Revenue Distribution */}
              <div className='bg-white rounded-xl p-6 shadow-md border border-gray-100'>
                <h2 className='text-lg font-bold text-gray-800 mb-4'>Revenue by Category</h2>
                <ResponsiveContainer width='100%' height={300}>
                  <PieChart>
                    <Pie data={revenueByCategory} cx='50%' cy='50%' labelLine={false} label={({ name, value }) => `${name} ${value}%`} outerRadius={80} fill='#8884d8' dataKey='value'>
                      {revenueByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Monthly Comparison */}
            <div className='bg-white rounded-xl p-6 shadow-md border border-gray-100 mt-6'>
              <h2 className='text-lg font-bold text-gray-800 mb-4'>Monthly Bookings Comparison</h2>
              <ResponsiveContainer width='100%' height={300}>
                <BarChart data={bookingData}>
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='month' />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey='bookings' fill='#6B8E23' name='Bookings' />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
