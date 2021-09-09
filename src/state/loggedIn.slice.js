import { createSlice } from '@reduxjs/toolkit';

let isLoggedInSlice = createSlice({
  name: 'isLoggedIn',
  initialState: {
    isLoggedIn: false,
  },
  reducers: {
    setIsLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload;
    },
  },
});

let { setIsLoggedIn } = isLoggedInSlice.actions;

let getIsLoggedIn = (state) => state.isLoggedInReducer.isLoggedIn;

export { isLoggedInSlice, setIsLoggedIn, getIsLoggedIn };
