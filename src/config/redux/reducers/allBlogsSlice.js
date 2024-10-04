import { createSlice } from "@reduxjs/toolkit";
export const allBlogsSlice = createSlice({
    name: 'allBlogs',
    initialState: {
        blogs: []
    },
    reducers: {
        addAllBlogs: (state, action) => {
            const {arr} = action.payload
            state.blogs.push(...arr);
        }
    }
})

export const { addAllBlogs } = allBlogsSlice.actions
export default allBlogsSlice.reducer