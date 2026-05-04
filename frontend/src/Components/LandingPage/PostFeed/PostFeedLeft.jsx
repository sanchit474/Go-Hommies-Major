import React, { useState, useEffect } from "react";
import Image1 from "../../../assets/1.jpg";
import Image2 from "../../../assets/2.jpg";
import Image3 from "../../../assets/3.jpg";
import Image4 from "../../../assets/4.jpg";
import Image5 from "../../../assets/5.jpg";

const PostFeedLeft = () => {
  const [imagesLoaded, setImagesLoaded] = useState(false);

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

  useEffect(() => {
    const images = [Image1, Image2, Image3, Image4, Image5];

    preloadImages(images)
      .then(() => setImagesLoaded(true))
      .catch((error) => console.error("❌ Failed to load images:", error));
  }, []);

  if (!imagesLoaded) return null;

  return (
    <div className="flex-[0.70] h-full w-full flex flex-col justify-between gap-4 pb-4">

      {/* Kerala Card */}
      <div className="relative w-full h-full rounded-3xl border border-[#d7d7d8] overflow-hidden bg-white">
        <img src={Image1} alt="Kerala" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/20"></div>

        <div className="absolute bottom-10 left-5 text-white poppins">
          <h1 className="text-[1.5rem] font-semibold">Kerala</h1>
          <p>God's Own Country</p>
        </div>
      </div>

      {/* Jhansi Card */}
      <div className="relative w-full h-full rounded-3xl border border-[#d7d7d8] overflow-hidden bg-white">
        <img src={Image5} alt="Jhansi" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/20"></div>

        <div className="absolute bottom-10 left-5 text-white poppins">
          <h1 className="text-[1.5rem] font-semibold">Jhansi</h1>
          <p>The Land of Rani Lakshmi Bai</p>
        </div>
      </div>

    </div>
  );
};

export default PostFeedLeft;
