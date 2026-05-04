import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const api = axios.create({
    baseURL: `${API_BASE_URL}/api/`
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const UserSignIn = async(email,password)=>{
    try {
        console.log('Attempting login with email:', email);
        const response = await api.post('public/login',{email:email,password:password},{
            withCredentials: true,
        })
        console.log('Login response received:', response);
        return response

    } catch (error) {
        console.error('Login request error:', error);
        console.error('Error response data:', error?.response?.data);
        return error.response
    }
}

export const UserSignUp = async(name,email,username,password)=>{
    try {
        const response = await api.post('public/register',
            {
                name:name,
                email:email,
                username:username,
                password:password
            },
            {
                withCredentials: true
            }
        )
        return response;
    
    } catch (error) {
        return error.response;
    }
}

export const CompleteUserProfile = async(userEmail,title,designation,about) =>{
    try {
        const response = await api.put('traveller/profile',{
            email:userEmail,
            title:title,
            designation:designation,
            about:about
        }, {
            withCredentials: true
        })
        return response
    } catch (error) {
        return error.response
    }
}

export const VerifyOTP = async(email, otp)=>{
    try {
        const response = await api.post('public/verify-otp', {
            email: email,
            otp: otp
        }, {
            withCredentials: true
        })
        return response
    } catch (error) {
        return error.response
    }
}

export const SendOTP = async(email)=>{
    try {
        const response = await api.post('public/send-otp', {
            email: email
        })
        return response
    } catch (error) {
        return error.response
    }
}

export const SendResetOTP = async(email)=>{
    try {
        const response = await api.post('public/send-reset-otp', {
            email: email
        })
        return response
    } catch (error) {
        return error.response
    }
}

export const ResetPassword = async(email, otp, newPassword)=>{
    try {
        const response = await api.post('public/reset-password', {
            email: email,
            otp: otp,
            newPassword: newPassword
        })
        return response
    } catch (error) {
        return error.response
    }
}

export const Logout = async()=>{
    try {
        const response = await api.post('public/logout', {}, {
            withCredentials: true
        })
        return response
    } catch (error) {
        return error.response
    }
}

export const GetUserProfile = async()=>{
    try {
        const response = await api.get('traveller/profile', {
            withCredentials: true
        })
        return response
    } catch (error) {
        return error.response
    }
}

export const UpdateUserProfile = async(profileData)=>{
    try {
        const response = await api.put('traveller/profile', profileData, {
            withCredentials: true
        })
        return response
    } catch (error) {
        return error.response
    }
}

export const UploadProfileImage = async(file)=>{
    try {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post('traveller/profile/image', formData, {
            withCredentials: true,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        return response
    } catch (error) {
        return error.response
    }
}

export const CreatePost = async(destination,totalPersons,travelDate,BudgetPerPerson,description,imageFile) => {
    try {
        const formData = new FormData();
        formData.append('destination', destination);
        formData.append('totalPersons', totalPersons);
        formData.append('travelDate', travelDate);
        formData.append('BudgetPerPerson', BudgetPerPerson);
        formData.append('description', description);
        
        if (imageFile) {
            formData.append('image', imageFile);
        }

        const response = await api.post('trips/create-post', formData, {
            withCredentials: true
        })

        return response
    } catch (error) {
        console.error('CreatePost Error:', error);
        return error.response || {
            status: 500,
            data: {
                error: 'Unable to reach create trip endpoint',
            },
        }
    }
}

const mapTripToPostCardModel = (trip) => {
    const startDate = trip?.startDate || '';
    return {
        _id: trip?.id,
        userId: {
            name: trip?.createdBy || 'Traveller',
            email: trip?.creatorEmail || '',
            profilePic: trip?.creatorProfileUrl || '',
        },
        description: trip?.description || '',
        BudgetPerPerson: Number(trip?.budget || 0),
        TravelMonth: startDate,
        destination: trip?.destination || '',
        totalPersons: trip?.totalPersons || 0,
        createdAt: trip?.createdAt,
        interested_persons: [],
        likeCount: 0,
        image: trip?.imageUrl || '',
        tripId: trip?.id,
    };
};

export const FetchPost = async() => {
    try {
        const response = await api.get('trips/public',{
            withCredentials: true 
        })

        if (response?.status === 200 && Array.isArray(response.data)) {
            return {
                ...response,
                data: response.data.map(mapTripToPostCardModel),
            };
        }

        return response
    } catch (error) {
        return error.response
    }
}

export const GetMyTrips = async() => {
    try {
        const response = await api.get('trips', {
            withCredentials: true
        })
        return response
    } catch (error) {
        return error.response
    }
}

export const GetTripPostById = async(tripId) => {
    try {
        const response = await api.get(`trips/${tripId}`, {
            withCredentials: true
        })

        if (response?.status === 200 && response.data) {
            return {
                ...response,
                data: mapTripToPostCardModel(response.data),
            }
        }

        return response
    } catch (error) {
        return error.response
    }
}

export const UpdateTrip = async(tripId, tripData) => {
    try {
        const response = await api.put(`trips/${tripId}`, tripData, {
            withCredentials: true
        })
        return response
    } catch (error) {
        return error.response
    }
}

export const DeleteTrip = async(tripId) => {
    try {
        const response = await api.delete(`trips/${tripId}`, {
            withCredentials: true
        })
        return response
    } catch (error) {
        return error.response
    }
}

export const PostImages = async(destination)=> {
    const destinations = destination + " " + "tourism"
    console.log(destinations)
    try {
        const response = await axios.get(`https://api.unsplash.com/search/photos?query=${destinations}&client_id=3StF_Gofq_OG9yN9Wuq4-RHJM-b7jh89sBJpql5fOS0`);
       
        return response

    } catch (error) {
        console.log(error)
        return error.response
    }
}

export const CreateVlog = async(title, description, videoUrl) => {
    try {
        const response = await api.post('vlog/create', {
            title: title,
            description: description,
            videoUrl: videoUrl
        }, { withCredentials: true })

        return response
    } catch (error) {
        return error.response
    }
}

export const FetchVlogs = async() => {
    try {
        const response = await api.get('vlog/fetch', {
            withCredentials: true 
        })

        return response
    } catch (error) {
        return error.response
    }
}

export const LikePost = async(postId) => {
    try {
        const response = await api.post(`post/like/${postId}`, {}, {
            withCredentials: true
        })
        return response
    } catch (error) {
        return error.response
    }
}

export const UnlikePost = async(postId) => {
    try {
        const response = await api.post(`post/unlike/${postId}`, {}, {
            withCredentials: true
        })
        return response
    } catch (error) {
        return error.response
    }
}

export const CommentOnPost = async(postId, comment) => {
    try {
        const response = await api.post(`post/comment/${postId}`, { comment }, {
            withCredentials: true
        })
        return response
    } catch (error) {
        return error.response
    }
}

export const LikeVlog = async(vlogId) => {
    try {
        const response = await api.post(`vlog/like/${vlogId}`, {}, {
            withCredentials: true
        })
        return response
    } catch (error) {
        return error.response
    }
}

export const UnlikeVlog = async(vlogId) => {
    try {
        const response = await api.post(`vlog/unlike/${vlogId}`, {}, {
            withCredentials: true
        })
        return response
    } catch (error) {
        return error.response
    }
}

export const CommentOnVlog = async(vlogId, comment) => {
    try {
        const response = await api.post(`vlog/comment/${vlogId}`, { comment }, {
            withCredentials: true
        })
        return response
    } catch (error) {
        return error.response
    }
}

export const OptInToPost = async(postId, message = 'I would like to join this trip.') => {
    try {
        const response = await api.post(`trips/${postId}/request-join`, { message }, {
            withCredentials: true
        })
        return response
    } catch (error) {
        return error.response
    }
}

export const OptOutFromPost = async(postId) => {
    try {
        const response = await api.delete(`trips/${postId}/leave`, {
            withCredentials: true
        })
        return response
    } catch (error) {
        return error.response
    }
}

export const TripPlanningChat = async(message) => {
    try {
        const response = await api.post('ai/trip-planning', { message }, {
            withCredentials: true
        })
        return response
    } catch (error) {
        return error.response
    }
}

export const OptimizeBudget = async(budget) => {
    try {
        const response = await api.post('ai/optimize-budget', { budget }, {
            withCredentials: true
        })
        return response
    } catch (error) {
        return error.response
    }
}

export const GetTravelInsights = async() => {
    try {
        const response = await api.get('ai/travel-insights', {
            withCredentials: true
        })
        return response
    } catch (error) {
        return error.response
    }
}