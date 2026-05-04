import React, { useState } from 'react';
import { Plane, Calendar, MapPin, Search, ArrowRight, Clock, Users, IndianRupee, CheckCircle2, X } from 'lucide-react';
import Footer from '../../Components/Footer/Footer';
import { Navbar } from '../../Components';
import { saveBooking } from '../../../util/bookingStore';

/* ── Indian cities ── */
const CITIES = [
  'Delhi','Mumbai','Bangalore','Chennai','Hyderabad','Kolkata',
  'Ahmedabad','Pune','Jaipur','Goa','Kochi','Lucknow',
  'Chandigarh','Indore','Bhopal','Nagpur','Surat','Vadodara',
  'Rishikesh','Manali','Shimla','Udaipur','Jodhpur','Agra',
];

/* ── Static flight catalogue ── */
const ALL_FLIGHTS = [
  { id: 'f1',  from:'Delhi',     to:'Mumbai',    time:'06:00',  arrival:'08:15', duration:'2h 15m', price:4500,  seats:42, airline:'IndiGo',    code:'6E-201' },
  { id: 'f2',  from:'Delhi',     to:'Mumbai',    time:'10:30',  arrival:'12:50', duration:'2h 20m', price:5200,  seats:28, airline:'Air India', code:'AI-101' },
  { id: 'f3',  from:'Delhi',     to:'Mumbai',    time:'18:00',  arrival:'20:10', duration:'2h 10m', price:3900,  seats:15, airline:'SpiceJet',  code:'SG-101' },
  { id: 'f4',  from:'Bangalore', to:'Goa',       time:'07:15',  arrival:'08:35', duration:'1h 20m', price:3200,  seats:60, airline:'IndiGo',    code:'6E-303' },
  { id: 'f5',  from:'Bangalore', to:'Goa',       time:'14:00',  arrival:'15:25', duration:'1h 25m', price:3800,  seats:20, airline:'Go First',  code:'G8-201' },
  { id: 'f6',  from:'Kolkata',   to:'Delhi',     time:'08:00',  arrival:'10:30', duration:'2h 30m', price:5100,  seats:33, airline:'Air India', code:'AI-401' },
  { id: 'f7',  from:'Kolkata',   to:'Delhi',     time:'15:45',  arrival:'18:20', duration:'2h 35m', price:4700,  seats:50, airline:'IndiGo',    code:'6E-501' },
  { id: 'f8',  from:'Mumbai',    to:'Chennai',   time:'09:00',  arrival:'10:40', duration:'1h 40m', price:3500,  seats:45, airline:'SpiceJet',  code:'SG-205' },
  { id: 'f9',  from:'Mumbai',    to:'Hyderabad', time:'12:00',  arrival:'13:25', duration:'1h 25m', price:3100,  seats:38, airline:'IndiGo',    code:'6E-401' },
  { id: 'f10', from:'Hyderabad', to:'Bangalore', time:'07:30',  arrival:'08:40', duration:'1h 10m', price:2800,  seats:55, airline:'Go First',  code:'G8-301' },
  { id: 'f11', from:'Chennai',   to:'Mumbai',    time:'16:30',  arrival:'18:15', duration:'1h 45m', price:4200,  seats:22, airline:'Air India', code:'AI-502' },
  { id: 'f12', from:'Delhi',     to:'Jaipur',    time:'11:00',  arrival:'12:10', duration:'1h 10m', price:2500,  seats:70, airline:'IndiGo',    code:'6E-110' },
];

const fmt = (price) => `₹${price.toLocaleString('en-IN')}`;
const today = () => new Date().toISOString().split('T')[0];

