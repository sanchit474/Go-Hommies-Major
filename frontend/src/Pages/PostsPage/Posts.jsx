import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import PostCard from '../../Components/Feed/PostCard'
import { setAllPosts } from '../../Store/AllPostsSlice'
import { FetchPost, CreatePost } from '../../../ApiCall'
import Footer from '../../Components/Footer/Footer'
import { Snackbar, Alert } from '@mui/material'
import { Calendar, MapPin, Users, Sparkles } from 'lucide-react'

const Posts = () => {
  const dispatch = useDispatch()
  const posts = useSelector((state) => state.AllPosts || [])
  const userData = useSelector((state) => state.UserData)
  const [loading, setLoading] = useState(true)
  const [openAlert, setOpenAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [alertSeverity, setAlertSeverity] = useState('info')
  const feedPosts = [...(Array.isArray(posts) ? posts : [])].sort(
    (left, right) => new Date(right?.createdAt || 0) - new Date(left?.createdAt || 0)
  )

  const totalOpenSeats = feedPosts.reduce((count, post) => {
    const totalPersons = Number(post?.totalPersons || 0)
    const interestedCount = Number(post?.interested_persons?.length || 0)
    return count + Math.max(0, totalPersons - interestedCount)
  }, 0)

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const response = await FetchPost()
      if (response.status === 200) {
        const postsData = response.data.posts || response.data.data || response.data || []
        dispatch(setAllPosts(Array.isArray(postsData) ? postsData : []))
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()

    const handlePostCreated = () => {
      fetchPosts()
    }

    window.addEventListener('postCreated', handlePostCreated)
    return () => window.removeEventListener('postCreated', handlePostCreated)
  }, [dispatch])

  return (
    <div className='min-h-screen bg-[radial-gradient(circle_at_top,_rgba(107,142,35,0.10),_transparent_30%),linear-gradient(180deg,_#fbfcf7_0%,_#f6f7f2_35%,_#ffffff_100%)] pt-[100px]'>
      <div className='mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 pb-10 lg:px-6'>
        <section className='overflow-hidden rounded-[32px] border border-white/70 bg-white/85 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur'>
          <div className='grid gap-6 p-6 lg:grid-cols-[1.4fr_0.9fr] lg:p-8'>
            <div className='flex flex-col justify-between gap-6'>
              <div className='inline-flex w-fit items-center gap-2 rounded-full border border-[#dbe4be] bg-[#f4f8e8] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#6B8E23]'>
                <Sparkles size={14} />
                Public trip feed
              </div>

              <div className='max-w-2xl'>
                <h1 className='text-4xl font-black tracking-tight text-slate-900 sm:text-5xl'>
                  Trips people are creating right now.
                </h1>
                <p className='mt-4 max-w-xl text-base leading-7 text-slate-600'>
                  Browse public trip posts like a social feed, find trips with open spots, and request to join the ones that fit your route, budget, and travel style.
                </p>
              </div>

              <div className='flex flex-wrap gap-3'>
                <div className='flex items-center gap-3 rounded-2xl border border-[#e6e8d9] bg-white px-4 py-3 shadow-sm'>
                  <div className='rounded-full bg-[#eef5d7] p-2 text-[#6B8E23]'>
                    <MapPin size={16} />
                  </div>
                  <div>
                    <p className='text-xs uppercase tracking-[0.16em] text-slate-500'>Trips available</p>
                    <p className='text-lg font-bold text-slate-900'>{feedPosts.length}</p>
                  </div>
                </div>

                <div className='flex items-center gap-3 rounded-2xl border border-[#e6e8d9] bg-white px-4 py-3 shadow-sm'>
                  <div className='rounded-full bg-[#eef5d7] p-2 text-[#6B8E23]'>
                    <Users size={16} />
                  </div>
                  <div>
                    <p className='text-xs uppercase tracking-[0.16em] text-slate-500'>Open seats</p>
                    <p className='text-lg font-bold text-slate-900'>{totalOpenSeats}</p>
                  </div>
                </div>

                <div className='flex items-center gap-3 rounded-2xl border border-[#e6e8d9] bg-white px-4 py-3 shadow-sm'>
                  <div className='rounded-full bg-[#eef5d7] p-2 text-[#6B8E23]'>
                    <Calendar size={16} />
                  </div>
                  <div>
                    <p className='text-xs uppercase tracking-[0.16em] text-slate-500'>Share a trip</p>
                    <p className='text-lg font-bold text-slate-900'>Join requests enabled</p>
                  </div>
                </div>
              </div>
            </div>

            <div className='rounded-[28px] bg-[linear-gradient(160deg,_#7ea725_0%,_#5f7f1b_100%)] p-6 text-white shadow-lg'>
              <p className='text-xs font-semibold uppercase tracking-[0.2em] text-white/80'>How it works</p>
              <div className='mt-5 space-y-4 text-sm leading-6 text-white/95'>
                <div className='rounded-2xl bg-white/10 p-4 backdrop-blur-sm'>
                  <p className='font-bold'>1. Post your trip</p>
                  <p className='mt-1 text-white/85'>Add destination, dates, budget, seats, and a photo so travelers can quickly understand the plan.</p>
                </div>
                <div className='rounded-2xl bg-white/10 p-4 backdrop-blur-sm'>
                  <p className='font-bold'>2. Travelers discover it</p>
                  <p className='mt-1 text-white/85'>Your trip appears in the community feed where people can like, comment, and check the details.</p>
                </div>
                <div className='rounded-2xl bg-white/10 p-4 backdrop-blur-sm'>
                  <p className='font-bold'>3. People request to join</p>
                  <p className='mt-1 text-white/85'>Interested travelers can request a spot directly from the post and you can approve them later.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {loading && (
          <div className='flex items-center justify-center rounded-[28px] border border-[#e5e7db] bg-white py-16 shadow-sm'>
            <p className='text-slate-500'>Loading public trips...</p>
          </div>
        )}

        {!loading && feedPosts.length === 0 && (
          <div className='flex items-center justify-center rounded-[28px] border border-dashed border-[#d6ddc0] bg-white py-16 text-center shadow-sm'>
            <div>
              <p className='text-lg font-semibold text-slate-900'>No public trips yet</p>
              <p className='mt-2 text-slate-500'>Be the first to publish a trip so others can discover and join it.</p>
            </div>
          </div>
        )}

        <div className='mx-auto flex max-w-[760px] flex-col gap-8'>
          {feedPosts.map((post) => (
            <PostCard
              key={post._id}
              postId={post._id}
              user={post.userId}
              desc={post.description}
              budget={post.BudgetPerPerson}
              TravelMonth={post.TravelMonth}
              destination={post.destination}
              totalPersons={post.totalPersons}
              time={post.createdAt}
              initialOptedIn={post.interested_persons?.some(
                (person) => person._id === localStorage.getItem('userId')
              ) || false}
              initialOptCount={post.interested_persons?.length || 0}
              likeCount={post.likeCount || 0}
              image={post.image}
            />
          ))}
        </div>
      </div>

      <Snackbar
        open={openAlert}
        autoHideDuration={3000}
        onClose={() => setOpenAlert(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={alertSeverity} variant="filled">
          {alertMessage}
        </Alert>
      </Snackbar>

      <Footer />
    </div>
  )
}

export default Posts
