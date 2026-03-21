import { useEffect } from "react";
import { checkAuthStore } from "../store/checkAuthStore";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./chatHeader";
import MessageInput from "../components/messageInput";
import MessageSkeleton from "./skeletons/messageSkeleton";

const chatContainer = () => {
  const { getMessages, selectedUser, messages, isMessageLoading } =
    useChatStore();

  const { authUser } = checkAuthStore();

  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser.id || "");
    }
  }, [selectedUser, getMessages, selectedUser?.id || ""]);

  if (isMessageLoading) {
    return (
      <div className="flex flex-1 flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }
  return (
    <div className="flex flex-1 flex-col overflow-auto">
      <ChatHeader />
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`chat ${message.senderId === authUser?.id ? "chat-end" : "chat-start"}`}
          >
            <div className="chat-image avatar">
              <div className="w-12 h-12">
                <img
                  src={
                    message.senderId === authUser?.id
                      ? authUser?.profilePic || "https://i.pravatar.cc/300"
                      : selectedUser?.profilePic || "https://i.pravatar.cc/300"
                  }
                  alt={
                    message.senderId === authUser?.id
                      ? authUser?.fullName
                      : selectedUser?.fullName
                  }
                  className="rounded rounded-full"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {new Date(message.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </time>
              <p className="text-xs opacity-50 ml-1">
                {new Date(message.createdAt).toLocaleDateString([], {
                  day: "2-digit",
                  month: "2-digit",
                  year: "2-digit",
                })}
              </p>
            </div>
            <div className="chat-bubble">{message.text}</div>
          </div>
        ))}
      </div>
      <MessageInput />
    </div>
  );
};

export default chatContainer;
