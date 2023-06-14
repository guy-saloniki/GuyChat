import { useEffect } from 'react';
import {
  useGetUsersListQuery,
  useGetUserProfileQuery,
} from '../slices/usersApiSlice';
import {
  useGetAllChatsQuery,
  useCreateChatMutation,
} from '../slices/chatsApiSlice';
import Loader from './Loader';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { SetSelectedChat } from '../slices/authSlice';
import moment from 'moment';

const UsersList = ({ searchTerm }) => {
  const {
    data: users,
    isLoading,
    refetch: refetchUsers,
  } = useGetUsersListQuery();

  const {
    data: chats,
    isLoading: loadingChats,
    refetch: refetchChats,
  } = useGetAllChatsQuery();

  const { data: currentUser, isLoading: loadingCurrent } =
    useGetUserProfileQuery();

  const [createChat, { isLoading: loadingCreate }] = useCreateChatMutation();

  const dispatch = useDispatch();
  const { selectedChat } = useSelector((state) => state.auth);

  useEffect(() => {
    if (users) {
      refetchUsers();
    }
  }, [users, refetchUsers, refetchChats]);

  const createNewChat = async (userId) => {
    try {
      await createChat([currentUser._id, userId]).unwrap();
      toast.success('New chat has created');
      refetchChats();
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  const openChat = async (userId) => {
    const chat = chats?.find(
      (chat) =>
        chat?.members?.map((mem) => mem?._id)?.includes(currentUser._id) &&
        chat?.members?.map((mem) => mem?._id)?.includes(userId)
    );
    if (chat) {
      dispatch(SetSelectedChat(chat));
    }
  };

  const getData = () => {
    //If search letter emty then return all chats, else return filtered chats and useres
    if (searchTerm === '') {
      return chats;
    }
    return users.filter((user) =>
      user?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase())
    );

    // return users?.filter(
    //   (user) =>
    //     (user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) &&
    //       searchTerm) ||
    //     chats?.some((chat) =>
    //       chat?.members?.map((member) => member._id).includes(user._id)
    //     )
    // );
  };

  const isSelectedChat = (user) => {
    if (selectedChat) {
      return selectedChat?.members?.map((mem) => mem._id).includes(user._id);
    }
    return false;
  };

  const getLastMessage = (user) => {
    const chat = chats?.find((chat) =>
      chat?.members?.map((mem) => mem._id)?.includes(user._id)
    );

    if (!chat || !chat.lastMessage) {
      return;
    } else {
      const lastMessageUser =
        chat?.lastMessage?.sender === currentUser?._id ? 'You:' : '';
      return (
        <div className="flex justify-between w-72">
          <h5 className="text-gray-500 text-sm">
            {lastMessageUser} {chat?.lastMessage?.text}
          </h5>
          <h5 className="text-sm text-gray-400 pr-2">
            {moment(chat?.lastMessage?.createdAt).format('hh:mm A')}
          </h5>
        </div>
      );
    }
  };

  const getUnreadMessages = (user) => {
    const chat = chats?.find((chat) =>
      chat?.members?.map((mem) => mem._id)?.includes(user._id)
    );

    if (
      chat &&
      chat.unreadMessages !== 0 &&
      chat?.lastMessage?.sender !== currentUser._id
    ) {
      return (
        <div className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {chat.unreadMessages}
        </div>
      );
    }
  };

  return (
    <div className="flex flex-col gap-3 my-3 w-96">
      {isLoading && <Loader />}
      {getData()?.map((userOrChat) => {
        let user = userOrChat;
        if (userOrChat.members) {
          user = userOrChat?.members?.find(
            (mem) => mem?._id !== currentUser?._id
          );
        }
        return (
          <div
            key={user._id}
            className={`shadow-sm border p-2 rounded-2xl bg-white flex justify-between items-center cursor-pointer w-full
            ${isSelectedChat(user) && 'border-primary border-2'}
            `}
            onClick={() => openChat(user._id)}
          >
            <div className="flex gap-5 items-center">
              {user?.profilePic ? (
                <img
                  src={user.profilePic}
                  alt="profile pic"
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <div className="bg-gray-500  rounded-full h-10 w-10 flex items-center justify-center">
                  <h3 className="uppercase font-semibold text-white">
                    {user.name[0]}
                  </h3>
                </div>
              )}
              <div className="flex flex-col">
                <div className="flex gap-1 items-center">
                  <h5>{user.name}</h5>
                  {getUnreadMessages(user)}
                </div>

                {getLastMessage(user)}
              </div>
            </div>

            <div>
              {!chats.find((chat) =>
                chat.members?.map((member) => member._id)?.includes(user._id)
              ) && (
                <button
                  className="border-primary border text-primary px-3 py-1 bg-white rounded-md"
                  onClick={() => createNewChat(user._id)}
                >
                  Create Chat
                </button>
              )}
              {loadingCreate && <Loader />}
              {loadingChats && <Loader />}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default UsersList;
