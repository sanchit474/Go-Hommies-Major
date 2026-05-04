import React from 'react';
import { Car, Fuel, Users, Gauge, Search, MapPin } from 'lucide-react';
import Footer from '../../Components/Footer/Footer';

const Cars = () => {
  const cars = [
    { id: 1, name: 'Maruti Suzuki Swift', type: 'Hatchback', price: '₹1,500/day', fuel: 'Petrol', transmission: 'Manual', seats: 5, image: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&q=80&w=400' },
    { id: 2, name: 'Hyundai Creta', type: 'SUV', price: '₹3,200/day', fuel: 'Diesel', transmission: 'Automatic', seats: 5, image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=400' },
    { id: 3, name: 'Toyota Fortuner', type: 'Premium SUV', price: '₹6,500/day', fuel: 'Diesel', transmission: 'Automatic', seats: 7, image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=400' },
  ];

  return (
    <div className='flex flex-col items-center justify-start min-h-screen py-8 bg-[#FAFAFA] px-4 pt-[100px]'>
      <div className='w-full max-w-6xl'>
        <div className='mb-12'>
          <h1 className='text-4xl font-bold mb-4'>Rent a Car</h1>
          <p className='text-gray-600 text-lg'>Self-drive cars for your next adventure</p>
        </div>

        {/* Search Bar */}
        <div className='bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-10 flex flex-wrap gap-4 items-end'>
          <div className='flex-[2] min-w-[250px]'>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Pickup Location</label>
            <div className='relative'>
              <MapPin className='absolute left-3 top-3 text-[#6B8E23]' size={20} />
              <input type='text' placeholder='Where to pickup?' className='w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B8E23]' />
            </div>
          </div>
          <div className='flex-1 min-w-[150px]'>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Pickup Date</label>
            <input type='date' className='w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B8E23]' />
          </div>
          <button className='bg-[#6B8E23] text-white px-8 py-2 rounded-lg font-bold hover:bg-[#5a7a1c] transition flex items-center gap-2'>
            <Search size={20} /> Find Cars
          </button>
        </div>

        {/* Cars Grid */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-12'>
          {cars.map((car) => (
            <div key={car.id} className='bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition flex flex-col'>
              <div className='h-48 overflow-hidden'>
                <img src={car.image} alt={car.name} className='w-full h-full object-cover hover:scale-110 transition duration-500' />
              </div>
              <div className='p-6 flex-1 flex flex-col'>
                <div className='flex justify-between items-start mb-2'>
                  <h3 className='text-xl font-bold'>{car.name}</h3>
                  <span className='bg-gray-100 px-2 py-1 rounded text-xs font-semibold text-gray-600'>{car.type}</span>
                </div>
                
                <div className='grid grid-cols-2 gap-4 my-4'>
                  <div className='flex items-center gap-2 text-gray-500 text-sm'>
                    <Users size={16} /> <span>{car.seats} Seats</span>
                  </div>
                  <div className='flex items-center gap-2 text-gray-500 text-sm'>
                    <Fuel size={16} /> <span>{car.fuel}</span>
                  </div>
                  <div className='flex items-center gap-2 text-gray-500 text-sm'>
                    <Gauge size={16} /> <span>{car.transmission}</span>
                  </div>
                </div>

                <div className='mt-auto flex justify-between items-center pt-4 border-t border-gray-100'>
                  <div>
                    <p className='text-lg font-bold text-[#6B8E23]'>{car.price}</p>
                    <p className='text-xs text-gray-400'>Free Cancellation</p>
                  </div>
                  <button className='bg-[#6B8E23] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#5a7a1c] transition'>
                    Rent Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Cars;
