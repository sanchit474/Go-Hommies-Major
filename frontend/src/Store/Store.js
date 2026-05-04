import { configureStore } from "@reduxjs/toolkit";
import UserDataSliceReducer from './UserDataSlice'
import AllPostsSliceReducer from './AllPostsSlice';
import AllVlogsSliceReducer from './AllVlogsSlice';

export const Store = configureStore({
    reducer:{
        UserData:UserDataSliceReducer,
        AllPosts:AllPostsSliceReducer,
        AllVlogs:AllVlogsSliceReducer
    }
})