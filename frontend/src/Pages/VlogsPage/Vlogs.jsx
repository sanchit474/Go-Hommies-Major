import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { FetchVlogs, CreateVlog } from '../../../ApiCall'
import { Snackbar, Alert } from "@mui/material"
import Footer from '../../Components/Footer/Footer';

const Vlogs = () => {
  const [vlogs, setVlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [openAlert, setOpenAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')

  const userData = useSelector((state) => state.UserData)

  useEffect(() => {
    fetchVlogs()
  }, [])

  const fetchVlogs = async () => {
    try {
      setLoading(true)
      const response = await FetchVlogs()
      if (response.status === 200) {
        setVlogs(Array.isArray(response.data) ? response.data : [])
      }
    } catch (error) {
      console.error('Error fetching vlogs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateVlog = async () => {
    if (!title.trim() || !description.trim() || !videoUrl.trim()) {
      setAlertMessage('Please fill in all fields')
      setOpenAlert(true)
      return
    }

    try {
      const response = await CreateVlog(title, description, videoUrl)
      if (response.status === 201 || response.status === 200) {
        setAlertMessage('Vlog created successfully!')
        setOpenAlert(true)
        setTitle('')
        setDescription('')
        setVideoUrl('')
        setShowForm(false)
        fetchVlogs()
      }
    } catch (error) {
      console.error('Error creating vlog:', error)
      setAlertMessage('Error creating vlog')
      setOpenAlert(true)
    }
  }

  return (
    <div className='flex flex-col items-center justify-start min-h-screen py-8 bg-[#FAFAFA] pt-[100px]'>
      <div className='w-full max-w-4xl px-4'>
        <div className='mb-8'>
          <h1 className='text-4xl font-bold mb-4'>Travel Vlogs</h1>
          <p className='text-gray-600 text-lg'>Share and discover travel experiences through videos</p>
        </div>

        {userData?.isAuthenticated && (
          <button
            onClick={() => setShowForm(!showForm)}
            className='mb-8 px-6 py-2 bg-[#6B8E23] text-white rounded-lg hover:bg-[#5a7a1c] transition'
          >
            {showForm ? 'Cancel' : 'Create New Vlog'}
          </button>
        )}

        {showForm && userData?.isAuthenticated && (
          <div className='mb-8 p-6 bg-white rounded-lg shadow-md border border-[#e0e0e0]'>
            <h2 className='text-2xl font-bold mb-4'>Create a New Vlog</h2>
            
            <div className='mb-4'>
              <label className='block text-sm font-medium mb-2'>Title</label>
              <input
                type='text'
                placeholder='Vlog title'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className='w-full px-4 py-2 border border-[#d7d7d8] rounded-lg focus:outline-none focus:border-[#6B8E23]'
              />
            </div>

            <div className='mb-4'>
              <label className='block text-sm font-medium mb-2'>Description</label>
              <textarea
                placeholder='Describe your vlog'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className='w-full px-4 py-2 border border-[#d7d7d8] rounded-lg focus:outline-none focus:border-[#6B8E23]'
              />
            </div>

            <div className='mb-6'>
              <label className='block text-sm font-medium mb-2'>Video URL (YouTube, Vimeo, etc.)</label>
              <input
                type='url'
                placeholder='https://youtu.be/...'
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className='w-full px-4 py-2 border border-[#d7d7d8] rounded-lg focus:outline-none focus:border-[#6B8E23]'
              />
            </div>

            <button
              onClick={handleCreateVlog}
              className='w-full px-6 py-2 bg-[#6B8E23] text-white rounded-lg hover:bg-[#5a7a1c] transition'
            >
              Publish Vlog
            </button>
          </div>
        )}

        {loading && (
          <div className='flex justify-center items-center py-12'>
            <p className='text-gray-500'>Loading vlogs...</p>
          </div>
        )}

        {!loading && vlogs.length === 0 && (
          <div className='flex justify-center items-center py-12 bg-white rounded-lg border border-[#e0e0e0]'>
            <p className='text-gray-500'>No vlogs yet. {userData?.isAuthenticated ? 'Create one!' : 'Sign in to create a vlog.'}</p>
          </div>
        )}

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {vlogs.map((vlog) => (
            <div key={vlog._id} className='bg-white rounded-lg shadow-md border border-[#e0e0e0] overflow-hidden hover:shadow-lg transition'>
              <div className='w-full aspect-video bg-black flex items-center justify-center'>
                {vlog.videoUrl && (
                  <iframe
                    width='100%'
                    height='100%'
                    src={vlog.videoUrl.replace('youtu.be/', 'youtube.com/embed/').replace('watch?v=', 'embed/')}
                    title={vlog.title}
                    frameBorder='0'
                    allowFullScreen
                  ></iframe>
                )}
              </div>
              
              <div className='p-4'>
                <h3 className='text-lg font-bold mb-2'>{vlog.title}</h3>
                <p className='text-gray-600 text-sm mb-4 line-clamp-2'>{vlog.description}</p>
                
                <div className='flex justify-between items-center text-xs text-gray-500'>
                  <span>{new Date(vlog.createdAt).toLocaleDateString()}</span>
                  <span>By {vlog.userId?.name || 'Anonymous'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Snackbar
        open={openAlert}
        autoHideDuration={3000}
        onClose={() => setOpenAlert(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="info" variant="filled">
          {alertMessage}
        </Alert>
      </Snackbar>

      <Footer />
    </div>
  )
}

export default Vlogs
