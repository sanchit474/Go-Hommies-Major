import React, { useEffect, useRef, useState } from 'react';
import {
  Plus, X, Home, MapPin, DollarSign, Users, Edit2, Trash2,
  Star, ImagePlus, Image as ImageIcon,
} from 'lucide-react';
import { Sidebar, AdminHeader } from '../../Components';
import apiInstance from '../../utils/api';

const emptyForm = {
  name: '',
  location: '',
  description: '',
  totalSeats: '',
  pricePerNight: '',
  isActive: true,
};

const ProviderListings = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingHotel, setEditingHotel] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');
  const [photoFiles, setPhotoFiles] = useState([]);       // File objects to upload
  const [photoPreviews, setPhotoPreviews] = useState([]); // data-URL previews
  const [existingPhotos, setExistingPhotos] = useState([]); // URLs already on server
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => { fetchMyHotels(); }, []);

  const fetchMyHotels = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await apiInstance.get('hotels/my');
      setHotels(res.data || []);
    } catch (err) {
      setError('Failed to load your listings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingHotel(null);
    setForm(emptyForm);
    setPhotoFiles([]);
    setPhotoPreviews([]);
    setExistingPhotos([]);
    setFormError('');
    setShowModal(true);
  };

  const openEditModal = (hotel) => {
    setEditingHotel(hotel);
    setForm({
      name: hotel.name || '',
      location: hotel.location || '',
      description: hotel.description || '',
      totalSeats: hotel.totalSeats ?? '',
      pricePerNight: hotel.pricePerNight ?? '',
      isActive: hotel.isActive ?? true,
    });
    setPhotoFiles([]);
    setPhotoPreviews([]);
    setExistingPhotos(hotel.roomPhotoUrls || []);
    setFormError('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingHotel(null);
    setForm(emptyForm);
    setPhotoFiles([]);
    setPhotoPreviews([]);
    setExistingPhotos([]);
    setFormError('');
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    setFormError('');
  };

  const handlePhotoSelect = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const newFiles = [...photoFiles, ...files].slice(0, 5); // max 5 photos
    setPhotoFiles(newFiles);

    // Generate previews
    const readers = newFiles.map(
      (f) =>
        new Promise((resolve) => {
          const r = new FileReader();
          r.onload = (ev) => resolve(ev.target.result);
          r.readAsDataURL(f);
        })
    );
    Promise.all(readers).then(setPhotoPreviews);
    e.target.value = '';
  };

  const removeNewPhoto = (idx) => {
    const files = photoFiles.filter((_, i) => i !== idx);
    setPhotoFiles(files);
    const readers = files.map(
      (f) =>
        new Promise((resolve) => {
          const r = new FileReader();
          r.onload = (ev) => resolve(ev.target.result);
          r.readAsDataURL(f);
        })
    );
    Promise.all(readers).then(setPhotoPreviews);
  };

  const removeExistingPhoto = (idx) => {
    setExistingPhotos((prev) => prev.filter((_, i) => i !== idx));
  };

  const validate = () => {
    if (!form.name.trim()) return 'Hotel name is required.';
    if (!form.location.trim()) return 'Location is required.';
    if (!form.totalSeats || Number(form.totalSeats) < 1) return 'Total rooms must be at least 1.';
    if (!form.pricePerNight || Number(form.pricePerNight) < 1) return 'Price per night must be at least ₹1.';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { setFormError(err); return; }

    setSubmitting(true);
    setFormError('');

    try {
      const formData = new FormData();
      formData.append('name', form.name.trim());
      formData.append('location', form.location.trim());
      formData.append('description', form.description.trim());
      formData.append('totalSeats', form.totalSeats);
      formData.append('pricePerNight', form.pricePerNight);
      formData.append('isActive', form.isActive);
      
      photoFiles.forEach((f) => formData.append('photos', f));

      let res;
      if (editingHotel) {
        res = await apiInstance.put(`hotels/${editingHotel.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setHotels((prev) => prev.map((h) => (h.id === editingHotel.id ? res.data : h)));
      } else {
        res = await apiInstance.post('hotels', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setHotels((prev) => [res.data, ...prev]);
      }
      closeModal();
    } catch (err) {
      console.error('Hotel save error:', err);
      const errorMsg = err.response?.data?.message 
        || err.response?.data?.error
        || err.message 
        || 'Failed to save hotel. Please try again.';
      setFormError(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await apiInstance.delete(`hotels/${id}`);
      setHotels((prev) => prev.filter((h) => h.id !== id));
    } catch {
      setError('Failed to delete hotel. Please try again.');
    } finally {
      setDeleteConfirm(null);
    }
  };

  return (
    <div className='flex h-screen bg-gray-50'>
      <Sidebar />
      <div className='flex-1 flex flex-col overflow-hidden'>
        <AdminHeader />
        <main className='flex-1 overflow-y-auto p-6'>
          <div className='max-w-7xl mx-auto'>

            {/* Header */}
            <div className='flex items-center justify-between mb-8'>
              <div>
                <h1 className='text-3xl font-bold text-gray-800'>My Listings</h1>
                <p className='text-gray-500 mt-1'>Create and manage your hotel properties.</p>
              </div>
              <button
                onClick={openCreateModal}
                className='flex items-center gap-2 bg-[#6B8E23] text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-[#5a7a1c] transition shadow-sm'
              >
                <Plus size={18} /> Add Hotel
              </button>
            </div>

            {/* Error Banner */}
            {error && (
              <div className='bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 mb-6 text-sm'>
                {error}
              </div>
            )}

            {/* Loading */}
            {loading ? (
              <div className='flex items-center justify-center py-24'>
                <div className='w-10 h-10 border-4 border-[#6B8E23] border-t-transparent rounded-full animate-spin' />
              </div>
            ) : hotels.length === 0 ? (
              <div className='flex flex-col items-center justify-center py-24 text-center'>
                <div className='w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4'>
                  <Home size={36} className='text-gray-400' />
                </div>
                <h3 className='text-xl font-semibold text-gray-700 mb-2'>No listings yet</h3>
                <p className='text-gray-500 mb-6 max-w-sm'>
                  Add your first hotel so travellers can discover and book it.
                </p>
                <button
                  onClick={openCreateModal}
                  className='flex items-center gap-2 bg-[#6B8E23] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#5a7a1c] transition'
                >
                  <Plus size={18} /> Add Your First Hotel
                </button>
              </div>
            ) : (
              <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
                {hotels.map((hotel) => (
                  <HotelCard
                    key={hotel.id}
                    hotel={hotel}
                    onEdit={() => openEditModal(hotel)}
                    onDelete={() => setDeleteConfirm(hotel.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {showModal && (
        <HotelFormModal
          editing={editingHotel}
          form={form}
          formError={formError}
          submitting={submitting}
          photoFiles={photoFiles}
          photoPreviews={photoPreviews}
          existingPhotos={existingPhotos}
          onChange={handleChange}
          onPhotoSelect={handlePhotoSelect}
          onRemoveNewPhoto={removeNewPhoto}
          onRemoveExistingPhoto={removeExistingPhoto}
          onSubmit={handleSubmit}
          onClose={closeModal}
        />
      )}

      {deleteConfirm && (
        <DeleteConfirmModal
          onConfirm={() => handleDelete(deleteConfirm)}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}
    </div>
  );
};

/* ─── Hotel Card ─────────────────────────────────────────────── */
const HotelCard = ({ hotel, onEdit, onDelete }) => {
  const cover = hotel.roomPhotoUrls?.[0];
  return (
    <div className='bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition'>
      {/* Cover photo or gradient */}
      {cover ? (
        <img src={cover} alt={hotel.name} className='h-40 w-full object-cover' />
      ) : (
        <div className='h-40 bg-gradient-to-br from-[#6B8E23] to-[#4a6b10] flex items-center justify-center'>
          <Home size={48} className='text-white opacity-60' />
        </div>
      )}

      <div className='p-5'>
        <div className='flex items-start justify-between gap-2 mb-2'>
          <h3 className='text-lg font-bold text-gray-800 leading-tight'>{hotel.name}</h3>
          <span className={`shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full ${hotel.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
            {hotel.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>

        <div className='flex items-center gap-1 text-gray-500 text-sm mb-2'>
          <MapPin size={14} /><span>{hotel.location}</span>
        </div>

        {hotel.description && (
          <p className='text-gray-500 text-sm mb-3 line-clamp-2'>{hotel.description}</p>
        )}

        <div className='flex items-center gap-4 text-sm mb-4 flex-wrap'>
          <div className='flex items-center gap-1 text-gray-600'>
            <Users size={14} />
            <span>{hotel.availableSeats ?? hotel.totalSeats}/{hotel.totalSeats} rooms</span>
          </div>
          <div className='flex items-center gap-1 text-gray-600'>
            <DollarSign size={14} />
            <span>₹{Number(hotel.pricePerNight).toLocaleString()}/night</span>
          </div>
          {hotel.avgRating > 0 && (
            <div className='flex items-center gap-1 text-yellow-500'>
              <Star size={14} fill='currentColor' />
              <span className='text-gray-600'>{hotel.avgRating?.toFixed(1)}</span>
            </div>
          )}
          {hotel.roomPhotoUrls?.length > 0 && (
            <div className='flex items-center gap-1 text-gray-400 text-xs'>
              <ImageIcon size={13} />
              <span>{hotel.roomPhotoUrls.length} photo{hotel.roomPhotoUrls.length > 1 ? 's' : ''}</span>
            </div>
          )}
        </div>

        <div className='flex gap-2'>
          <button
            onClick={onEdit}
            className='flex-1 flex items-center justify-center gap-1.5 border border-[#6B8E23] text-[#6B8E23] py-2 rounded-lg text-sm font-semibold hover:bg-[#6B8E23] hover:text-white transition'
          >
            <Edit2 size={14} /> Edit
          </button>
          <button
            onClick={onDelete}
            className='flex-1 flex items-center justify-center gap-1.5 border border-red-400 text-red-500 py-2 rounded-lg text-sm font-semibold hover:bg-red-500 hover:text-white transition'
          >
            <Trash2 size={14} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── Hotel Form Modal ───────────────────────────────────────── */
const HotelFormModal = ({
  editing, form, formError, submitting,
  photoFiles, photoPreviews, existingPhotos,
  onChange, onPhotoSelect, onRemoveNewPhoto, onRemoveExistingPhoto,
  onSubmit, onClose,
}) => {
  const fileInputRef = useRef(null);
  const totalPhotos = existingPhotos.length + photoFiles.length;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4'>
      <div className='bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto'>

        {/* Header */}
        <div className='flex items-center justify-between px-6 py-5 border-b border-gray-100 sticky top-0 bg-white z-10'>
          <h2 className='text-xl font-bold text-gray-800'>
            {editing ? 'Edit Hotel' : 'Add New Hotel'}
          </h2>
          <button onClick={onClose} className='p-2 hover:bg-gray-100 rounded-lg transition'>
            <X size={20} className='text-gray-500' />
          </button>
        </div>

        <form onSubmit={onSubmit} className='px-6 py-5 space-y-4'>
          {formError && (
            <div className='bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm'>
              {formError}
            </div>
          )}

          {/* Hotel Name */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Hotel Name <span className='text-red-500'>*</span>
            </label>
            <input
              type='text' name='name' value={form.name} onChange={onChange}
              placeholder='e.g. The Grand Palace'
              className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B8E23] text-sm'
            />
          </div>

          {/* Location */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Location <span className='text-red-500'>*</span>
            </label>
            <input
              type='text' name='location' value={form.location} onChange={onChange}
              placeholder='e.g. Goa, India'
              className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B8E23] text-sm'
            />
          </div>

          {/* Description */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Description</label>
            <textarea
              name='description' value={form.description} onChange={onChange}
              rows={3} placeholder='Describe your property...'
              className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B8E23] text-sm resize-none'
            />
          </div>

          {/* Rooms + Price */}
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Total Rooms <span className='text-red-500'>*</span>
              </label>
              <input
                type='number' name='totalSeats' value={form.totalSeats} onChange={onChange}
                min='1' placeholder='e.g. 10'
                className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B8E23] text-sm'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Price / Night (₹) <span className='text-red-500'>*</span>
              </label>
              <input
                type='number' name='pricePerNight' value={form.pricePerNight} onChange={onChange}
                min='1' placeholder='e.g. 2500'
                className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B8E23] text-sm'
              />
            </div>
          </div>

          {/* ── Room Photos ── */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Room Photos <span className='text-gray-400 font-normal'>(up to 5)</span>
            </label>

            {/* Existing photos (edit mode) */}
            {existingPhotos.length > 0 && (
              <div className='mb-3'>
                <p className='text-xs text-gray-500 mb-1.5'>Current photos</p>
                <div className='flex flex-wrap gap-2'>
                  {existingPhotos.map((url, i) => (
                    <div key={i} className='relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200'>
                      <img src={url} alt={`room-${i}`} className='w-full h-full object-cover' />
                      <button
                        type='button'
                        onClick={() => onRemoveExistingPhoto(i)}
                        className='absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600'
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New photo previews */}
            {photoPreviews.length > 0 && (
              <div className='mb-3'>
                <p className='text-xs text-gray-500 mb-1.5'>New photos to upload</p>
                <div className='flex flex-wrap gap-2'>
                  {photoPreviews.map((src, i) => (
                    <div key={i} className='relative w-20 h-20 rounded-lg overflow-hidden border border-[#6B8E23]'>
                      <img src={src} alt={`preview-${i}`} className='w-full h-full object-cover' />
                      <button
                        type='button'
                        onClick={() => onRemoveNewPhoto(i)}
                        className='absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600'
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload button */}
            {totalPhotos < 5 && (
              <>
                <input
                  ref={fileInputRef}
                  type='file'
                  accept='image/*'
                  multiple
                  className='hidden'
                  onChange={onPhotoSelect}
                />
                <button
                  type='button'
                  onClick={() => fileInputRef.current?.click()}
                  className='flex items-center gap-2 border-2 border-dashed border-gray-300 text-gray-500 px-4 py-3 rounded-lg w-full hover:border-[#6B8E23] hover:text-[#6B8E23] transition text-sm font-medium'
                >
                  <ImagePlus size={18} />
                  {totalPhotos === 0 ? 'Upload room photos' : `Add more (${5 - totalPhotos} remaining)`}
                </button>
              </>
            )}
          </div>

          {/* Active toggle */}
          <div className='flex items-center gap-3'>
            <input
              type='checkbox' id='isActive' name='isActive'
              checked={form.isActive} onChange={onChange}
              className='w-4 h-4 accent-[#6B8E23]'
            />
            <label htmlFor='isActive' className='text-sm font-medium text-gray-700'>
              List as active (visible to travellers)
            </label>
          </div>

          {/* Buttons */}
          <div className='flex gap-3 pt-2'>
            <button
              type='button' onClick={onClose}
              className='flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition text-sm'
            >
              Cancel
            </button>
            <button
              type='submit' disabled={submitting}
              className='flex-1 py-2.5 bg-[#6B8E23] text-white rounded-lg font-semibold hover:bg-[#5a7a1c] transition disabled:opacity-50 disabled:cursor-not-allowed text-sm'
            >
              {submitting
                ? (photoFiles.length > 0 ? 'Uploading...' : 'Saving...')
                : (editing ? 'Save Changes' : 'Create Hotel')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ─── Delete Confirm Modal ───────────────────────────────────── */
const DeleteConfirmModal = ({ onConfirm, onCancel }) => (
  <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4'>
    <div className='bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center'>
      <div className='w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4'>
        <Trash2 size={28} className='text-red-500' />
      </div>
      <h3 className='text-lg font-bold text-gray-800 mb-2'>Delete Hotel?</h3>
      <p className='text-gray-500 text-sm mb-6'>
        This will permanently remove the hotel and all its data. This cannot be undone.
      </p>
      <div className='flex gap-3'>
        <button onClick={onCancel} className='flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition text-sm'>
          Cancel
        </button>
        <button onClick={onConfirm} className='flex-1 py-2.5 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition text-sm'>
          Delete
        </button>
      </div>
    </div>
  </div>
);

export default ProviderListings;
