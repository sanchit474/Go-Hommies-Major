import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, Clock, Plane, ArrowRight, Trash2, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import Footer from '../../Components/Footer/Footer';
import { Navbar } from '../../Components';
import { getBookings, cancelBooking } from '../../../util/bookingStore';// adjust path as needed
import { CancelMyHotelBooking, GetMyHotelBookings } from '../../../ApiCall';

const fmt = (n) => `₹${Number(n).toLocaleString('en-IN')}`;

const normalizeStatus = (status) => {
  const s = String(status || '').toLowerCase();
  if (s === 'cancelled' || s === 'canceled') return 'Cancelled';
  if (s === 'pending') return 'Pending';
  return 'Confirmed';
};

const mapHotelBooking = (booking) => ({
  type: 'hotel',
  id: `hotel-${booking.id}`,
  rawId: booking.id,
  status: normalizeStatus(booking.status),
  hotelName: booking.hotelName,
  location: booking.location,
  seatsBooked: booking.seatsBooked,
  checkInDate: booking.checkInDate,
  checkOutDate: booking.checkOutDate,
  totalAmount: booking.totalAmount,
  createdAt: booking.createdAt,
});

const mapFlightBooking = (booking) => ({
  ...booking,
  type: 'flight',
  id: `flight-${booking.id}`,
  rawId: booking.id,
  status: normalizeStatus(booking.status),
});

/* ── Status pill ── */
const StatusPill = ({ status }) => {
  const cfg = {
    Confirmed: { bg:'rgba(34,197,94,0.12)', border:'rgba(34,197,94,0.3)', color:'#4ade80', icon:<CheckCircle size={12}/> },
    Pending:   { bg:'rgba(251,191,36,0.12)', border:'rgba(251,191,36,0.3)', color:'#fbbf24', icon:<AlertCircle size={12}/> },
    Cancelled: { bg:'rgba(248,113,113,0.1)', border:'rgba(248,113,113,0.25)', color:'#f87171', icon:<AlertCircle size={12}/> },
  }[status] || {};
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'4px 12px',
      background:cfg.bg, border:`1px solid ${cfg.border}`, borderRadius:100,
      color:cfg.color, fontSize:11, fontWeight:700, letterSpacing:'0.04em' }}>
      {cfg.icon} {status}
    </span>
  );
};

/* ── Booking card ── */
const BookingCard = ({ booking, onCancel }) => {
  const [confirming, setConfirming] = useState(false);

  return (
    <div style={{
      background:'linear-gradient(145deg,rgba(15,24,40,0.95),rgba(10,17,28,0.98))',
      border:'1px solid rgba(255,255,255,0.08)', borderRadius:20,
      padding:24, fontFamily:"'DM Sans',sans-serif",
      boxShadow:'0 4px 24px rgba(0,0,0,0.3)',
      transition:'transform 0.2s, box-shadow 0.2s',
    }}
    onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 12px 40px rgba(0,0,0,0.4)'; }}
    onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow='0 4px 24px rgba(0,0,0,0.3)'; }}
    >
      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:18, flexWrap:'wrap', gap:8 }}>
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
            <div style={{ width:32, height:32, borderRadius:9, background:'rgba(74,222,128,0.1)',
              border:'1px solid rgba(74,222,128,0.2)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Plane size={14} color="#4ade80"/>
            </div>
            <span style={{ fontSize:12, fontWeight:600, color:'rgba(74,222,128,0.75)', letterSpacing:'0.06em', textTransform:'uppercase' }}>
              {booking.airline} · {booking.code}
            </span>
          </div>
          <h2 style={{ fontSize:20, fontWeight:700, color:'#f0f4ff', margin:0, display:'flex', alignItems:'center', gap:8 }}>
            {booking.from}
            <ArrowRight size={16} color="rgba(148,163,184,0.5)"/>
            {booking.to}
          </h2>
        </div>
        <StatusPill status={booking.status} />
      </div>

      {/* Details grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(120px,1fr))', gap:14, marginBottom:20 }}>
        {[
          { icon:<Calendar size={13}/>, label:'Date', value: new Date(booking.date).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}) },
          { icon:<Clock size={13}/>,    label:'Time', value:`${booking.time} → ${booking.arrival}` },
          { icon:<Users size={13}/>,    label:'Passengers', value:`${booking.passengers}` },
          { icon:<MapPin size={13}/>,   label:'Duration', value:booking.duration },
        ].map(({ icon, label, value }) => (
          <div key={label} style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:12, padding:'10px 14px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:5, color:'rgba(148,163,184,0.55)', fontSize:11,
              textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:5, fontWeight:600 }}>
              {icon} {label}
            </div>
            <p style={{ color:'#e2e8f0', fontWeight:600, fontSize:13.5, margin:0 }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Footer: total + actions */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12,
        paddingTop:18, borderTop:'1px solid rgba(255,255,255,0.07)' }}>
        <div>
          <p style={{ fontSize:11, color:'rgba(148,163,184,0.55)', textTransform:'uppercase', letterSpacing:'0.07em', margin:'0 0 2px' }}>Total Paid</p>
          <p style={{ fontSize:24, fontWeight:700, color:'#4ade80', margin:0, fontFamily:"'Cormorant Garamond',serif" }}>{fmt(booking.total)}</p>
        </div>
        <div style={{ display:'flex', gap:10 }}>
          {booking.status !== 'Cancelled' && (
            confirming ? (
              <div style={{ display:'flex', gap:8 }}>
                <button onClick={() => setConfirming(false)} style={{
                  padding:'8px 14px', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.12)',
                  borderRadius:10, color:'#94a3b8', fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:"'DM Sans',sans-serif",
                }}>Keep</button>
                <button onClick={() => { onCancel(booking.id); setConfirming(false); }} style={{
                  padding:'8px 16px', background:'rgba(239,68,68,0.12)', border:'1px solid rgba(239,68,68,0.3)',
                  borderRadius:10, color:'#f87171', fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:"'DM Sans',sans-serif",
                }}>Confirm Cancel</button>
              </div>
            ) : (
              <button onClick={() => setConfirming(true)} style={{
                display:'flex', alignItems:'center', gap:6, padding:'8px 16px',
                background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)',
                borderRadius:10, color:'#f87171', fontSize:13, fontWeight:600, cursor:'pointer',
                fontFamily:"'DM Sans',sans-serif", transition:'all 0.2s',
              }}>
                <Trash2 size={13}/> Cancel
              </button>
            )
          )}
        </div>
      </div>

      {/* Booking ID */}
      <p style={{ fontSize:11, color:'rgba(100,116,139,0.5)', marginTop:12, marginBottom:0 }}>
        Booking ID: {booking.id} · Booked {new Date(booking.bookedAt).toLocaleDateString('en-IN')}
      </p>
    </div>
  );
};

