// features/auth/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        referralCode: null, // Add this line
        error: null,
    },
    reducers: {
        setReferralCode: (state, action) => {
            state.referralCode = action.payload;
        },
        setUser: (state, action) => {
            state.user = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
    },
});

export const { setReferralCode, setUser, setError } = authSlice.actions;
export const selectReferralCode = (state) => state.auth.referralCode;
export default authSlice.reducer;
