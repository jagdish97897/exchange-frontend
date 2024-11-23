import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { createUser, signOut, loginUser, resetPasswordRequest, resetPassword, checkUser, fetchUser } from './authAPI';

const initialState = {
  loggedInUserToken: null,
  status: 'idle',
  error:null,
  userChecked: false,
  mailSent: false,
  passwordReset: false,
  userData: null,
};

export const createUserAsync = createAsyncThunk(
  'user/createUser',
  async (userData) => {
    const response = await createUser(userData);
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  }
);

export const loginUserAsync = createAsyncThunk(
  'user/loginUser',
  async (loginInfo ) => {
    try{
      const response = await loginUser(loginInfo);
    // The value we return becomes the `fulfilled` action payload
    return response.data;
    }catch(error){
      console.log(error);
      // return rejectWithValue(error);
    }
  }
);

export const fetchUserAsync = createAsyncThunk(
  '/v1/user',
  async () => {
    try{
      const response = await fetchUser();
    // The value we return becomes the `fulfilled` action payload
    return response.data;
    }catch(error){
      console.log(error);
      // return rejectWithValue(error);
    }
  }
);

export const checkUserAsync = createAsyncThunk(
  'user/checkUser',
  async () => {
    try{
      const response = await checkUser();
    // The value we return becomes the `fulfilled` action payload
    return response.data;
    }catch(error){
      console.log(error);
    }
  }
);

export const resetPasswordRequestAsync = createAsyncThunk(
  'user/resetPasswordRequest',
  async (email, {rejectWithValue}) => {
    try{
      const response = await resetPasswordRequest(email);
    // The value we return becomes the `fulfilled` action payload
    return response.data;
    }catch(error){
      console.log(error);
      return rejectWithValue(error);
    }
  }
);

export const resetPasswordAsync = createAsyncThunk(
  'user/resetPassword',
  async (data, {rejectWithValue}) => {
    try{
      const response = await resetPassword(data);
    // The value we return becomes the `fulfilled` action payload
    return response.data;
    }catch(error){
      console.log(error);
      return rejectWithValue(error);
    }
  }
);

export const signOutAsync = createAsyncThunk(
  'user/signOut',
  async () => {
    const response = await signOut();
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  }
);

export const authSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createUserAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createUserAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.loggedInUserToken = action.payload;
      })
      .addCase(loginUserAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loginUserAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.loggedInUserToken = action.payload;
      })
      .addCase(loginUserAsync.rejected, (state, action) => {
        state.status = 'idle';
        state.error = action.payload;

      })
      .addCase(fetchUserAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.userData = action.payload;
      })
      .addCase(fetchUserAsync.rejected, (state, action) => {
        state.status = 'idle';
        state.error = action.payload;

      })
      .addCase(signOutAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(signOutAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.loggedInUserToken = null;
      })
      .addCase(checkUserAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(checkUserAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.loggedInUserToken = action.payload;
        
      })
      .addCase(checkUserAsync.rejected, (state, action) => {
        state.status = 'idle';
      })
      .addCase(resetPasswordRequestAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(resetPasswordRequestAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.mailSent = true;
      })
      .addCase(resetPasswordAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(resetPasswordAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.passwordReset = true;
      })
      .addCase(resetPasswordAsync.rejected, (state, action) => {
        state.status = 'idle';
        state.error = action.payload;
      })
  },
});

export const selectLoggedInUser = (state)=>state.auth.loggedInUserToken;
export const selectError = (state)=>state.auth.error;
export const selectUserChecked = (state)=>state.auth.userChecked;
export const selectMailSent = (state)=>state.auth.mailSent;
export const selectPasswordReset = (state)=>state.auth.passwordReset;
export const selectUserData = (state)=>state.auth.userData;
// export const { increment } = authSlice.actions;



export default authSlice.reducer;



















































// import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
// import { fetchCount } from './counterAPI';

// const initialState = {
//   value: 0,
//   status: 'idle',
// };

// export const incrementAsync = createAsyncThunk(
//   'counter/fetchCount',
//   async (amount) => {
//     const response = await fetchCount(amount);
//     // The value we return becomes the `fulfilled` action payload
//     return response.data;
//   }
// );

// export const counterSlice = createSlice({
//   name: 'counter',
//   initialState,
//   reducers: {
//     increment: (state) => {
//       state.value += 1;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(incrementAsync.pending, (state) => {
//         state.status = 'loading';
//       })
//       .addCase(incrementAsync.fulfilled, (state, action) => {
//         state.status = 'idle';
//         state.value += action.payload;
//       });
//   },
// });

// export const { increment } = counterSlice.actions;

// export const selectCount = (state) => state.counter.value;

// export default counterSlice.reducer;