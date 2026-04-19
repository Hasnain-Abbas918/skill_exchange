import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchConversations = createAsyncThunk('chat/fetchConversations', async () => {
  const res = await api.get('/chat/conversations');
  return res.data;
});

export const fetchMessages = createAsyncThunk('chat/fetchMessages', async (conversationId) => {
  const res = await api.get(`/chat/${conversationId}/messages`);
  return { conversationId, messages: res.data };
});

const chatSlice = createSlice({
  name: 'chat',
  initialState: { conversations: [], messages: {}, activeConversation: null, loading: false },
  reducers: {
    setActiveConversation: (state, action) => { state.activeConversation = action.payload; },
    addMessage: (state, action) => {
      const { conversationId, message } = action.payload;
      if (!state.messages[conversationId]) state.messages[conversationId] = [];
      const exists = state.messages[conversationId].find((m) => m.id === message.id);
      if (!exists) state.messages[conversationId].push(message);
    },
    updateConversationLastMessage: (state, action) => {
      const { conversationId, message } = action.payload;
      const conv = state.conversations.find((c) => c.id === conversationId);
      if (conv) conv.lastMessage = message;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversations.fulfilled, (state, action) => { state.conversations = action.payload; })
      .addCase(fetchMessages.fulfilled, (state, action) => { state.messages[action.payload.conversationId] = action.payload.messages; });
  },
});

export const { setActiveConversation, addMessage, updateConversationLastMessage } = chatSlice.actions;
export default chatSlice.reducer;