import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Images
import Image1 from "../../../assets/1.jpg";
import Image2 from "../../../assets/2.jpg";
import Image3 from "../../../assets/3.jpg";
import Image4 from "../../../assets/4.jpg";
import Image5 from "../../../assets/5.jpg";

const PostFeedRight = () => {
  const navigate = useNavigate();
  const preloadImages = (images) => {
    const promises = images.map((src) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = resolve;
        img.onerror = reject;
      });
    });

    return Promise.all(promises);
  };

  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    const images = [Image1, Image2, Image3, Image4, Image5];

    preloadImages(images)
      .then(() => setImagesLoaded(true))
      .catch((err) => console.error("❌ Image preload failed:", err));
  }, []);

  if (!imagesLoaded) return null;

  return (
    <div className="flex-[0.70] h-full w-full flex flex-col justify-between gap-2 pb-4">

      <div className="h-full w-full border border-[#d7d7d8] rounded-3xl overflow-hidden poppins bg-[linear-gradient(0deg,hsla(234,80%,88%,1)_0%,hsla(340,68%,88%,1)_50%,hsla(342,72%,85%,1)_100%)] flex flex-col items-start justify-end gap-4 p-6">

        <h1 className="font-semibold text-[2rem] leading-tight text-gray-900">
          Start <br /> Customizing
        </h1>

        <p className="text-gray-700 text-sm">Create your travel post and find the perfect travel buddies for your next adventure.</p>

        <button 
          onClick={() => navigate('/createpost')}
          className="px-6 py-3 bg-[#6B8E23] hover:bg-[#5a7a1c] text-white rounded-lg text-[0.875rem] w-full flex items-center justify-between transition duration-300 font-medium"
        >
          Create a Post

          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-arrow-right"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>

        </button>

      </div>

    </div>
  );
};

export default PostFeedRight;
