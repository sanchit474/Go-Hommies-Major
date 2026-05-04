import React, { useState } from 'react';
import { PlanTrip } from '../../../ApiCall.jsx';
import {
  MapPin, Calendar, Users, DollarSign, Sparkles,
  Loader2, AlertCircle, ChevronRight, Tag, RefreshCw,
} from 'lucide-react';

const INTEREST_OPTIONS = [
  'Sightseeing', 'Hiking', 'Food & Cuisine', 'Adventure',
  'Culture', 'Beach', 'Shopping', 'Wildlife', 'Photography', 'Nightlife',
];

/* Render the AI text with basic section formatting */
const ItineraryDisplay = ({ text }) => {
  const lines = text.split('\n');
  return (
    <div className='space-y-1'>
      {lines.map((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={i} className='h-2' />;

        // Section headers (lines starting with emoji + caps or "Day N")
        if (/^(📍|🗓️|💰|🚗|💡|⚠️)/.test(trimmed) || /^Day \d+/i.test(trimmed)) {
          return (
            <p key={i} className='text-base font-bold text-gray-900 mt-4 mb-1'>
              {trimmed}
            </p>
          );
        }
        // Sub-items (morning/afternoon/evening/stay)
        if (/^(🌅|☀️|🌙|🏨|•)/.test(trimmed)) {
          return (
            <p key={i} className='text-sm text-gray-700 pl-3 leading-relaxed'>
              {trimmed}
            </p>
          );
        }
        return (
          <p key={i} className='text-sm text-gray-600 leading-relaxed'>
            {trimmed}
          </p>
        );
      })}
    </div>
  );
};

