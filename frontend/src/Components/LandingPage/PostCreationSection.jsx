import React, { useState, useEffect } from "react";
import { Snackbar, Alert } from "@mui/material";
import { useScreenResizeValue } from "../../ScreenSizeFunction";
import "./PostCreationSection.css";
import { isNumeric } from "../../../util/helper";
import { CreatePost, FetchPost } from "../../../ApiCall";
import { useDispatch } from "react-redux";
import { setAllPosts } from "../../Store/AllPostsSlice";

const PostCreationSection = () => {
  const breakpoint = useScreenResizeValue();
  const dispatch = useDispatch();
  const todayDate = new Date().toISOString().split("T")[0];

  // Form states
  const [destination, setDestination] = useState("");
  const [totalPersons, setTotalPersons] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [BudgetPerPerson, setBudgetPerPerson] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Validations
  const [isFormValid, setIsFormValid] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);

  // Validation check on field changes
  useEffect(() => {
    setIsFormValid(
      destination.trim() &&
        totalPersons.trim() &&
        travelDate.trim() &&
        travelDate >= todayDate &&
        BudgetPerPerson.trim() &&
        description.trim()
    );
  }, [destination, totalPersons, travelDate, BudgetPerPerson, description, todayDate]);

  // Input handler
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "destination") setDestination(value);

    else if (name === "totalPersons") {
      if (value === "" || isNumeric(value)) {
        if (Number(value) <= 12) setTotalPersons(value);
      }
    }

    else if (name === "travelDate") setTravelDate(value);

    else if (name === "BudgetPerPerson") {
      if (value === "" || isNumeric(value)) setBudgetPerPerson(value);
    }

    else if (name === "description") setDescription(value);
  };

  // Image handler
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove image
  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  // Submit Handler
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async () => {
    if (isSubmitting) return;

    if (!travelDate || travelDate < todayDate) {
      setErrorMessage("Trip date cannot be in the past.");
      return;
    }
    
    try {
      setIsSubmitting(true);
      setErrorMessage("");

      const response = await CreatePost(
        destination,
        totalPersons,
        travelDate,
        BudgetPerPerson,
        description,
        imageFile
      );

      if (response?.data?.msg === "Post Created Successfully" || response?.status === 201) {
        setOpenAlert(true);
        
        const fetchData = async () => {
          try {
            const res = await FetchPost();
            if (res?.status === 200) {
              dispatch(setAllPosts(res.data));
            }
          } catch (fetchError) {
            console.error("Error fetching posts:", fetchError);
          }
        };
        
        fetchData();
        window.dispatchEvent(new Event("postCreated"));

        // Clear form
        setDestination("");
        setTotalPersons("");
        setTravelDate("");
        setBudgetPerPerson("");
        setDescription("");
        setImageFile(null);
        setImagePreview(null);
      } else {
        console.error("Response error:", response);
        setErrorMessage(response?.data?.msg || response?.data?.error || "Failed to create post. Please try again.");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      console.error("Error details:", error?.response?.data);
      setErrorMessage(error?.response?.data?.msg || error?.response?.data?.error || error?.message || "Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center overflow-hidden w-full min-h-[100vh] py-12 px-4 bg-gradient-to-br from-[#ffffff] via-[#fafafa] to-[#f5f5f5]">
      <div
        className={`${
          breakpoint <= 1440 ? "w-[84%]" : "w-[1200px]"
        } flex flex-col lg:flex-row items-center justify-center gap-[3rem] py-[2rem]`}
      >
        <div className="flex flex-col lg:flex-row items-center justify-center gap-[2rem] w-full">
          {/* Left text section */}
          <div className="flex-[1.5] text-black flex flex-col items-center lg:items-start gap-[1.5rem] p-[20px] lg:p-[40px] lg:pl-0">
            <span className="px-[2rem] py-[.5rem] rounded-full bg-[#6B8E23] text-white text-xs md:text-sm font-medium">
              🌍 Find Your Perfect Travel Buddy
            </span>

            <h1 className="main-title text-[2.3rem] md:text-[3.3rem] text-black capitalize font-bold text-center lg:text-left leading-tight">
              Unleash the traveler{" "}
              <span className="text-[#6B8E23]">inside you</span>, Enjoy your
              Dream Vacation
            </h1>

            <p className="text-gray-700 text-center lg:text-left text-sm md:text-base leading-relaxed">
              Create a post and tell your travel buddies where you're headed. Connect with like-minded explorers and plan your perfect group adventure together.
            </p>
          </div>

          {/* Right form section */}
          <div className="right-section p-[1.5rem] md:p-[2rem] flex-[.75] w-full lg:w-auto flex flex-col items-start gap-[1.5rem] rounded-[2rem] bg-white shadow-2xl border border-gray-100">
            <h1 className="form-title text-2xl font-bold text-gray-900">Create Travel Post</h1>

            <form className="form w-full">
              <div className="input-group">
                <label>Destination</label>
                <div className="input-wrapper">
                  <input
                    name="destination"
                    type="text"
                    placeholder="Tell your mates where you're going"
                    value={destination}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="flex gap-[1rem]">
                <div className="input-group">
                  <label>Total Persons</label>
                  <div className="input-wrapper">
                    <input
                      name="totalPersons"
                      type="text"
                      placeholder="Max Person allowed - 12"
                      value={totalPersons}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label>Date of Travel</label>
                  <div className="input-wrapper">
                    <input
                      name="travelDate"
                      type="date"
                      min={todayDate}
                      value={travelDate}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="input-group">
                <label>Per Person Budget</label>
                <div className="input-wrapper">
                  <input
                    name="BudgetPerPerson"
                    type="text"
                    placeholder="e.g. 10,000"
                    value={BudgetPerPerson}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Description of the Trip</label>
                <div className="input-wrapper">
                  <textarea
                    name="description"
                    placeholder="How will you do the trip and what are the expectations"
                    rows={2}
                    value={description}
                    onChange={handleChange}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Add Photos (Optional)</label>
                <div className="flex flex-col gap-3">
                  <label className="flex items-center justify-center w-full p-4 border-2 border-dashed border-[#6B8E23] rounded-xl cursor-pointer hover:bg-gray-50 transition">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <div className="flex flex-col items-center gap-2">
                      <svg className="w-8 h-8 text-[#6B8E23]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      <span className="text-sm text-gray-600">
                        {imageFile ? imageFile.name : "Click to upload image from gallery"}
                      </span>
                    </div>
                  </label>

                  {imagePreview && (
                    <div className="relative">
                      <img src={imagePreview} alt="Preview" className="w-full h-40 object-cover rounded-lg" />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full transition"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </form>

            <button
              onClick={handleSubmit}
              className="submit-button w-full py-3 rounded-lg font-semibold text-white transition duration-300 transform hover:scale-105 disabled:hover:scale-100"
              disabled={!isFormValid || isSubmitting}
              style={{
                backgroundColor: (isFormValid && !isSubmitting) ? "#6B8E23" : "#ccc",
                cursor: (isFormValid && !isSubmitting) ? "pointer" : "not-allowed",
              }}
            >
              {isSubmitting ? "Creating Post..." : "Create Post"}
            </button>
          </div>
        </div>
      </div>

      {/* Success Alert */}
      <Snackbar
        open={openAlert}
        autoHideDuration={3000}
        onClose={() => setOpenAlert(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" variant="filled">
          Post Created Successfully!
        </Alert>
      </Snackbar>

      {/* Error Alert */}
      <Snackbar
        open={!!errorMessage}
        autoHideDuration={4000}
        onClose={() => setErrorMessage("")}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="error" variant="filled">
          {errorMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default PostCreationSection;
