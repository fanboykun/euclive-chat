import { createSlice } from '@reduxjs/toolkit';

const messagesSlice = createSlice({
  name: 'messages',
  initialState: {
    messages: [],
  },
  reducers: {
    addMessage: (state, action) => {
      state.messages = [...state.messages, action.payload]
    }
  },
});

const { addMessage } = messagesSlice.actions;

const getMessages = (state) => state.messagesReducer.messages;

export { messagesSlice, getMessages };