export default function TripPlanner() {
  const [destination, setDestination]         = useState('');
  const [startDate, setStartDate]             = useState('');
  const [endDate, setEndDate]                 = useState('');
  const [travelers, setTravelers]             = useState(1);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [budget, setBudget]                   = useState('');
  const [preferences, setPreferences]         = useState('');
  const [loading, setLoading]                 = useState(false);
  const [itinerary, setItinerary]             = useState('');
  const [error, setError]                     = useState(null);

  const toggleInterest = (interest) =>
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!destination.trim()) return;

    setLoading(true);
    setError(null);
    setItinerary('');

    const req = {
      destination: destination.trim(),
      startDate:   startDate  || null,
      endDate:     endDate    || null,
      travelers:   Number(travelers) || 1,
      interests:   selectedInterests,
      budget:      budget.trim(),
      preferences: preferences.trim(),
    };

    try {
      const resp = await PlanTrip(req);
      if (resp && resp.status === 200) {
        const text =
          resp.data?.itinerary ||
          resp.data?.data?.response ||
          resp.data?.response ||
          JSON.stringify(resp.data);
        setItinerary(text);
      } else {
        const msg =
          resp?.data?.message ||
          resp?.data?.error ||
          resp?.data?.data?.response ||
          'Unexpected response from AI service.';
        setError(typeof msg === 'string' ? msg : JSON.stringify(msg));
      }
    } catch (err) {
      setError(err?.message || 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setItinerary('');
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className='min-h-screen bg-gray-50 py-10 px-4'>
      <div className='max-w-3xl mx-auto'>

        {/* ── Header ── */}
        <div className='text-center mb-8'>
          <div className='inline-flex items-center gap-2 bg-[#6B8E23]/10 text-[#6B8E23] px-4 py-1.5 rounded-full text-sm font-semibold mb-4'>
            <Sparkles size={15} /> AI-Powered
          </div>
          <h1 className='text-4xl font-bold text-gray-900'>Trip Planner</h1>
          <p className='text-gray-500 mt-2 text-sm'>
            Tell us where you want to go — we'll build a personalised day-by-day itinerary.
          </p>
        </div>

        {/* ── Form ── */}
        {!itinerary && (
          <div className='bg-white rounded-2xl shadow-md border border-gray-100 p-8'>
            <form onSubmit={handleSubmit} className='space-y-5'>

              {/* Destination */}
              <div>
                <label className='flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-1.5'>
                  <MapPin size={14} /> Destination <span className='text-red-500'>*</span>
                </label>
                <input
                  type='text'
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder='e.g. Manali, Goa, Rajasthan, Paris...'
                  required
                  className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6B8E23]/30 focus:border-[#6B8E23] text-sm transition'
                />
              </div>

              {/* Dates */}
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-1.5'>
                    <Calendar size={14} /> Start Date
                  </label>
                  <input
                    type='date'
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6B8E23]/30 focus:border-[#6B8E23] text-sm transition'
                  />
                </div>
                <div>
                  <label className='flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-1.5'>
                    <Calendar size={14} /> End Date
                  </label>
                  <input
                    type='date'
                    value={endDate}
                    min={startDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6B8E23]/30 focus:border-[#6B8E23] text-sm transition'
                  />
                </div>
              </div>

              {/* Travelers + Budget */}
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-1.5'>
                    <Users size={14} /> Travelers
                  </label>
                  <input
                    type='number'
                    min={1}
                    value={travelers}
                    onChange={(e) => setTravelers(e.target.value)}
                    className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6B8E23]/30 focus:border-[#6B8E23] text-sm transition'
                  />
                </div>
                <div>
                  <label className='flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-1.5'>
                    <DollarSign size={14} /> Budget
                  </label>
                  <input
                    type='text'
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder='e.g. ₹15,000 or moderate'
                    className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6B8E23]/30 focus:border-[#6B8E23] text-sm transition'
                  />
                </div>
              </div>

              {/* Interests */}
              <div>
                <label className='flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-2'>
                  <Tag size={14} /> Interests
                </label>
                <div className='flex flex-wrap gap-2'>
                  {INTEREST_OPTIONS.map((interest) => (
                    <button
                      key={interest}
                      type='button'
                      onClick={() => toggleInterest(interest)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
                        selectedInterests.includes(interest)
                          ? 'bg-[#6B8E23] text-white border-[#6B8E23]'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-[#6B8E23] hover:text-[#6B8E23]'
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preferences */}
              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-1.5'>
                  Additional Preferences
                </label>
                <textarea
                  value={preferences}
                  onChange={(e) => setPreferences(e.target.value)}
                  rows={3}
                  placeholder='e.g. prefer budget stays, vegetarian food, avoid crowded places...'
                  className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6B8E23]/30 focus:border-[#6B8E23] text-sm transition resize-none'
                />
              </div>

              {/* Error */}
              {error && (
                <div className='bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3 items-start'>
                  <AlertCircle size={18} className='text-red-500 shrink-0 mt-0.5' />
                  <p className='text-sm text-red-600'>{error}</p>
                </div>
              )}

              {/* Submit */}
              <button
                type='submit'
                disabled={loading || !destination.trim()}
                className='w-full flex items-center justify-center gap-2 py-3.5 bg-[#6B8E23] text-white rounded-xl font-bold hover:bg-[#5a7a1c] transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-[#6B8E23]/20 text-sm'
              >
                {loading ? (
                  <><Loader2 size={18} className='animate-spin' /> Generating your itinerary...</>
                ) : (
                  <><Sparkles size={18} /> Generate Trip Plan <ChevronRight size={16} /></>
                )}
              </button>
            </form>
          </div>
        )}

        {/* ── Loading overlay ── */}
        {loading && (
          <div className='mt-8 bg-white rounded-2xl border border-gray-100 shadow-md p-10 flex flex-col items-center gap-4'>
            <div className='relative'>
              <div className='w-16 h-16 rounded-full border-4 border-[#6B8E23]/20 border-t-[#6B8E23] animate-spin' />
              <Sparkles size={22} className='text-[#6B8E23] absolute inset-0 m-auto' />
            </div>
            <p className='text-gray-700 font-semibold'>AI is planning your trip to <span className='text-[#6B8E23]'>{destination}</span>…</p>
            <p className='text-gray-400 text-xs'>This may take up to 15 seconds</p>
          </div>
        )}

        {/* ── Itinerary Result ── */}
        {itinerary && !loading && (
          <div className='bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden'>
            {/* Result header */}
            <div className='bg-gradient-to-r from-[#6B8E23] to-[#5a7a1c] px-8 py-6 text-white'>
              <div className='flex items-center justify-between'>
                <div>
                  <div className='flex items-center gap-2 mb-1'>
                    <Sparkles size={18} />
                    <span className='text-sm font-semibold opacity-90'>AI-Generated Itinerary</span>
                  </div>
                  <h2 className='text-2xl font-bold'>Your Trip to {destination}</h2>
                  <p className='text-white/70 text-sm mt-1'>
                    {travelers} traveller{travelers > 1 ? 's' : ''}
                    {startDate && ` · ${startDate}`}
                    {endDate && ` → ${endDate}`}
                    {budget && ` · ${budget}`}
                  </p>
                </div>
                <button
                  onClick={handleReset}
                  className='flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-semibold transition'
                >
                  <RefreshCw size={15} /> New Plan
                </button>
              </div>
            </div>

            {/* Itinerary body */}
            <div className='px-8 py-6'>
              <ItineraryDisplay text={itinerary} />
            </div>

            {/* Footer actions */}
            <div className='px-8 pb-6 flex gap-3'>
              <button
                onClick={handleReset}
                className='flex items-center gap-2 border border-[#6B8E23] text-[#6B8E23] px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#6B8E23] hover:text-white transition'
              >
                <RefreshCw size={15} /> Plan Another Trip
              </button>
              <button
                onClick={() => navigator.clipboard?.writeText(itinerary)}
                className='flex items-center gap-2 border border-gray-200 text-gray-600 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50 transition'
              >
                Copy Itinerary
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
