import React, { useState, useEffect } from "react";
import { useScreenResizeValue } from "../../ScreenSizeFunction";
import { Star, MapPin, Users, DollarSign } from "lucide-react";

import Image1 from "../../assets/1.jpg";
import Image2 from "../../assets/2.jpg";
import Image3 from "../../assets/3.jpg";

const TopPackages = () => {
  const breakpoint = useScreenResizeValue();
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  const preloadImages = (images) => {
    const loaders = images.map(
      (src) =>
        new Promise((resolve, reject) => {
          const img = new Image();
          img.src = src;
          img.onload = resolve;
          img.onerror = reject;
        })
    );
    return Promise.all(loaders);
  };

  useEffect(() => {
    const imgs = [Image1, Image2, Image3];
    preloadImages(imgs)
      .then(() => setImagesLoaded(true))
      .catch((err) => console.error("Image failed to load", err));
  }, []);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch('http://localhost:8001/package/fetch?sort=rating');
        if (response.ok) {
          const data = await response.json();
          setPackages(data.slice(0, 6));
        }
      } catch (error) {
        console.log("Using default packages due to:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  const TopPackagesArray = packages.length > 0 ? packages.map((pkg, i) => ({
    id: pkg._id,
    image: pkg.coverImage || [Image1, Image2, Image3][i % 3],
    name: pkg.name,
    design: `${pkg.duration}${pkg.durationUnit === 'days' ? 'D' : 'W'} • ₹${pkg.basePrice}`,
    location: pkg.destination,
    rating: pkg.rating || 4.5,
    difficulty: pkg.difficulty,
  })) : [
    {
      image: Image1,
      name: "Kerala Paradise",
      design: "5D/4N • ₹25,000",
      location: "Kerala",
      rating: 4.8,
      difficulty: "Easy",
    },
    {
      image: Image2,
      name: "Himalayan Adventure",
      design: "7D/6N • ₹35,000",
      location: "Manali",
      rating: 4.6,
      difficulty: "Moderate",
    },
    {
      image: Image3,
      name: "Mountain Escape",
      design: "4D/3N • ₹20,000",
      location: "Himachal",
      rating: 4.7,
      difficulty: "Moderate",
    },
  ];

  if (!imagesLoaded && !loading) return null;

  return (
    <div className="flex items-center justify-center overflow-hidden w-full py-[3rem] px-4 bg-slate-50">
      <div
        className={`${
          breakpoint <= 1440 ? "w-[96%]" : "w-[1392px]"
        } flex flex-col items-center justify-center gap-[2rem]`}
      >
        {/* ------------ TEXT SECTION ------------ */}
        <div className="flex flex-col items-center justify-center">
          <span className="px-6 py-1.5 rounded-full bg-primary/10 text-primary text-xs md:text-sm font-semibold border border-primary/20">
            ✨ Popular Destinations
          </span>

          <h1 className="text-3xl md:text-5xl text-center capitalize font-bold mt-6 leading-tight text-slate-900">
            Explore Trending <br className="hidden md:block" /> Travel Packages
          </h1>

          <p className="text-sm md:text-base text-center w-full md:w-[60%] mt-5 text-slate-600 leading-relaxed">
            Discover curated travel experiences designed for adventurers. From serene backwaters to majestic mountains, find your perfect destination with our handpicked packages.
          </p>
        </div>

        {/* ------------ PACKAGES GRID ------------ */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {TopPackagesArray.map((pkg, index) => (
            <div
              key={index}
              className="modern-card group cursor-pointer overflow-hidden"
            >
              {/* Image Container */}
              <div className="relative h-56 overflow-hidden bg-gray-200">
                <img
                  src={pkg.image}
                  alt={pkg.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                
                {/* Difficulty Badge */}
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-slate-900 text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm">
                    {pkg.difficulty}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-slate-900 line-clamp-2 group-hover:text-primary transition-colors">
                    {pkg.name}
                  </h3>
                  <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded text-amber-600">
                    <Star size={14} className="fill-amber-400 text-amber-400" />
                    <span className="text-xs font-bold">{pkg.rating}</span>
                  </div>
                </div>
                
                {/* Location */}
                <div className="flex items-center gap-2 text-slate-500 text-sm mb-4">
                  <MapPin size={16} className="text-primary" />
                  <span>{pkg.location}</span>
                </div>

                {/* Price & Duration */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <span className="text-slate-900 font-bold text-base">{pkg.design}</span>
                  <button className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-primary transition-colors duration-300 shadow-sm hover:shadow-primary/20">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopPackages;
