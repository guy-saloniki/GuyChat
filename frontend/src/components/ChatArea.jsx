import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FaPaperPlane, FaCheckDouble } from 'react-icons/fa';
import {
  useSendMessageMutation,
  useGetAllMessagesQuery,
} from '../slices/MessagesApiSlice.js';
import { useClearUnreadMessagesMutation } from '../slices/chatsApiSlice.js';
import { toast } from 'react-toastify';
import Loader from './Loader.jsx';
import moment from 'moment';

const ChatArea = ({ socket }) => {
  const [newMessage, setNewMessage] = useState('');

  const { selectedChat, userInfo } = useSelector((state) => state.auth);

  const [sendMessage, { isLoading }] = useSendMessageMutation();
  const { data: messagesApi, isLoading: loadingMessages } =
    useGetAllMessagesQuery(selectedChat._id);

  const [messages, setMessages] = useState([]);

  const [clearUnreadMessages, { isLoading: loadingClear }] =
    useClearUnreadMessagesMutation();

  const selectedUser = selectedChat?.members?.find(
    (member) => member._id !== userInfo._id
  );

  const sendNewMessage = async () => {
    try {
      const message = {
        chat: selectedChat._id,
        sender: userInfo._id,
        text: newMessage,
      };

      // Send message to the server using socket
      socket.emit('send-message', {
        ...message,
        members: selectedChat.members.map((mem) => mem._id),
        createdAt: moment().format('DD:MM:YYYY hh:mm:ss'),
        isRead: false,
      });
      await sendMessage(message).unwrap();
      setNewMessage('');
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  const clearMessagesHandler = async () => {
    try {
      await clearUnreadMessages(selectedChat._id).unwrap();
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  useEffect(() => {
    if (messagesApi) {
      setMessages(messagesApi);
    }
    if (selectedChat?.lastMessage?.sender !== userInfo._id) {
      clearMessagesHandler();
    }

    //Recieve message from server using socket
    socket.on('recieve-message', (message) => {
      setMessages((prev) => [...prev, message]);
    });
  }, [selectedChat, messagesApi]);

  useEffect(() => {
    // Always scroll to the bottom of messages id
    const messageContainer = document.getElementById('messages');
    messageContainer.scrollTop = messageContainer.scrollHeight;
  }, [messages]);

  return (
    <div className="bg-white h-[80vh] border rounded-2xl mr-5 flex flex-col justify-between p-5">
      {/* first part - selected user */}
      <div>
        <div className="flex gap-5 items-center">
          {selectedUser.profilePic ? (
            <img
              src={selectedUser.profilePic}
              alt="profile pic"
              className="w-10 h-10 rounded-full"
            />
          ) : (
            <div className="bg-gray-500  rounded-full h-10 w-10 flex items-center justify-center">
              <h3 className="uppercase font-semibold text-white">
                {selectedUser.name[0]}
              </h3>
            </div>
          )}
          <h5 className="uppercase">{selectedUser.name}</h5>
        </div>
        <hr />
      </div>
      {/* second part - chat messages */}
      <div
        className="h-[50vh] overflow-y-scroll p-2 no-scrollbar"
        id="messages"
      >
        {loadingMessages ? (
          <Loader />
        ) : (
          <div className="flex flex-col gap-1">
            {messages?.map((message) => {
              const isCurrentUserIsSender = message.sender === userInfo._id;
              return (
                <div
                  key={message._id}
                  className={`flex ${isCurrentUserIsSender && 'justify-end'}`}
                >
                  <div className="flex flex-col">
                    <h5
                      className={`${
                        isCurrentUserIsSender
                          ? 'bg-primary text-white rounded-br-none'
                          : 'bg-gray-300 text-black rounded-bl-none'
                      } p-2 rounded-xl `}
                    >
                      {message.text}
                    </h5>
                    <h5 className="text-gray-500 text-sm">
                      {moment(message.createdAt).format('hh:mm A')}
                    </h5>
                  </div>
                  {isCurrentUserIsSender && (
                    <FaCheckDouble
                      className={`${
                        message.isRead ? 'text-blue-500' : 'text-gray-500'
                      } `}
                    />
                  )}
                  {loadingClear && <Loader />}
                </div>
              );
            })}
          </div>
        )}
      </div>
      {/* third part - chat input */}
      <div>
        <div className="h-16 rounded-xl border border-gray-300 shadow flex justify-between p-2">
          <input
            type="text"
            placeholder="Type..."
            value={newMessage}
            className="w-[90%] border-0 h-full rounded-xl focus:border-none"
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button
            className="bg-primary text-white p-2 rounded py-1 px-5"
            onClick={sendNewMessage}
          >
            <FaPaperPlane className="text-white text-xl" />
          </button>
          {isLoading && <Loader />}
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
