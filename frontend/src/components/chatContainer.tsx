import { useEffect, useState } from "react";
import { checkAuthStore } from "../store/checkAuthStore";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./chatHeader";
import MessageInput from "../components/messageInput";
import MessageSkeleton from "./skeletons/messageSkeleton";
import { X } from "lucide-react";

const chatContainer = () => {
  const { getMessages, selectedUser, messages, isMessageLoading } =
    useChatStore();

  const { authUser } = checkAuthStore();

  const [modalImage, setModalImage] = useState<string | null>(null);

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
            className={`chat ${message.senderId === authUser?.id ? "chat-end" : "chat-end"}`}
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
            <div className="chat-bubble">
              {message.image && (
                <img
                  src={message.image}
                  alt="Shared attachment"
                  className="mb-2 max-w-xs rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => setModalImage(message.image)}
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>
      <MessageInput />

      {/* Image Modal */}
      {modalImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setModalImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300"
            onClick={() => setModalImage(null)}
          >
            <X className="size-8" />
          </button>
          <img
            src={modalImage}
            alt="Full size"
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default chatContainer;
