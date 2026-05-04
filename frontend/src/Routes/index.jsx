import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Layout/MainLayout";
import LandingPage from "../Pages/LandingPage";
import SignIn from "../sign-in/SignIn";
import SignUp from '../sign-up/SignUp';
import UserProfile from "../Pages/UserProfilePage/UserProfile";
import AboutUs from "../Pages/AboutUsPage/AboutUs";
import ContactUs from "../Pages/ContactUsPage/ContactUs";
import Posts from "../Pages/PostsPage/Posts";
import PostDetails from "../Pages/PostsPage/PostDetails";
import Vlogs from "../Pages/VlogsPage/Vlogs";
import Booking from "../Pages/BookingPage/Booking";
import Flights from "../Pages/FlightsPage/Flights";
import Hotels from "../Pages/HotelsPage/Hotels";
import Cars from "../Pages/CarsPage/Cars";
import TripPlanner from "../Pages/TripPlanner/TripPlanner";
import PostCreationSection from "../Components/LandingPage/PostCreationSection";

const Routers = createBrowserRouter([
    {
        path:'/',
        element:<MainLayout/>,
        children:[
            {
                path:'/',
                element:<LandingPage/>
            },
            {
                path:'/posts',
                element:<Posts/>
            },
            {
                path:'/posts/:tripId',
                element:<PostDetails/>
            },
            {
                path:'/createpost',
                element:<PostCreationSection/>
            },
            {
                path:'/vlogs',
                element:<Vlogs/>
            },
            {
                path:'/booking',
                element:<Booking/>
            },
            {
                path:'/flights',
                element:<Flights/>
            },
            {
                path:'/hotels',
                element:<Hotels/>
            },
            {
                path:'/cars',
                element:<Cars/>
            },
            {
                path:'/trip-planner',
                element:<TripPlanner/>
            },
            {
                path: '/about_us',
                element: <AboutUs/>
            },
            {
                path: '/contact_us',
                element: <ContactUs/>
            },
            {
                path:'/userprofile',
                element:<UserProfile/>
            }
        ]
    },
    {
        path:'/signin',
        element:<SignIn/>
    },
    {
        path:'/signup',
        element:<SignUp/>
    }
])

export default Routers