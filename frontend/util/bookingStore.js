// bookingsStore.js
// Shared utility to read/write flight bookings via localStorage
// Drop this file anywhere (e.g. src/utils/bookingsStore.js) and import in both pages

const KEY = 'gh_flight_bookings';

export const getBookings = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch {
    return [];
  }
};

export const saveBooking = (booking) => {
  const existing = getBookings();
  const updated = [booking, ...existing];
  localStorage.setItem(KEY, JSON.stringify(updated));
  return updated;
};

export const cancelBooking = (id) => {
  const updated = getBookings().filter((b) => b.id !== id);
  localStorage.setItem(KEY, JSON.stringify(updated));
  return updated;
};