/* ── CityInput with datalist ── */
const CityInput = ({ label, icon, value, onChange, placeholder }) => (
  <div style={{ flex: 1, minWidth: 180 }}>
    <label style={{ display: 'block', fontSize: 12, fontWeight: 600,
      letterSpacing: '0.06em', textTransform: 'uppercase',
      color: 'rgba(148,163,184,0.8)', marginBottom: 8, fontFamily: "'DM Sans',sans-serif" }}>
      {label}
    </label>
    <div style={{ position: 'relative' }}>
      <span style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }}>
        {icon}
      </span>
      <input
        list={`city-list-${label}`}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%', paddingLeft: 40, paddingRight: 12, paddingTop: 11, paddingBottom: 11,
          background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 12, color: '#f0f4ff', fontSize: 14, outline: 'none',
          fontFamily: "'DM Sans',sans-serif", boxSizing: 'border-box',
          transition: 'border 0.2s',
        }}
        onFocus={e => e.target.style.borderColor = 'rgba(74,222,128,0.5)'}
        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
      />
      <datalist id={`city-list-${label}`}>
        {CITIES.map(c => <option key={c} value={c} />)}
      </datalist>
    </div>
  </div>
);

/* ── Booking confirm modal ── */
const BookingModal = ({ flight, date, passengers, onConfirm, onClose }) => (
  <div style={{
    position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', backdropFilter:'blur(8px)',
    zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center', padding:16,
  }}>
    <div style={{
      background:'linear-gradient(145deg,#0f1828,#0a1118)',
      border:'1px solid rgba(74,222,128,0.2)', borderRadius:24,
      padding:32, maxWidth:420, width:'100%',
      boxShadow:'0 40px 80px rgba(0,0,0,0.6)',
      fontFamily:"'DM Sans',sans-serif",
      animation:'popIn 0.25s cubic-bezier(0.34,1.4,0.64,1)',
    }}>
      <style>{`@keyframes popIn{from{opacity:0;transform:scale(0.92)}to{opacity:1;transform:scale(1)}}`}</style>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:24 }}>
        <div>
          <p style={{ fontSize:11, fontWeight:700, letterSpacing:'0.1em', color:'rgba(74,222,128,0.7)', textTransform:'uppercase', marginBottom:4 }}>Confirm Booking</p>
          <h2 style={{ fontSize:22, fontWeight:700, color:'#f0f4ff', margin:0 }}>{flight.from} → {flight.to}</h2>
        </div>
        <button onClick={onClose} style={{ background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:9, padding:'6px 8px', cursor:'pointer', color:'#94a3b8' }}>
          <X size={16} />
        </button>
      </div>

      {[
        ['Airline', `${flight.airline} (${flight.code})`],
        ['Date', new Date(date).toLocaleDateString('en-IN',{weekday:'short',day:'numeric',month:'long',year:'numeric'})],
        ['Departure', flight.time],
        ['Arrival', flight.arrival],
        ['Duration', flight.duration],
        ['Passengers', `${passengers}`],
        ['Total Fare', fmt(flight.price * passengers)],
      ].map(([k, v]) => (
        <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid rgba(255,255,255,0.06)', fontSize:13.5 }}>
          <span style={{ color:'rgba(148,163,184,0.7)' }}>{k}</span>
          <span style={{ color:k==='Total Fare'?'#4ade80':'#f0f4ff', fontWeight: k==='Total Fare'?700:500 }}>{v}</span>
        </div>
      ))}

      <button onClick={onConfirm} style={{
        marginTop:24, width:'100%', padding:'13px', background:'linear-gradient(135deg,#22c55e,#16a34a)',
        color:'#fff', fontWeight:700, fontSize:15, border:'none', borderRadius:12, cursor:'pointer',
        fontFamily:"'DM Sans',sans-serif", boxShadow:'0 4px 20px rgba(34,197,94,0.35)',
        transition:'all 0.2s',
      }}>
        Confirm & Book
      </button>
    </div>
  </div>
);

/* ── Success toast ── */
const Toast = ({ msg }) => (
  <div style={{
    position:'fixed', bottom:32, left:'50%', transform:'translateX(-50%)',
    background:'linear-gradient(135deg,#16a34a,#15803d)',
    color:'#fff', padding:'14px 28px', borderRadius:100, zIndex:99999,
    display:'flex', alignItems:'center', gap:10, fontSize:14, fontWeight:600,
    boxShadow:'0 8px 32px rgba(34,197,94,0.4)', animation:'slideUp 0.3s ease',
    fontFamily:"'DM Sans',sans-serif",
  }}>
    <style>{`@keyframes slideUp{from{opacity:0;transform:translate(-50%,20px)}to{opacity:1;transform:translate(-50%,0)}}`}</style>
    <CheckCircle2 size={18}/> {msg}
  </div>
);

