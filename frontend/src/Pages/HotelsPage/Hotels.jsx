import React, { useEffect, useMemo, useState } from 'react';
import { Calendar, Hotel, MapPin, Search, Star, Users, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Footer from '../../Components/Footer/Footer';
import { CreateHotelBooking, GetPublicHotels } from '../../../ApiCall';

const Hotels = () => {
  const navigate = useNavigate();
  const [searchLocation, setSearchLocation] = useState('');
  const [guests, setGuests] = useState('1');
  const [hotels, setHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingError, setLoadingError] = useState('');
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState('');
  const [bookingHotel, setBookingHotel] = useState(null);
  const [bookingData, setBookingData] = useState({
    checkInDate: '',
    checkOutDate: '',
    seatsBooked: 1,
  });
  const [bookingSubmitting, setBookingSubmitting] = useState(false);

  useEffect(() => {
    const loadHotels = async () => {
      setLoading(true);
      setLoadingError('');

      const response = await GetPublicHotels();
      if (response?.status === 200 && Array.isArray(response.data)) {
        setHotels(response.data);
      } else {
        const message = response?.data?.message || response?.data?.error || 'Failed to load hotels from database.';
        setLoadingError(message);
      }

      setLoading(false);
    };

    loadHotels();
  }, []);

  const hotelsToShow = useMemo(() => (hasSearched ? filteredHotels : hotels), [hasSearched, filteredHotels, hotels]);

  const handleSearch = () => {
    const destination = searchLocation.trim().toLowerCase();
    const requestedGuests = Number(guests) || 1;

    if (destination === '' && requestedGuests <= 1) {
      setFilteredHotels([]);
      setHasSearched(false);
      return;
    }

    const results = hotels.filter((hotel) => {
      const locationMatches = destination === '' || String(hotel.location || '').toLowerCase().includes(destination);
      const capacityMatches = Number(hotel.availableSeats ?? hotel.totalSeats ?? 0) >= requestedGuests;
      return locationMatches && capacityMatches;
    });

    setFilteredHotels(results);
    setHasSearched(true);
  };

  const openBookingModal = (hotel) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setBookingError('Please sign in as traveller to book a hotel.');
      setTimeout(() => navigate('/signin'), 1000);
      return;
    }

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const dayAfterTomorrow = new Date(today);
    dayAfterTomorrow.setDate(today.getDate() + 2);

    setBookingError('');
    setBookingSuccess('');
    setBookingHotel(hotel);
    setBookingData({
      checkInDate: tomorrow.toISOString().split('T')[0],
      checkOutDate: dayAfterTomorrow.toISOString().split('T')[0],
      seatsBooked: Math.max(1, Number(guests) || 1),
    });
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!bookingHotel) return;

    setBookingError('');
    setBookingSuccess('');

    if (!bookingData.checkInDate || !bookingData.checkOutDate) {
      setBookingError('Please select check-in and check-out dates.');
      return;
    }

    if (Number(bookingData.seatsBooked) < 1) {
      setBookingError('Guests must be at least 1.');
      return;
    }

    setBookingSubmitting(true);
    const response = await CreateHotelBooking(bookingHotel.id, {
      seatsBooked: Number(bookingData.seatsBooked),
      checkInDate: bookingData.checkInDate,
      checkOutDate: bookingData.checkOutDate,
    });
    setBookingSubmitting(false);

    if (response?.status === 200 && response.data) {
      setBookingSuccess(`Booking confirmed for ${response.data.hotelName}.`);
      setBookingHotel(null);
      return;
    }

    const message = response?.data?.message || response?.data?.error || 'Booking failed. Please try again.';
    setBookingError(message);
  };

  const handleInputChange = (e) => {
    setSearchLocation(e.target.value);
  };

  const formatPrice = (value) => {
    const amount = Number(value || 0);
    return `₹${amount.toLocaleString('en-IN')}/night`;
  };

  const getHotelImage = (hotel) => {
    if (Array.isArray(hotel.roomPhotoUrls) && hotel.roomPhotoUrls.length > 0) {
      return hotel.roomPhotoUrls[0];
    }

    return 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=400';
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
              <input
                type='number'
                min='1'
                placeholder='Guests'
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className='w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B8E23]'
              />
            </div>
          </div>
          <button
            onClick={handleSearch}
            className='bg-[#6B8E23] text-white px-8 py-2 rounded-lg font-bold hover:bg-[#5a7a1c] transition flex items-center gap-2'
          >
            <Search size={20} /> Search Hotels
          </button>
        </div>

        {bookingSuccess && (
          <div className='bg-green-50 border border-green-200 text-green-700 rounded-lg p-4 mb-6'>
            {bookingSuccess}
          </div>
        )}

        {bookingError && (
          <div className='bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-6'>
            {bookingError}
          </div>
        )}

        {loadingError && (
          <div className='bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-6'>
            {loadingError}
          </div>
        )}

        {loading && (
          <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8'>
            <p className='text-gray-600'>Loading hotels from database...</p>
          </div>
        )}

        {/* No Results Message */}
        {!loading && hasSearched && filteredHotels.length === 0 && (
          <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-10 text-center'>
            <p className='text-gray-700 font-medium'>No hotels found for your current filters. Try changing destination or guests.</p>
          </div>
        )}

        {/* Search Results Info */}
        {!loading && hasSearched && filteredHotels.length > 0 && (
          <div className='mb-6'>
            <p className='text-gray-600 font-medium'>Found {filteredHotels.length} hotel(s) in {searchLocation}</p>
          </div>
        )}

        {/* Hotel Grid */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-12'>
          {hotelsToShow.map((hotel) => (
            <div key={hotel.id} className='bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition flex flex-col'>
              <div className='h-48 overflow-hidden'>
                <img src={getHotelImage(hotel)} alt={hotel.name} className='w-full h-full object-cover hover:scale-110 transition duration-500' />
              </div>
              <div className='p-6 flex-1 flex flex-col'>
                <div className='flex justify-between items-start mb-2'>
                  <h3 className='text-xl font-bold'>{hotel.name}</h3>
                  <div className='flex items-center gap-1 bg-green-50 px-2 py-1 rounded text-[#6B8E23] text-sm font-bold'>
                    <Star size={16} fill='#6B8E23' /> {Number(hotel.avgRating || 0).toFixed(1)}
                  </div>
                </div>
                <div className='flex items-center gap-1 text-gray-500 mb-4'>
                  <MapPin size={16} /> <span className='text-sm'>{hotel.location}</span>
                </div>
                <div className='mt-auto flex justify-between items-center pt-4 border-t border-gray-100'>
                  <div>
                    <p className='text-lg font-bold text-[#6B8E23]'>{formatPrice(hotel.pricePerNight)}</p>
                    <p className='text-xs text-gray-400'>{hotel.totalRatings || 0} reviews · {hotel.availableSeats ?? hotel.totalSeats} rooms left</p>
                  </div>
                  <button
                    onClick={() => openBookingModal(hotel)}
                    className='bg-[#6B8E23] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#5a7a1c] transition'
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {!loading && hotelsToShow.length === 0 && !loadingError && (
          <div className='bg-white p-8 rounded-xl border border-gray-100 text-center mb-12'>
            <Hotel className='mx-auto text-gray-300 mb-3' size={40} />
            <p className='text-gray-600'>No hotels are available right now.</p>
          </div>
        )}
      </div>

      {bookingHotel && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50'>
          <div className='w-full max-w-md bg-white rounded-2xl shadow-2xl'>
            <div className='flex items-center justify-between p-5 border-b border-gray-100'>
              <h3 className='text-xl font-bold'>Book {bookingHotel.name}</h3>
              <button onClick={() => setBookingHotel(null)} className='p-2 hover:bg-gray-100 rounded-lg'>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleBookingSubmit} className='p-5 space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Check-in Date</label>
                <div className='relative'>
                  <Calendar className='absolute left-3 top-3 text-[#6B8E23]' size={18} />
                  <input
                    type='date'
                    value={bookingData.checkInDate}
                    onChange={(e) => setBookingData((prev) => ({ ...prev, checkInDate: e.target.value }))}
                    className='w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B8E23]'
                    required
                  />
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Check-out Date</label>
                <div className='relative'>
                  <Calendar className='absolute left-3 top-3 text-[#6B8E23]' size={18} />
                  <input
                    type='date'
                    value={bookingData.checkOutDate}
                    onChange={(e) => setBookingData((prev) => ({ ...prev, checkOutDate: e.target.value }))}
                    className='w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B8E23]'
                    required
                  />
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Guests</label>
                <div className='relative'>
                  <Users className='absolute left-3 top-3 text-[#6B8E23]' size={18} />
                  <input
                    type='number'
                    min='1'
                    max={bookingHotel.availableSeats ?? bookingHotel.totalSeats ?? 1}
                    value={bookingData.seatsBooked}
                    onChange={(e) => setBookingData((prev) => ({ ...prev, seatsBooked: e.target.value }))}
                    className='w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B8E23]'
                    required
                  />
                </div>
              </div>

              <div className='pt-2 flex gap-3'>
                <button
                  type='button'
                  onClick={() => setBookingHotel(null)}
                  className='flex-1 border border-gray-200 py-2 rounded-lg font-semibold text-gray-600 hover:bg-gray-50 transition'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  disabled={bookingSubmitting}
                  className='flex-1 bg-[#6B8E23] text-white py-2 rounded-lg font-semibold hover:bg-[#5a7a1c] transition disabled:opacity-60'
                >
                  {bookingSubmitting ? 'Booking...' : 'Confirm Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Hotels;
