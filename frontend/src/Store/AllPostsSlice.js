import { createSlice } from "@reduxjs/toolkit";

const AllPostsSlice = createSlice({
    name:'AllPosts',
    initialState:[],
    reducers:{
        setAllPosts:(state,action)=>{
            return action.payload;
        },
        updatePost:(state,action)=>{
            const postIndex = state.findIndex(post => post._id === action.payload._id);
            if (postIndex !== -1) {
                state[postIndex] = action.payload;
            }
        }
    }
})



export const {setAllPosts, updatePost} = AllPostsSlice.actions
export default AllPostsSlice.reducer