/* ── Hotel booking card ── */
const HotelBookingCard = ({ booking, onCancel, cancelling }) => {
  const [confirming, setConfirming] = useState(false);

  return (
    <div style={{
      background:'linear-gradient(145deg,rgba(15,24,40,0.95),rgba(10,17,28,0.98))',
      border:'1px solid rgba(255,255,255,0.08)', borderRadius:20,
      padding:24, fontFamily:"'DM Sans',sans-serif",
      boxShadow:'0 4px 24px rgba(0,0,0,0.3)',
    }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:18, flexWrap:'wrap', gap:8 }}>
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
            <div style={{ width:32, height:32, borderRadius:9, background:'rgba(34,197,94,0.1)',
              border:'1px solid rgba(34,197,94,0.22)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <MapPin size={14} color="#4ade80"/>
            </div>
            <span style={{ fontSize:12, fontWeight:600, color:'rgba(74,222,128,0.75)', letterSpacing:'0.06em', textTransform:'uppercase' }}>
              Hotel Booking
            </span>
          </div>
          <h2 style={{ fontSize:20, fontWeight:700, color:'#f0f4ff', margin:0 }}>
            {booking.hotelName}
          </h2>
        </div>
        <StatusPill status={booking.status} />
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(120px,1fr))', gap:14, marginBottom:20 }}>
        {[
          { icon:<MapPin size={13}/>, label:'Location', value: booking.location },
          { icon:<Calendar size={13}/>, label:'Check-in', value: new Date(booking.checkInDate).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}) },
          { icon:<Calendar size={13}/>, label:'Check-out', value: new Date(booking.checkOutDate).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}) },
          { icon:<Users size={13}/>, label:'Guests', value:`${booking.seatsBooked}` },
        ].map(({ icon, label, value }) => (
          <div key={label} style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:12, padding:'10px 14px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:5, color:'rgba(148,163,184,0.55)', fontSize:11,
              textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:5, fontWeight:600 }}>
              {icon} {label}
            </div>
            <p style={{ color:'#e2e8f0', fontWeight:600, fontSize:13.5, margin:0 }}>{value}</p>
          </div>
        ))}
      </div>

      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12,
        paddingTop:18, borderTop:'1px solid rgba(255,255,255,0.07)' }}>
        <div>
          <p style={{ fontSize:11, color:'rgba(148,163,184,0.55)', textTransform:'uppercase', letterSpacing:'0.07em', margin:'0 0 2px' }}>Total Paid</p>
          <p style={{ fontSize:24, fontWeight:700, color:'#4ade80', margin:0, fontFamily:"'Cormorant Garamond',serif" }}>{fmt(booking.totalAmount)}</p>
        </div>
        <div style={{ display:'flex', gap:10 }}>
          {booking.status !== 'Cancelled' && (
            confirming ? (
              <div style={{ display:'flex', gap:8 }}>
                <button onClick={() => setConfirming(false)} style={{
                  padding:'8px 14px', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.12)',
                  borderRadius:10, color:'#94a3b8', fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:"'DM Sans',sans-serif",
                }}>Keep</button>
                <button onClick={() => { onCancel(booking.rawId); setConfirming(false); }} style={{
                  padding:'8px 16px', background:'rgba(239,68,68,0.12)', border:'1px solid rgba(239,68,68,0.3)',
                  borderRadius:10, color:'#f87171', fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:"'DM Sans',sans-serif",
                }} disabled={cancelling}>{cancelling ? 'Cancelling...' : 'Confirm Cancel'}</button>
              </div>
            ) : (
              <button onClick={() => setConfirming(true)} style={{
                display:'flex', alignItems:'center', gap:6, padding:'8px 16px',
                background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)',
                borderRadius:10, color:'#f87171', fontSize:13, fontWeight:600, cursor:'pointer',
                fontFamily:"'DM Sans',sans-serif", transition:'all 0.2s',
              }}>
                <Trash2 size={13}/> Cancel
              </button>
            )
          )}
        </div>
      </div>

      <p style={{ fontSize:11, color:'rgba(100,116,139,0.5)', marginTop:12, marginBottom:0 }}>
        Booking ID: {booking.rawId} · Booked {new Date(booking.createdAt).toLocaleDateString('en-IN')}
      </p>
    </div>
  );
};

