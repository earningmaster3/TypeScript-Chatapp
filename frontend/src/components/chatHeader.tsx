import { X } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { checkAuthStore } from "../store/checkAuthStore";

const chatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = checkAuthStore();
  console.log(onlineUsers);

  return (
    <div>
      <div className="p-2.5 border-b border-base-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="avatar">
              <div className="w-12 h-12">
                <img
                  src={selectedUser?.profilePic || "https://i.pravatar.cc/300"}
                  alt={selectedUser?.fullName}
                  className="rounded rounded-full"
                />
              </div>
            </div>
            {/* User info */}
            <div>
              <h3 className="font-medium">{selectedUser?.fullName}</h3>
              <p className="text-sm text-base-content/70">
                {onlineUsers.includes(selectedUser?.id || "") ? "Online" : "Offline"}
              </p>
            </div>
          </div>
          <button onClick={() => setSelectedUser(null)}>
            <X />
          </button>
        </div>
        {/* Close button */}
        
      </div>
    </div>
  );
};

export default chatHeader;
