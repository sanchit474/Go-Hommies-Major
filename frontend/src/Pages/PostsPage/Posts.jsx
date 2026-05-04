import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import PostCard from '../../Components/Feed/PostCard'
import { setAllPosts } from '../../Store/AllPostsSlice'
import { FetchPost, CreatePost } from '../../../ApiCall'
import Footer from '../../Components/Footer/Footer'
import { Snackbar, Alert } from '@mui/material'

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
