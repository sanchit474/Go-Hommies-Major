import React, { useEffect, useRef, useState } from "react";
import { MapPin, Tag, Calendar, Users, Heart, MessageCircle, Share2 } from "lucide-react";
import timeAgo from "../TimeStamp/timeAgo";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { PostImages, LikePost, UnlikePost, CommentOnPost, OptInToPost, OptOutFromPost, UpdateTrip, DeleteTrip } from "../../../ApiCall";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { updatePost } from "../../Store/AllPostsSlice";

const PostCard = (props) => {
  const dispatch = useDispatch();
  const {
    postId,
    user,
    desc,
    budget,
    TravelMonth,
    destination,
    totalPersons,
    stats,
    time,
    initialOptedIn,
    initialOptCount,
    image,
  } = props;

  const [optedIn, setOptedIn] = useState(props.initialOptedIn);
  const [optCount, setOptCount] = useState(props.initialOptCount);
  const [interestedPersons, setInterestedPersons] = useState(props.interestedPersons || []);
  const [showInterestedModal, setShowInterestedModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isOptLoading, setIsOptLoading] = useState(false);
  const maxOpt = Number(props.totalPersons || 0);
  const isFull = maxOpt > 0 ? optCount >= maxOpt : false;

  const handleOptToggle = async () => {
    if (!postId) {
      console.error("Invalid postId");
      return;
    }

    if (isFull && !optedIn) {
      setSuccessMessage("This trip is full! Try opting in to a different trip.");
      setTimeout(() => setSuccessMessage(''), 3000);
      return;
    }

    setIsOptLoading(true);
    try {
      const response = optedIn 
        ? await OptOutFromPost(postId)
        : await OptInToPost(postId, "I would like to join this trip.");

      if (response?.status === 200 || response?.status === 201 || response?.status === 204) {
        if (!optedIn) {
          setOptedIn(true);
          setOptCount((prev) => prev + 1);
          setSuccessMessage("Join request sent successfully. Wait for trip owner approval.");
        } else {
          setOptedIn(false);
          setOptCount((prev) => Math.max(0, prev - 1));
          setSuccessMessage("You left this trip.");
        }
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        console.error("Failed to toggle opt status:", response?.data?.message || response?.data?.msg);
        setSuccessMessage(response?.data?.message || response?.data?.msg || "Error updating join status");
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (error) {
      console.error("Error toggling opt status:", error);
      setSuccessMessage("Error updating join status");
      setTimeout(() => setSuccessMessage(''), 3000);
    } finally {
      setIsOptLoading(false);
    }
  };

  console.log("userid",props.user);

  // Autoplay plugin for Keen Slider v6
  function AutoplayPlugin(slider) {
    let timeout;
    let mouseOver = false;

    function clearNextTimeout() {
      clearTimeout(timeout);
    }

    function nextTimeout() {
      clearTimeout(timeout);
      if (mouseOver) return;
      timeout = setTimeout(() => {
        slider.next();
      }, 3000);
    }

    slider.on("created", () => {
      slider.container.addEventListener("mouseover", () => {
        mouseOver = true;
        clearNextTimeout();
      });
      slider.container.addEventListener("mouseout", () => {
        mouseOver = false;
        nextTimeout();
      });
      nextTimeout();
    });

    slider.on("dragStarted", clearNextTimeout);
    slider.on("animationEnded", nextTimeout);
    slider.on("updated", nextTimeout);
  }

  const [currentSlide, setCurrentSlide] = useState(0);

  const [sliderRef, instanceRef] = useKeenSlider(
    {
      loop: true,
      slides: { perView: 1 },
      slideChanged(slider) {
        setCurrentSlide(slider.track.details.rel);
      },
    },
    [AutoplayPlugin]
  );

  const handleDotClick = (idx) => {
    instanceRef.current?.moveToIdx(idx);
  };

  const [images, setImages] = useState([]);
  const [likeCount, setLikeCount] = useState(props.likeCount || 0);
  const [isLiked, setIsLiked] = useState(props.likes?.includes(props.user?._id) || false);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isCommentingLoading, setIsCommentingLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [tripDestination, setTripDestination] = useState(destination || "");
  const [tripDate, setTripDate] = useState(TravelMonth || "");
  const [tripBudget, setTripBudget] = useState(budget || "");
  const [tripTotalPersons, setTripTotalPersons] = useState(totalPersons || "");
  const [tripDescription, setTripDescription] = useState(desc || "");
  const profileImageSrc =
    props?.user?.profilePic ||
    props?.user?.profileUrl ||
    props?.user?.imageUrl ||
    "https://media.licdn.com/dms/image/v2/D4D03AQF34X7QsXcp9w/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1696980839339?e=1750291200&v=beta&t=yzKjXfViRYphtcwEpnKW8koJFqf3EkV_5rtPFADNbnQ";
  const loggedInEmail = (() => {
    if (props?.currentUserEmail) return props.currentUserEmail;
    try {
      const userState = localStorage.getItem("userState");
      if (!userState) return "";
      const parsed = JSON.parse(userState);
      return parsed?.email || "";
    } catch {
      return "";
    }
  })();
  const isOwner = Boolean(loggedInEmail && props?.user?.email && loggedInEmail === props.user.email);

  const handleLikeToggle = async () => {
    try {
      if (isLiked) {
        const response = await UnlikePost(postId);
        if (response?.status === 200) {
          setIsLiked(false);
          setLikeCount(Math.max(0, likeCount - 1));
        }
      } else {
        const response = await LikePost(postId);
        if (response?.status === 200) {
          setIsLiked(true);
          setLikeCount(likeCount + 1);
        }
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return;

    setIsCommentingLoading(true);
    try {
      const response = await CommentOnPost(postId, commentText);
      if (response?.status === 200) {
        setCommentText('');
        setShowCommentForm(false);
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsCommentingLoading(false);
    }
  };

  const handleShare = () => {
    const shareText = `Check out this amazing trip: ${destination}`;
    if (navigator.share) {
      navigator.share({
        title: destination,
        text: shareText,
      });
    } else {
      const url = window.location.href;
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  const handleEditTrip = async () => {
    if (!postId) return;
    setIsSavingEdit(true);
    const payload = {
      destination: tripDestination,
      startDate: tripDate,
      endDate: tripDate,
      budget: Number(tripBudget),
      totalPersons: Number(tripTotalPersons),
      description: tripDescription,
      isPublic: true,
    };

    const response = await UpdateTrip(postId, payload);
    if (response?.status === 200) {
      setSuccessMessage("Trip updated successfully.");
      setIsEditOpen(false);
      setTimeout(() => window.location.reload(), 600);
    } else {
      setSuccessMessage(response?.data?.message || response?.data?.msg || "Unable to update trip.");
    }
    setTimeout(() => setSuccessMessage(''), 3000);
    setIsSavingEdit(false);
  };

  const handleDeleteTrip = async () => {
    if (!postId) return;
    const confirmed = window.confirm("Delete this trip permanently?");
    if (!confirmed) return;
    setIsDeleting(true);
    const response = await DeleteTrip(postId);
    if (response?.status === 204 || response?.status === 200) {
      setSuccessMessage("Trip deleted successfully.");
      setTimeout(() => {
        if (window.location.pathname.includes("/posts/")) {
          window.location.href = "/userprofile";
        } else {
          window.location.reload();
        }
      }, 500);
    } else {
      setSuccessMessage(response?.data?.message || response?.data?.msg || "Unable to delete trip.");
    }
    setTimeout(() => setSuccessMessage(''), 3000);
    setIsDeleting(false);
  };

    
  return (
    <div
      className={`w-full max-w-[616px] poppins flex-shrink rounded-3xl bg-white flex flex-col border border-[#d7d7d8] h-full max-h-fit pt-[16px]`}
    >
      <div className="px-[24px] pb-2 flex  items-center">
        <div className="pl-2 lg:pl-0 rounded-[20px] shrink-0">
          {/* {props?.user?.profilePic && */}
          <img
            className="rounded-[50px]"
            width={50}
            height={50}
            src={profileImageSrc}
            alt={props?.user?.name || "Profile"}
          />
        </div>
        <div className="w-10/12 lg:w-full gap-[1px] lg:grow pl-2 lg:pl-4 min-h-16 lg:flex flex-col hidden items-start justify-center">
          <p className="text-[16px] font-medium text-gray-700">
            {props?.user && props?.user.name ? props?.user.name : "Anonymous"}
          </p>
          {props?.user?.title && (
            <p className="lg:text-sm text-[14px] text-[#57585C] w-full lg:block hidden ">
              {props.user.title}
            </p>
          )}
          {props?.user?.designation && (
            <p className="lg:text-xs flex items-center gap-[8px] text-[12px] w-full text-[#949497] font-medium truncate  ">
              <a
                className="hover:text-tertiaryBlue-600 font-normal text-tertiary-950 "
                href="/forum/accounting"
              >
                {props.user.designation}
                <span>&nbsp;</span>
              </a>
              <div>
                <svg
                  width="4"
                  height="4"
                  viewBox="0 0 4 4"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2.01342 4.5C1.40492 4.5 0.912752 4.31081 0.536913 3.93243C0.178971 3.55405 0 3.06757 0 2.47297C0 1.8964 0.178971 1.42793 0.536913 1.06757C0.912752 0.689189 1.40492 0.5 2.01342 0.5C2.63982 0.5 3.12304 0.689189 3.46309 1.06757C3.82103 1.42793 4 1.8964 4 2.47297C4 3.06757 3.82103 3.55405 3.46309 3.93243C3.12304 4.31081 2.63982 4.5 2.01342 4.5Z"
                    fill="#57585C"
                  ></path>
                </svg>
              </div>
              {props.time && timeAgo(props.time)}
            </p>
          )}
        </div>
        <div className="flex justify-center">
          <div className="relative">
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="hover:bg-[#d7d7d8] cursor-pointer rounded-md lg:py-1"
              aria-label="Options menu"
              id="headlessui-menu-button-46"
              type="button"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <div>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 22 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.0002 11.9166C11.5064 11.9166 11.9168 11.5062 11.9168 10.9999C11.9168 10.4937 11.5064 10.0833 11.0002 10.0833C10.4939 10.0833 10.0835 10.4937 10.0835 10.9999C10.0835 11.5062 10.4939 11.9166 11.0002 11.9166Z"
                    stroke="#5F5F5F"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                  <path
                    d="M11.0002 5.50008C11.5064 5.50008 11.9168 5.08968 11.9168 4.58341C11.9168 4.07715 11.5064 3.66675 11.0002 3.66675C10.4939 3.66675 10.0835 4.07715 10.0835 4.58341C10.0835 5.08968 10.4939 5.50008 11.0002 5.50008Z"
                    stroke="#5F5F5F"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                  <path
                    d="M11.0002 18.3333C11.5064 18.3333 11.9168 17.9229 11.9168 17.4167C11.9168 16.9104 11.5064 16.5 11.0002 16.5C10.4939 16.5 10.0835 16.9104 10.0835 17.4167C10.0835 17.9229 10.4939 18.3333 11.0002 18.3333Z"
                    stroke="#5F5F5F"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </svg>
              </div>
            </button>
            {menuOpen ? (
              <div className="absolute right-0 mt-1 z-20 w-40 rounded-lg border border-[#d7d7d8] bg-white shadow-lg overflow-hidden">
                <button onClick={handleShare} className="w-full text-left px-3 py-2 text-sm hover:bg-[#f5f5f5]">Share</button>
                {isOwner ? (
                  <>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        setIsEditOpen(true);
                      }}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-[#f5f5f5]"
                    >
                      Edit trip
                    </button>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        handleDeleteTrip();
                      }}
                      disabled={isDeleting}
                      className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-[#fff1f1] disabled:opacity-60"
                    >
                      {isDeleting ? "Deleting..." : "Delete trip"}
                    </button>
                  </>
                ) : (
                  <button className="w-full text-left px-3 py-2 text-sm hover:bg-[#f5f5f5]">Report post</button>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <div className="px-6 py-3 bg-white rounded-b-2xl border-t border-[#d7d7d8] flex flex-col gap-3 text-sm text-gray-800">

      {props.destination && (
          <div className="flex flex-col items-start gap-2 font-medium text-gray-800">
            <p>
              Planning a <span className="text-[#0b85ff] font-semibold">{props.destination}</span> trip this <span className="text-[#0b85ff] font-semibold">{props.TravelMonth}</span> with{" "}
              <span className="text-[#0b85ff] font-semibold">{props.totalPersons}</span> people, just <span className="text-[#0b85ff] font-semibold">₹{props.budget}</span> per head!
              Adventure, cafes, mountain views—everything packed in one epic
              getaway. Who’s in for some unforgettable fun?
            </p>

            {/* Description at the bottom */}
            {props.desc && (
              <p className="text-base text-gray-700 leading-relaxed pt-2 ">
                {props.desc}
              </p>
            )}
          </div>
        )}

        {image && (
          <div className="relative w-full mt-3">
            <img
              src={image}
              alt="Post image"
              className="w-full h-auto max-h-[520px] object-contain rounded-xl bg-[#f3f4f6]"
            />
          </div>
        )}

        {images && images.length > 0 && (
          <div className="relative w-full">
            {/* Carousel */}
            <div
              ref={sliderRef}
              className="keen-slider overflow-hidden rounded-xl"
            >
              {images.map((img, index) => (
                <div key={index} className="keen-slider__slide w-full">
                  <img
                    src={img.urls.raw}
                    alt={`Trip image ${index + 1}`}
                    className="w-full h-full max-h-[520px] object-contain rounded-xl bg-[#f3f4f6]"
                  />
                </div>
              ))}
            </div>

            {/* Dots (now absolute inside the image area) */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex justify-center items-center gap-2 z-10">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handleDotClick(idx)}
                  className={`w-2 h-2 rounded-full ${
                    currentSlide === idx ? "bg-[#222222]" : "bg-white"
                  }`}
                ></button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div>
        <div className="flex justify-between border-t border-b border-[#d7d7d8]">
          <div className="px-6 py-3 flex items-center gap-3">
            <p className="flex gap-2 items-center justify-center">
              <p className="text-[12px]">{likeCount}</p>
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="16" height="16" rx="4" fill="#1660CD"></rect>
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M2 14V2H14V14H2Z"
                  fill="#1660CD"
                ></path>
                <path
                  d="M6.19531 6.16535C6.19531 5.96535 6.25531 5.77035 6.36531 5.60535L7.68031 2.885C7.89531 2.56 8.43031 2.33 8.88531 2.5C9.37531 2.665 9.70031 3.215 9.59531 3.705C9.59531 3.705 9.07 5.38035 9.05 5.53035C9.03 5.68035 9.07 5.81535 9.155 5.92035C9.24 6.01535 9.365 6.07535 9.5 6.07535H11.8903C12.2853 6.07535 12.6253 6.23535 12.8253 6.51535C13.0153 6.78535 13.0503 7.13535 12.9253 7.49035L12 11.2454C11.845 11.8654 11.17 12.3704 10.5 12.3704H8.05C7.715 12.3704 7.245 12.2554 7.03 12.0404L6.39 11.5454C6.145 11.3604 6.19531 11.2454 6.19531 11.2454V6.16535Z"
                  fill="#FFFFFF"
                ></path>
                <path
                  d="M3.59 5.68945C2.815 5.68945 2.5 5.98945 2.5 6.72945V10.7595C2.5 11.4995 2.815 11.7995 3.59 11.7995H4.605C5.38 11.7995 5.695 11.4995 5.695 10.7595V6.72945C5.695 5.98945 5.38 5.68945 4.605 5.68945H3.59Z"
                  fill="#FFFFFF"
                ></path>
              </svg>
            </p>
            <p className="text-[12px]">•</p>
            <p>Comments</p>
          </div>

          <div className="px-6 py-2 flex items-center gap-2 flex-wrap">
            <button
              onClick={handleOptToggle}
              disabled={isOptLoading || (isFull && !optedIn)}
              className={`text-[14px] font-semibold px-4 py-[8px] rounded-[20px] min-h-[40px] transition-all duration-300 ease-in-out cursor-pointer flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed
      ${
        optedIn
          ? "text-white bg-gradient-to-r from-green-500 to-emerald-600 border border-green-600 shadow-md hover:shadow-lg hover:scale-105"
          : isFull
          ? "text-white bg-gray-400 border border-gray-400 cursor-not-allowed"
          : "text-white bg-gradient-to-r from-blue-500 to-blue-600 border border-blue-700 shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
      }`}
            >
              {isOptLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : optedIn ? (
                <>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Leave Trip
                </>
              ) : isFull ? (
                <>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 2.476c.44.063.884.147 1.378.29a5 5 0 014 4.004c.231.558.512 1.1.842 1.615a6 6 0 016.18 6.18c.516.33 1.058.611 1.615.842a5 5 0 014.004 4z" clipRule="evenodd" />
                  </svg>
                  Full
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Request to Join
                </>
              )}
            </button>
            <button
              onClick={() => setShowInterestedModal(true)}
              className="text-[12px] text-gray-700 font-semibold hover:text-blue-600 transition-colors cursor-pointer bg-gray-100 hover:bg-blue-50 px-3 py-[8px] rounded-[16px] min-h-[40px] flex items-center"
            >
              👥 {optCount}/{maxOpt}
            </button>
          </div>
        </div>
        <div className="flex justify-center max-h-[56px] gap-[8px] items-center p-[8px]">
          <button className="flex flex-1 gap-[6px] max-w-[192px] xxl:w-[144px] h-[40px] text-center justify-center lg:flex-row flex-col items-center py-[8px] hover:bg-[#d7d7d8] rounded-md"
            onClick={handleLikeToggle}
          >
            <Heart
              size={24}
              className={isLiked ? "fill-red-500 text-red-500" : "text-[#57585c]"}
            />
            <p className="">{likeCount}</p>
          </button>
          <button className="flex flex-1 gap-[6px] max-w-[192px] xxl:w-[144px] h-[40px] text-center justify-center lg:flex-row flex-col items-center py-[8px] hover:bg-[#d7d7d8] rounded-md"
            onClick={() => setShowCommentForm(!showCommentForm)}
          >
            <MessageCircle size={24} className="text-[#57585c]" />
            <p className="">Comment</p>
          </button>
          {/* <button className='flex flex-1 gap-[6px] max-w-[144px] xxl:w-[144px] h-[40px] text-center justify-center lg:flex-row flex-col items-center py-[8px] hover:bg-[#d7d7d8] rounded-md '>
          <p className='text-[#57585c]'><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M7.81498 2C4.17498 2 2.00498 4.17 2.00498 7.81V16.18C2.00498 19.83 4.17498 22 7.81498 22H16.185C19.825 22 21.995 19.83 21.995 16.19V7.81C22.005 4.17 19.835 2 16.195 2H7.81498ZM17.035 16.18L15.345 17.87C15.195 18.02 15.005 18.09 14.815 18.09C14.625 18.09 14.435 18.02 14.285 17.87C13.995 17.58 13.995 17.1 14.285 16.81L14.695 16.4H9.10498C7.80498 16.4 6.75498 15.34 6.75498 14.05V12.28C6.75498 11.87 7.09498 11.53 7.50498 11.53C7.91498 11.53 8.25498 11.87 8.25498 12.28V14.05C8.25498 14.52 8.63498 14.9 9.10498 14.9H14.695L14.285 14.49C13.995 14.2 13.995 13.72 14.285 13.43C14.575 13.14 15.055 13.14 15.345 13.43L17.035 15.12C17.105 15.19 17.155 15.27 17.195 15.36C17.275 15.55 17.275 15.76 17.195 15.94C17.155 16.03 17.105 16.11 17.035 16.18ZM16.505 12.4698C16.095 12.4698 15.755 12.1298 15.755 11.7198V9.94984C15.755 9.47984 15.375 9.09984 14.905 9.09984H9.31498L9.72498 9.49984C10.015 9.78984 10.015 10.2698 9.72498 10.5598C9.57498 10.7098 9.38498 10.7798 9.19498 10.7798C9.00498 10.7798 8.81498 10.7098 8.66498 10.5598L6.97498 8.86984C6.90498 8.79984 6.85498 8.71984 6.81498 8.62984C6.73498 8.44984 6.73498 8.23984 6.81498 8.05984C6.85498 7.96984 6.90498 7.87984 6.97498 7.80984L8.66498 6.11984C8.95498 5.82984 9.43498 5.82984 9.72498 6.11984C10.015 6.40984 10.015 6.88984 9.72498 7.17984L9.31498 7.58984H14.905C16.205 7.58984 17.255 8.64984 17.255 9.93984V11.7198C17.255 12.1298 16.915 12.4698 16.505 12.4698Z" fill=" #57585C"></path></svg></p>
          <p className=''>Repost</p>
        </button> */}
          <button className="flex flex-1 gap-[6px] max-w-[192px] xxl:w-[144px] h-[40px] text-center justify-center lg:flex-row flex-col items-center py-[8px] hover:bg-[#d7d7d8] rounded-md"
            onClick={handleShare}
          >
            <Share2 size={24} className="text-[#57585c]" />
            <p className="">Share</p>
          </button>
        </div>
        {showCommentForm && (
          <div className="px-6 py-4 border-t border-[#d7d7d8] flex gap-2">
            <input
              type="text"
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleCommentSubmit();
                }
              }}
              className="flex-1 px-3 py-2 border border-[#d7d7d8] rounded-lg focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={handleCommentSubmit}
              disabled={isCommentingLoading}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
            >
              {isCommentingLoading ? 'Posting...' : 'Post'}
            </button>
          </div>
        )}
        
        {successMessage && (
          <div className="px-6 py-3 mx-6 mb-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-300 rounded-lg text-green-800 font-medium flex items-center gap-2 shadow-sm animate-in fade-in slide-in-from-top duration-300">
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {successMessage}
          </div>
        )}
      </div>

      {showInterestedModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-gray-900">
                People Interested ({optCount})
              </h3>
              <button
                onClick={() => setShowInterestedModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-3">
              {interestedPersons && interestedPersons.length > 0 ? (
                interestedPersons.map((person, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                      {person.name ? person.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">
                        {person.name || 'Anonymous'}
                      </p>
                      <p className="text-sm text-gray-600">
                        @{person.username || 'user'}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No one has opted in yet
                </p>
              )}
            </div>

            <button
              onClick={() => setShowInterestedModal(false)}
              className="w-full mt-4 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
      {isEditOpen ? (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-lg p-5">
            <h3 className="text-lg font-semibold mb-4">Edit trip</h3>
            <div className="space-y-3">
              <input value={tripDestination} onChange={(e) => setTripDestination(e.target.value)} placeholder="Destination" className="w-full border border-[#d7d7d8] rounded-lg px-3 py-2" />
              <input type="date" value={tripDate} onChange={(e) => setTripDate(e.target.value)} className="w-full border border-[#d7d7d8] rounded-lg px-3 py-2" />
              <input type="number" value={tripBudget} onChange={(e) => setTripBudget(e.target.value)} placeholder="Budget" className="w-full border border-[#d7d7d8] rounded-lg px-3 py-2" />
              <input type="number" value={tripTotalPersons} onChange={(e) => setTripTotalPersons(e.target.value)} placeholder="Total persons" className="w-full border border-[#d7d7d8] rounded-lg px-3 py-2" />
              <textarea value={tripDescription} onChange={(e) => setTripDescription(e.target.value)} rows={3} placeholder="Description" className="w-full border border-[#d7d7d8] rounded-lg px-3 py-2" />
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setIsEditOpen(false)} className="px-4 py-2 rounded-lg border border-[#d7d7d8]">Cancel</button>
              <button onClick={handleEditTrip} disabled={isSavingEdit} className="px-4 py-2 rounded-lg bg-[#6B8E23] text-white disabled:opacity-60">
                {isSavingEdit ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default PostCard;
