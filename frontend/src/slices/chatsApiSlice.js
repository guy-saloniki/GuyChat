import { CHATS_URL } from '../constants';
import { apiSlice } from './apiSlice';

export const chatsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllChats: builder.query({
      query: () => ({
        url: CHATS_URL,
      }),
      keepUnusedDataFor: 5,
    }),
    createChat: builder.mutation({
      query: (members) => ({
        url: CHATS_URL,
        method: 'POST',
        body: members,
      }),
      invalidatesTags: ['Chats'],
    }),
    clearUnreadMessages: builder.mutation({
      query: (chatId) => ({
        url: `${CHATS_URL}/${chatId}/clear`,
        method: 'POST',
        body: chatId,
      }),
    }),
  }),
});

export const {
  useGetAllChatsQuery,
  useCreateChatMutation,
  useClearUnreadMessagesMutation,
} = chatsApiSlice;
