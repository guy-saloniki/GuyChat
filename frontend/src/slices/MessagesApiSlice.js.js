import { MESSAGES_URL } from '../constants';
import { apiSlice } from './apiSlice';

export const messagesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    sendMessage: builder.mutation({
      query: (message) => ({
        url: `${MESSAGES_URL}`,
        method: 'POST',
        body: message,
      }),
    }),
    getAllMessages: builder.query({
      query: (chatId) => ({
        url: `${MESSAGES_URL}/${chatId}`,
      }),
    }),
  }),
});

export const { useSendMessageMutation, useGetAllMessagesQuery } =
  messagesApiSlice;
