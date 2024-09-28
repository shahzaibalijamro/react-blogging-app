import { createSlice } from "@reduxjs/toolkit";
export const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: {}
    },
    reducers: {
        addUser: (state, action) => {
            const {user} = action.payload
            state.user = user
        }
    }
})

export const { addUser } = userSlice.actions
export default userSlice.reducer