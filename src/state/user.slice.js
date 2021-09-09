import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    info: {},
  },
  reducers: {
    setUser: (state, action) => {
      state.info = { ...state.info, ...action.payload };
    },
    setUserPublicKey: (state, action) => {
      state.info = { ...state.info, publicKey: action.payload };
    },
  },
});

const { setUser, setUserPublicKey } = userSlice.actions;

const getUserInfo = (state) => state.userReducer.info;

export { userSlice, setUser, setUserPublicKey, getUserInfo };
