import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Alert, Snackbar } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PostCard from "../../Components/Feed/PostCard";
import { GetTripPostById } from "../../../ApiCall";

const PostDetails = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPost = async () => {
      setLoading(true);
      const response = await GetTripPostById(tripId);

      if (response?.status === 200 && response.data) {
        setPost(response.data);
      } else {
        setError(response?.data?.message || response?.data?.msg || "Unable to load post.");
      }

      setLoading(false);
    };

    loadPost();
  }, [tripId]);

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#FAFAFA] pt-[100px] px-4 pb-10">
      <div className="w-full max-w-2xl">
        <button
          onClick={() => navigate("/userprofile")}
          className="mb-4 inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-[#d7d7d8] bg-white hover:bg-[#f4f4f4] transition"
        >
          <ArrowBackIcon fontSize="small" />
          Back to profile
        </button>

        {loading ? (
          <div className="bg-white rounded-lg border border-[#e0e0e0] py-12 text-center text-gray-500">
            Loading post...
          </div>
        ) : post ? (
          <PostCard
            postId={post._id}
            user={post.userId}
            desc={post.description}
            budget={post.BudgetPerPerson}
            TravelMonth={post.TravelMonth}
            destination={post.destination}
            totalPersons={post.totalPersons}
            time={post.createdAt}
            initialOptedIn={false}
            initialOptCount={0}
            likeCount={post.likeCount || 0}
            image={post.image}
          />
        ) : (
          <div className="bg-white rounded-lg border border-[#e0e0e0] py-12 text-center text-gray-500">
            Post not found.
          </div>
        )}
      </div>

      <Snackbar
        open={Boolean(error)}
        autoHideDuration={3000}
        onClose={() => setError("")}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="error" variant="filled">
          {error}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default PostDetails;
