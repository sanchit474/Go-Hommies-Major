import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MapPin, DollarSign, Calendar, Users } from "lucide-react";
import { FetchPost } from "../../../ApiCall";
import { setAllPosts } from "../../Store/AllPostsSlice";

const UserTrips = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.UserData);
  const allPosts = useSelector((state) => state.AllPosts);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await FetchPost();
        if (response?.data?.posts) {
          dispatch(setAllPosts(response.data.posts));
        }
      } catch (err) {
        setError("Failed to fetch trips");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [dispatch]);

  const optedTrips = Array.isArray(allPosts)
    ? allPosts.filter((post) => {
        const interestedPersons = post?.interested_persons || [];
        const currentUserId = currentUser?._id;
        if (!currentUserId) return false;
        
        return interestedPersons.some((person) => {
          const personId = typeof person === 'string' ? person : person?._id;
          return personId === currentUserId;
        });
      })
    : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <p className="text-gray-400">Loading your trips...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-10">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (optedTrips.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <p className="text-gray-400 text-lg mb-4">
          You haven't opted into any trips yet
        </p>
        <p className="text-gray-500 text-sm">
          Explore posts and click "Opt In" to join a trip!
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-white mb-8">My Trips ({optedTrips.length})</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {optedTrips.map((trip) => (
          <div
            key={trip._id}
            className="bg-[#1a1a1a] rounded-lg overflow-hidden hover:shadow-lg transition-shadow border border-gray-700"
          >
            {trip.image && (
              <div className="h-48 bg-gray-800 overflow-hidden">
                <img
                  src={trip.image}
                  alt={trip.destination}
                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                />
              </div>
            )}

            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-1">
                    {trip.destination}
                  </h3>
                  <p className="text-sm text-gray-400 line-clamp-2">
                    {trip.description}
                  </p>
                </div>
              </div>

              <div className="space-y-3 mt-4 pt-4 border-t border-gray-600">
                <div className="flex items-center gap-3">
                  <Calendar size={18} className="text-[#6B8E23]" />
                  <span className="text-sm text-gray-300">
                    {trip.TravelMonth || "TBD"}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin size={18} className="text-[#6B8E23]" />
                  <span className="text-sm text-gray-300">
                    {trip.destination || "Destination"}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <DollarSign size={18} className="text-[#6B8E23]" />
                  <span className="text-sm text-gray-300">
                    ₹{trip.BudgetPerPerson || "N/A"} per person
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Users size={18} className="text-[#6B8E23]" />
                  <span className="text-sm text-gray-300">
                    {trip.interested_persons?.length || 0}/{trip.totalPersons || "∞"} interested
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-600">
                <p className="text-xs text-gray-500">
                  Posted by <span className="text-gray-300 font-medium">{trip.userId?.name || "User"}</span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserTrips;