/* ══ MAIN COMPONENT ══════════════════════════════════════════════════ */
const Booking = () => {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter]     = useState('All');
  const [loading, setLoading] = useState(false);
  const [apiInfo, setApiInfo] = useState('');
  const [hotelCancellingId, setHotelCancellingId] = useState(null);

  const load = async () => {
    setLoading(true);
    setApiInfo('');

    const flightBookings = getBookings().map(mapFlightBooking);
    const hotelResponse = await GetMyHotelBookings();

    let hotelBookings = [];
    if (hotelResponse?.status === 200 && Array.isArray(hotelResponse.data)) {
      hotelBookings = hotelResponse.data.map(mapHotelBooking);
    } else if (hotelResponse?.status === 401 || hotelResponse?.status === 403) {
      setApiInfo('Sign in as traveller to see your hotel bookings.');
    } else if (hotelResponse?.status && hotelResponse?.status >= 400) {
      setApiInfo(hotelResponse?.data?.message || 'Unable to fetch hotel bookings right now.');
    }

    const merged = [...hotelBookings, ...flightBookings]
      .sort((a, b) => new Date(b.createdAt || b.bookedAt).getTime() - new Date(a.createdAt || a.bookedAt).getTime());

    setBookings(merged);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleCancel = (id) => {
    const updated = getBookings().map(b => b.id === id ? { ...b, status:'Cancelled' } : b);
    localStorage.setItem('gh_flight_bookings', JSON.stringify(updated));
    load();
  };

  const handleHotelCancel = async (bookingId) => {
    setHotelCancellingId(bookingId);
    setApiInfo('');

    const response = await CancelMyHotelBooking(bookingId);
    if (response?.status === 200) {
      await load();
    } else {
      const message = response?.data?.message || response?.data?.error || 'Unable to cancel this hotel booking.';
      setApiInfo(message);
    }

    setHotelCancellingId(null);
  };

  const TABS = ['All', 'Confirmed', 'Cancelled'];
  const visible = bookings.filter(b => filter === 'All' || b.status === filter);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Cormorant+Garamond:wght@600;700&display=swap');
      `}</style>

      <div style={{ background:'#06090f', minHeight:'100vh', fontFamily:"'DM Sans',sans-serif" }}>
        <Navbar />

        <div style={{ maxWidth:900, margin:'0 auto', padding:'100px 20px 60px' }}>

          {/* ── Header ── */}
          <div style={{ marginBottom:36 }}>
            <span style={{ fontSize:11, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(74,222,128,0.7)' }}>
              ✈ My Travel
            </span>
            <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(32px,5vw,52px)',
              fontWeight:700, color:'#f0f4ff', margin:'8px 0 10px', lineHeight:1.1 }}>
              My Bookings
            </h1>
            <p style={{ color:'rgba(148,163,184,0.65)', fontSize:15, margin:0 }}>
              {bookings.length} booking{bookings.length !== 1 ? 's' : ''} in total
            </p>
            {apiInfo && (
              <p style={{ color:'rgba(248,113,113,0.85)', fontSize:13, margin:'8px 0 0' }}>
                {apiInfo}
              </p>
            )}
          </div>

          {/* ── Tabs + Refresh ── */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24, flexWrap:'wrap', gap:12 }}>
            <div style={{ display:'flex', gap:8 }}>
              {TABS.map(tab => (
                <button key={tab} onClick={() => setFilter(tab)} style={{
                  padding:'7px 18px', borderRadius:100, fontSize:13, fontWeight:600,
                  cursor:'pointer', fontFamily:"'DM Sans',sans-serif", transition:'all 0.2s',
                  background: filter === tab ? 'linear-gradient(135deg,#22c55e,#16a34a)' : 'rgba(255,255,255,0.05)',
                  border: filter === tab ? 'none' : '1px solid rgba(255,255,255,0.1)',
                  color: filter === tab ? '#fff' : 'rgba(148,163,184,0.7)',
                  boxShadow: filter === tab ? '0 3px 12px rgba(34,197,94,0.3)' : 'none',
                }}>
                  {tab}
                  {tab !== 'All' && (
                    <span style={{ marginLeft:6, fontSize:11, opacity:0.7 }}>
                      ({bookings.filter(b => b.status === tab).length})
                    </span>
                  )}
                </button>
              ))}
            </div>
            <button onClick={load} style={{
              display:'flex', alignItems:'center', gap:6, padding:'7px 14px',
              background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)',
              borderRadius:10, color:'rgba(148,163,184,0.7)', fontSize:13, cursor:'pointer',
              fontFamily:"'DM Sans',sans-serif", transition:'all 0.2s',
            }}>
              <RefreshCw size={13}/> Refresh
            </button>
          </div>

          {loading && (
            <p style={{ color:'rgba(148,163,184,0.7)', margin:'0 0 16px', fontSize:14 }}>Loading bookings...</p>
          )}

          {/* ── Empty state ── */}
          {visible.length === 0 && (
            <div style={{ textAlign:'center', padding:'80px 20px', background:'rgba(255,255,255,0.02)',
              border:'1px solid rgba(255,255,255,0.06)', borderRadius:20 }}>
              <div style={{ fontSize:56, marginBottom:16 }}>🗺️</div>
              <h3 style={{ color:'#f0f4ff', fontSize:22, fontWeight:700, marginBottom:8 }}>
                {filter === 'All' ? 'No bookings yet' : `No ${filter.toLowerCase()} bookings`}
              </h3>
              <p style={{ color:'rgba(148,163,184,0.55)', fontSize:14, marginBottom:24 }}>
                {filter === 'All'
                  ? 'Book a flight or hotel to see it here'
                  : `You have no ${filter.toLowerCase()} bookings right now`}
              </p>
              {filter === 'All' && (
                <div style={{ display:'inline-flex', gap:10, flexWrap:'wrap', justifyContent:'center' }}>
                  <a href="/flights" style={{
                    display:'inline-flex', alignItems:'center', gap:8, padding:'11px 24px',
                    background:'linear-gradient(135deg,#22c55e,#16a34a)', color:'#fff',
                    fontWeight:700, fontSize:14, borderRadius:12, textDecoration:'none',
                    boxShadow:'0 4px 16px rgba(34,197,94,0.3)',
                  }}>
                    <Plane size={15}/> Search Flights
                  </a>
                  <a href="/hotels" style={{
                    display:'inline-flex', alignItems:'center', gap:8, padding:'11px 24px',
                    background:'rgba(255,255,255,0.07)', color:'#e2e8f0',
                    fontWeight:700, fontSize:14, borderRadius:12, textDecoration:'none',
                    border:'1px solid rgba(255,255,255,0.15)',
                  }}>
                    <MapPin size={15}/> Search Hotels
                  </a>
                </div>
              )}
            </div>
          )}

          {/* ── Cards ── */}
          {visible.length > 0 && (
            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
              {visible.map(b => (
                b.type === 'hotel'
                  ? <HotelBookingCard key={b.id} booking={b} onCancel={handleHotelCancel} cancelling={hotelCancellingId === b.rawId} />
                  : <BookingCard key={b.id} booking={b} onCancel={handleCancel} />
              ))}
            </div>
          )}
        </div>

        <Footer />
      </div>
    </>
  );
};

export default Booking;