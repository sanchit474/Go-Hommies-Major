import React, { useState } from 'react';
import { Hotel, Star, MapPin, Search, Users } from 'lucide-react';
import Footer from '../../Components/Footer/Footer';

const Hotels = () => {
  const [searchLocation, setSearchLocation] = useState('');
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const hotels = [
    { id: 1, name: 'Grand Palace Hotel', location: 'Jaipur', price: '₹5,500/night', rating: 4.8, reviews: 124, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=400' },
    { id: 2, name: 'Ocean View Resort', location: 'Goa', price: '₹8,200/night', rating: 4.9, reviews: 89, image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=400' },
    { id: 3, name: 'Mountain Retreat', location: 'Manali', price: '₹3,800/night', rating: 4.5, reviews: 156, image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=400' },
    { id: 4, name: 'Taj Luxury Palace', location: 'Jaipur', price: '₹6,200/night', rating: 4.7, reviews: 98, image: 'https://images.unsplash.com/photo-1571896367050-0aff6c9c3e1f?auto=format&fit=crop&q=80&w=400' },
    { id: 5, name: 'Beach Paradise', location: 'Goa', price: '₹7,500/night', rating: 4.6, reviews: 145, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=400' },
    { id: 6, name: 'Snow Peak Resort', location: 'Manali', price: '₹4,200/night', rating: 4.8, reviews: 112, image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&q=80&w=400' },
  ];

  const handleSearch = () => {
    if (searchLocation.trim() === '') {
      setFilteredHotels([]);
      setHasSearched(false);
      return;
    }

    const results = hotels.filter(hotel =>
      hotel.location.toLowerCase().includes(searchLocation.toLowerCase())
    );
    setFilteredHotels(results);
    setHasSearched(true);
  };

  const handleInputChange = (e) => {
    setSearchLocation(e.target.value);
  };

  return (
    <div className='flex flex-col items-center justify-start min-h-screen py-8 bg-[#FAFAFA] px-4 pt-[100px]'>
      <div className='w-full max-w-6xl'>
        <div className='mb-12'>
          <h1 className='text-4xl font-bold mb-4'>Luxury Stays</h1>
          <p className='text-gray-600 text-lg'>Experience comfort and elegance in top-rated hotels</p>
        </div>

        {/* Search Bar */}
        <div className='bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-10 flex flex-wrap gap-4 items-end'>
          <div className='flex-[2] min-w-[250px]'>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Where are you going?</label>
            <div className='relative'>
              <MapPin className='absolute left-3 top-3 text-[#6B8E23]' size={20} />
              <input
                type='text'
                placeholder='Search Destination'
                value={searchLocation}
                onChange={handleInputChange}
                className='w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B8E23]'
              />
            </div>
          </div>
          <div className='flex-1 min-w-[150px]'>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Guests</label>
            <div className='relative'>
              <Users className='absolute left-3 top-3 text-[#6B8E23]' size={20} />
              <input type='number' min='1' placeholder='Guests' className='w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B8E23]' />
            </div>
          </div>
          <button
            onClick={handleSearch}
            className='bg-[#6B8E23] text-white px-8 py-2 rounded-lg font-bold hover:bg-[#5a7a1c] transition flex items-center gap-2'
          >
            <Search size={20} /> Search Hotels
          </button>
        </div>

        {/* No Results Message */}
        {hasSearched && filteredHotels.length === 0 && (
          <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-10 text-center'>
            <p className='text-gray-700 font-medium'>No hotels found in "{searchLocation}". Try searching for Jaipur, Goa, or Manali.</p>
          </div>
        )}

        {/* Search Results Info */}
        {hasSearched && filteredHotels.length > 0 && (
          <div className='mb-6'>
            <p className='text-gray-600 font-medium'>Found {filteredHotels.length} hotel(s) in {searchLocation}</p>
          </div>
        )}

        {/* Hotel Grid */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-12'>
          {(hasSearched ? filteredHotels : hotels).map((hotel) => (
            <div key={hotel.id} className='bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition flex flex-col'>
              <div className='h-48 overflow-hidden'>
                <img src={hotel.image} alt={hotel.name} className='w-full h-full object-cover hover:scale-110 transition duration-500' />
              </div>
              <div className='p-6 flex-1 flex flex-col'>
                <div className='flex justify-between items-start mb-2'>
                  <h3 className='text-xl font-bold'>{hotel.name}</h3>
                  <div className='flex items-center gap-1 bg-green-50 px-2 py-1 rounded text-[#6B8E23] text-sm font-bold'>
                    <Star size={16} fill='#6B8E23' /> {hotel.rating}
                  </div>
                </div>
                <div className='flex items-center gap-1 text-gray-500 mb-4'>
                  <MapPin size={16} /> <span className='text-sm'>{hotel.location}</span>
                </div>
                <div className='mt-auto flex justify-between items-center pt-4 border-t border-gray-100'>
                  <div>
                    <p className='text-lg font-bold text-[#6B8E23]'>{hotel.price}</p>
                    <p className='text-xs text-gray-400'>{hotel.reviews} reviews</p>
                  </div>
                  <button className='bg-[#6B8E23] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#5a7a1c] transition'>
                    View Rooms
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

export default Hotels;