/* ══ MAIN COMPONENT ══════════════════════════════════════════════════ */
const Flights = () => {
  const [fromCity,  setFromCity]  = useState('');
  const [toCity,    setToCity]    = useState('');
  const [date,      setDate]      = useState(today());
  const [passengers,setPassengers]= useState(1);
  const [results,   setResults]   = useState(null);
  const [selected,  setSelected]  = useState(null);
  const [toast,     setToast]     = useState('');

  const handleSearch = () => {
    const filtered = ALL_FLIGHTS.filter(f =>
      (!fromCity || f.from.toLowerCase().includes(fromCity.toLowerCase())) &&
      (!toCity   || f.to.toLowerCase().includes(toCity.toLowerCase()))
    );
    setResults(filtered);
    setSelected(null);
  };

  const handleConfirm = () => {
    const booking = {
      id: `BK-${Date.now()}`,
      flightId: selected.id,
      airline: selected.airline,
      code: selected.code,
      from: selected.from,
      to: selected.to,
      date,
      time: selected.time,
      arrival: selected.arrival,
      duration: selected.duration,
      passengers,
      price: selected.price,
      total: selected.price * passengers,
      status: 'Confirmed',
      bookedAt: new Date().toISOString(),
      type: 'flight',
    };
    saveBooking(booking);
    setSelected(null);
    setToast(`Flight booked! ${selected.from} → ${selected.to}`);
    setTimeout(() => setToast(''), 3500);
  };

  const iconColor = '#4ade80';
  const BASE = { fontFamily:"'DM Sans',sans-serif" };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Cormorant+Garamond:wght@600;700&display=swap');
        input[type=date]::-webkit-calendar-picker-indicator { filter: invert(0.6); cursor:pointer; }
        input::placeholder { color: rgba(148,163,184,0.45); }
        .fl-card { transition: transform 0.2s, box-shadow 0.2s; }
        .fl-card:hover { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(0,0,0,0.35) !important; }
        .book-btn:hover { background: linear-gradient(135deg,#16a34a,#15803d) !important; box-shadow: 0 6px 20px rgba(34,197,94,0.45) !important; transform: translateY(-1px); }
      `}</style>

      <div style={{ background:'#06090f', minHeight:'100vh', ...BASE }}>
        <Navbar />

        <div style={{ maxWidth:1080, margin:'0 auto', padding:'100px 20px 60px' }}>

          {/* ── Header ── */}
          <div style={{ marginBottom:40 }}>
            <span style={{ fontSize:11, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase',
              color:'rgba(74,222,128,0.7)', fontFamily:"'DM Sans',sans-serif" }}>✈ Flight Search</span>
            <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(36px,5vw,58px)',
              fontWeight:700, color:'#f0f4ff', margin:'8px 0 10px', lineHeight:1.1 }}>
              Find Your Flight
            </h1>
            <p style={{ color:'rgba(148,163,184,0.7)', fontSize:15, margin:0 }}>
              Search from {ALL_FLIGHTS.length} routes across India's top destinations
            </p>
          </div>

          {/* ── Search Card ── */}
          <div style={{
            background:'linear-gradient(145deg,rgba(15,24,40,0.9),rgba(10,17,28,0.95))',
            border:'1px solid rgba(74,222,128,0.15)', borderRadius:20, padding:28,
            marginBottom:36, boxShadow:'0 8px 40px rgba(0,0,0,0.4)',
          }}>
            <div style={{ display:'flex', flexWrap:'wrap', gap:16, alignItems:'flex-end' }}>
              <CityInput label="From" icon={<MapPin size={16} color={iconColor}/>} value={fromCity} onChange={setFromCity} placeholder="Departure city" />
              <CityInput label="To"   icon={<MapPin size={16} color={iconColor}/>} value={toCity}   onChange={setToCity}   placeholder="Arrival city" />

              {/* Date */}
              <div style={{ flex:1, minWidth:160 }}>
                <label style={{ display:'block', fontSize:12, fontWeight:600, letterSpacing:'0.06em',
                  textTransform:'uppercase', color:'rgba(148,163,184,0.8)', marginBottom:8 }}>Date</label>
                <div style={{ position:'relative' }}>
                  <Calendar size={16} color={iconColor} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }} />
                  <input type="date" value={date} min={today()} onChange={e => setDate(e.target.value)}
                    style={{ width:'100%', paddingLeft:40, paddingRight:12, paddingTop:11, paddingBottom:11,
                      background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.12)',
                      borderRadius:12, color:'#f0f4ff', fontSize:14, outline:'none',
                      fontFamily:"'DM Sans',sans-serif", boxSizing:'border-box' }} />
                </div>
              </div>

              {/* Passengers */}
              <div style={{ minWidth:110 }}>
                <label style={{ display:'block', fontSize:12, fontWeight:600, letterSpacing:'0.06em',
                  textTransform:'uppercase', color:'rgba(148,163,184,0.8)', marginBottom:8 }}>Passengers</label>
                <div style={{ position:'relative' }}>
                  <Users size={16} color={iconColor} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }} />
                  <select value={passengers} onChange={e => setPassengers(Number(e.target.value))}
                    style={{ width:'100%', paddingLeft:36, paddingRight:12, paddingTop:11, paddingBottom:11,
                      background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.12)',
                      borderRadius:12, color:'#f0f4ff', fontSize:14, outline:'none',
                      fontFamily:"'DM Sans',sans-serif", appearance:'none', cursor:'pointer' }}>
                    {[1,2,3,4,5,6].map(n => <option key={n} value={n} style={{ background:'#0f1828' }}>{n} Passenger{n>1?'s':''}</option>)}
                  </select>
                </div>
              </div>

              {/* Search button */}
              <button onClick={handleSearch} style={{
                display:'flex', alignItems:'center', gap:8, padding:'11px 28px',
                background:'linear-gradient(135deg,#22c55e,#16a34a)', color:'#fff',
                fontWeight:700, fontSize:14, border:'none', borderRadius:12, cursor:'pointer',
                boxShadow:'0 4px 16px rgba(34,197,94,0.3)', fontFamily:"'DM Sans',sans-serif",
                transition:'all 0.25s', whiteSpace:'nowrap', alignSelf:'flex-end',
              }} className="book-btn">
                <Search size={16}/> Search Flights
              </button>
            </div>
          </div>

          {/* ── Results ── */}
          {results === null && (
            <div style={{ textAlign:'center', padding:'60px 0' }}>
              <div style={{ fontSize:56, marginBottom:16 }}>✈️</div>
              <p style={{ color:'rgba(148,163,184,0.5)', fontSize:15 }}>Enter your details above and search for available flights</p>
            </div>
          )}

          {results !== null && results.length === 0 && (
            <div style={{ textAlign:'center', padding:'60px 0' }}>
              <div style={{ fontSize:52, marginBottom:16 }}>🔍</div>
              <h3 style={{ color:'#f0f4ff', fontSize:22, fontWeight:700, marginBottom:8 }}>No flights found</h3>
              <p style={{ color:'rgba(148,163,184,0.6)', fontSize:14 }}>Try different cities or leave fields blank to see all routes</p>
            </div>
          )}

          {results !== null && results.length > 0 && (
            <>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20, flexWrap:'wrap', gap:8 }}>
                <h2 style={{ color:'#f0f4ff', fontSize:20, fontWeight:700, margin:0 }}>
                  {results.length} Flight{results.length>1?'s':''} Found
                </h2>
                <span style={{ fontSize:13, color:'rgba(148,163,184,0.6)' }}>
                  {date && new Date(date).toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long'})}
                  {passengers > 1 && ` · ${passengers} passengers`}
                </span>
              </div>

              <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                {results.map((flight) => (
                  <div key={flight.id} className="fl-card" style={{
                    background:'linear-gradient(145deg,rgba(15,24,40,0.95),rgba(10,17,28,0.98))',
                    border:'1px solid rgba(255,255,255,0.08)', borderRadius:18,
                    padding:'20px 24px', boxShadow:'0 4px 24px rgba(0,0,0,0.3)',
                    display:'flex', flexWrap:'wrap', alignItems:'center', gap:20,
                  }}>
                    {/* Airline badge */}
                    <div style={{ display:'flex', alignItems:'center', gap:12, minWidth:170 }}>
                      <div style={{ width:44, height:44, borderRadius:12,
                        background:'rgba(74,222,128,0.1)', border:'1px solid rgba(74,222,128,0.2)',
                        display:'flex', alignItems:'center', justifyContent:'center' }}>
                        <Plane size={20} color="#4ade80" />
                      </div>
                      <div>
                        <p style={{ color:'#f0f4ff', fontWeight:700, fontSize:14, margin:0 }}>{flight.airline}</p>
                        <p style={{ color:'rgba(148,163,184,0.6)', fontSize:12, margin:0 }}>{flight.code}</p>
                      </div>
                    </div>

                    {/* Route */}
                    <div style={{ flex:1, display:'flex', alignItems:'center', gap:16, minWidth:200, justifyContent:'center' }}>
                      <div style={{ textAlign:'center' }}>
                        <p style={{ fontSize:22, fontWeight:700, color:'#f0f4ff', margin:0, fontFamily:"'Cormorant Garamond',serif" }}>{flight.time}</p>
                        <p style={{ fontSize:12, color:'rgba(148,163,184,0.7)', margin:'2px 0 0' }}>{flight.from}</p>
                      </div>
                      <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                        <p style={{ fontSize:11, color:'rgba(148,163,184,0.5)', margin:0 }}>{flight.duration}</p>
                        <div style={{ width:'100%', display:'flex', alignItems:'center', gap:4 }}>
                          <div style={{ flex:1, height:1, background:'linear-gradient(90deg,rgba(74,222,128,0.3),rgba(37,99,235,0.3))' }} />
                          <ArrowRight size={12} color="rgba(74,222,128,0.6)" />
                        </div>
                        <p style={{ fontSize:10, color:'rgba(74,222,128,0.5)', margin:0 }}>Non-stop</p>
                      </div>
                      <div style={{ textAlign:'center' }}>
                        <p style={{ fontSize:22, fontWeight:700, color:'#f0f4ff', margin:0, fontFamily:"'Cormorant Garamond',serif" }}>{flight.arrival}</p>
                        <p style={{ fontSize:12, color:'rgba(148,163,184,0.7)', margin:'2px 0 0' }}>{flight.to}</p>
                      </div>
                    </div>

                    {/* Seats */}
                    <div style={{ textAlign:'center', minWidth:70 }}>
                      <p style={{ fontSize:11, color:'rgba(148,163,184,0.55)', margin:'0 0 2px', textTransform:'uppercase', letterSpacing:'0.06em' }}>Seats</p>
                      <p style={{ fontSize:14, fontWeight:600,
                        color: flight.seats < 20 ? '#f87171' : '#4ade80', margin:0 }}>
                        {flight.seats} left
                      </p>
                    </div>

                    {/* Price + Book */}
                    <div style={{ textAlign:'right', minWidth:130 }}>
                      <p style={{ fontSize:11, color:'rgba(148,163,184,0.55)', margin:'0 0 2px', textTransform:'uppercase', letterSpacing:'0.06em' }}>
                        {passengers > 1 ? `${passengers} × ${fmt(flight.price)}` : 'per person'}
                      </p>
                      <p style={{ fontSize:26, fontWeight:700, color:'#4ade80', margin:'0 0 10px',
                        fontFamily:"'Cormorant Garamond',serif" }}>
                        {fmt(flight.price * passengers)}
                      </p>
                      <button className="book-btn" onClick={() => setSelected(flight)} style={{
                        padding:'9px 22px', background:'linear-gradient(135deg,#22c55e,#16a34a)',
                        color:'#fff', fontWeight:700, fontSize:13, border:'none', borderRadius:10,
                        cursor:'pointer', fontFamily:"'DM Sans',sans-serif",
                        boxShadow:'0 3px 12px rgba(34,197,94,0.3)', transition:'all 0.25s',
                      }}>
                        Book Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <Footer />
      </div>

      {selected && (
        <BookingModal
          flight={selected} date={date} passengers={passengers}
          onConfirm={handleConfirm}
          onClose={() => setSelected(null)}
        />
      )}

      {toast && <Toast msg={toast} />}
    </>
  );
};

export default Flights;