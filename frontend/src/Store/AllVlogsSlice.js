import { createSlice } from "@reduxjs/toolkit";

const AllVlogsSlice = createSlice({
    name: 'AllVlogs',
    initialState: [],
    reducers: {
        setAllVlogs: (state, action) => {
            return action.payload;
        }
    }
});

export const { setAllVlogs } = AllVlogsSlice.actions;
export default AllVlogsSlice.reducer;
