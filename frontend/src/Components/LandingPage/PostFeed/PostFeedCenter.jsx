import React, { useEffect, useState } from "react";
import PostCard from "../../Feed/PostCard";
import VlogCard from "../../Feed/VlogCard";
import { FetchPost, FetchVlogs } from "../../../../ApiCall";
import { useDispatch, useSelector } from "react-redux";
import { setAllPosts } from "../../../Store/AllPostsSlice";
import { setAllVlogs } from "../../../Store/AllVlogsSlice";
import { MapPin, DollarSign, Sliders } from "lucide-react";

const PostFeedCenter = ({ className }) => {
  const dispatch = useDispatch();
  const [responseShow, setResponseShow] = useState(false);
  const [BlogOrPost, setBlogOrPost] = useState("Posts");
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("recent");
  const [filterDestination, setFilterDestination] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const AllPosts = useSelector((state) => {
    const posts = state.AllPosts;
    return Array.isArray(posts) ? posts : [];
  });

  const AllVlogs = useSelector((state) => {
    const vlogs = state.AllVlogs;
    return Array.isArray(vlogs) ? vlogs : [];
  });

  const currentUser = useSelector((state) => state.UserData);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const postsRes = await FetchPost();
        const vlogsRes = await FetchVlogs();

        if (postsRes?.data?.msg === "Not Logged In") {
          setResponseShow(true);
          setLoading(false);
          return;
        }

        if (postsRes?.status === 200) {
          const posts = postsRes.data.posts || postsRes.data.data || postsRes.data || [];
          dispatch(setAllPosts(Array.isArray(posts) ? posts : []));
        }

        if (vlogsRes?.status === 200) {
          const vlogs = Array.isArray(vlogsRes.data) ? vlogsRes.data : [];
          dispatch(setAllVlogs(vlogs));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const handlePostCreated = () => {
      fetchData();
    };

    window.addEventListener("postCreated", handlePostCreated);
    return () => window.removeEventListener("postCreated", handlePostCreated);
  }, [dispatch]);

  // ❗ User not logged in
  if (responseShow) {
    return (
      <div className="border border-[#e0e0e0] px-4 py-4 rounded-[16px] flex-[.75] w-full">
        Please log in first to view the feed.
      </div>
    );
  }

  // ❗ Loading State
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh] text-lg font-medium">
        Loading posts...
      </div>
    );
  }

  const filteredPosts = AllPosts.filter((post) => {
    const matchesDestination = filterDestination === "" || 
      post.destination.toLowerCase().includes(filterDestination.toLowerCase());
    const matchesDifficulty = filterDifficulty === "" || 
      post.difficulty === filterDifficulty;
    return matchesDestination && matchesDifficulty;
  }).sort((a, b) => {
    if (sortBy === "recent") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (sortBy === "trending") {
      return (b.likeCount || 0) - (a.likeCount || 0);
    } else if (sortBy === "budget-low") {
      return a.BudgetPerPerson - b.BudgetPerPerson;
    } else if (sortBy === "budget-high") {
      return b.BudgetPerPerson - a.BudgetPerPerson;
    }
    return 0;
  });

  const filteredVlogs = AllVlogs.sort((a, b) => {
    if (sortBy === "recent") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (sortBy === "trending") {
      return (b.likeCount || 0) - (a.likeCount || 0);
    }
    return 0;
  });

  const dataToDisplay = BlogOrPost === "Posts" ? filteredPosts : filteredVlogs;

  return (
    <div
      className={`${className} custom-scrollbar-hide flex flex-col gap-4 w-full`}
    >
      {/* Toggle Switch */}
      <div className="w-full p-[.25rem] h-[73px] rounded-3xl flex items-center justify-between border border-[#d7d7d8] bg-white">
        <div
          className="w-[49%] text-center py-[.5rem] rounded-3xl relative overflow-hidden cursor-pointer"
          onClick={() => setBlogOrPost("Posts")}
        >
          <h1 className={`relative z-[200] ${BlogOrPost === "Posts" && "text-white"}`}>
            Posts
          </h1>

          <div
            className={`h-full bg-[#6B8E23] absolute top-0 z-[100] transition-all duration-200 ${
              BlogOrPost === "Posts" ? "w-[100%]" : "w-[0%]"
            }`}
          ></div>
        </div>

        <div
          className="w-[49%] text-center py-[.5rem] rounded-3xl relative overflow-hidden cursor-pointer"
          onClick={() => setBlogOrPost("Blogs")}
        >
          <h1 className={`relative z-[200] ${BlogOrPost === "Blogs" && "text-white"}`}>
            Blogs
          </h1>

          <div
            className={`h-full bg-[#6B8E23] absolute top-0 z-[100] transition-all duration-200 ${
              BlogOrPost === "Blogs" ? "w-[100%]" : "w-[0%]"
            }`}
          ></div>
        </div>
      </div>

      {/* Filter and Sort Controls */}
      <div className="w-full bg-white rounded-2xl border border-[#d7d7d8] p-4">
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-[#6B8E23] text-white rounded-lg hover:bg-[#5a7a1c] transition"
          >
            <Sliders size={16} />
            Filters
          </button>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-[#d7d7d8] rounded-lg text-sm focus:outline-none focus:border-[#6B8E23]"
          >
            <option value="recent">Most Recent</option>
            <option value="trending">Trending</option>
            <option value="budget-low">Budget: Low to High</option>
            <option value="budget-high">Budget: High to Low</option>
          </select>

          {showFilters && (
            <div className="w-full flex flex-wrap gap-3 pt-3 border-t border-[#d7d7d8]">
              <div className="flex-1 min-w-[200px]">
                <label className="text-sm text-gray-600 block mb-2">Destination</label>
                <div className="flex items-center gap-2 px-3 py-2 border border-[#d7d7d8] rounded-lg">
                  <MapPin size={16} className="text-[#6B8E23]" />
                  <input
                    type="text"
                    placeholder="Filter by destination..."
                    value={filterDestination}
                    onChange={(e) => setFilterDestination(e.target.value)}
                    className="flex-1 outline-none text-sm"
                  />
                </div>
              </div>

              <div className="flex-1 min-w-[200px]">
                <label className="text-sm text-gray-600 block mb-2">Difficulty</label>
                <select
                  value={filterDifficulty}
                  onChange={(e) => setFilterDifficulty(e.target.value)}
                  className="w-full px-3 py-2 border border-[#d7d7d8] rounded-lg text-sm focus:outline-none focus:border-[#6B8E23]"
                >
                  <option value="">All Difficulties</option>
                  <option value="Easy">Easy</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Challenging">Challenging</option>
                </select>
              </div>

              {(filterDestination || filterDifficulty) && (
                <button
                  onClick={() => {
                    setFilterDestination("");
                    setFilterDifficulty("");
                  }}
                  className="px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Content List */}
      <div className="space-y-4">
        {BlogOrPost === "Posts" ? (
          Array.isArray(filteredPosts) && filteredPosts.length > 0 ? (
            filteredPosts.map((post, index) => {
              const interestedPersons = post?.interested_persons || [];
              const userId = post?.userId;
              const currentUserId = currentUser?._id;
              
              const isOptedIn = interestedPersons.some(person => {
                const personId = typeof person === 'string' ? person : person?._id;
                return personId === currentUserId;
              });

              return (
                <PostCard
                  key={index}
                  postId={post._id}
                  user={userId}
                  desc={post.description}
                  budget={post.BudgetPerPerson}
                  TravelMonth={post.TravelMonth}
                  destination={post.destination}
                  totalPersons={post.totalPersons}
                  stats={post.stats}
                  time={post.createdAt}
                  initialOptedIn={isOptedIn}
                  initialOptCount={interestedPersons.length}
                  interestedPersons={interestedPersons}
                  likedPerson={post.likedBy}
                  likeCount={post.likeCount}
                  likes={post.likes}
                  image={post.image}
                />
              );
            })
          ) : (
            <p className="text-center text-gray-500 mt-4">No posts available.</p>
          )
        ) : (
          Array.isArray(filteredVlogs) && filteredVlogs.length > 0 ? (
            filteredVlogs.map((vlog, index) => (
              <VlogCard
                key={index}
                vlogId={vlog._id}
                title={vlog.title}
                description={vlog.description}
                videoUrl={vlog.videoUrl}
                user={vlog.userId}
                likeCount={vlog.likeCount || 0}
                likes={vlog.likes}
                time={vlog.createdAt}
              />
            ))
          ) : (
            <p className="text-center text-gray-500 mt-4">No vlogs available.</p>
          )
        )}
      </div>
    </div>
  );
};

export default PostFeedCenter;
