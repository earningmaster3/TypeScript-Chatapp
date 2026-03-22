import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { Loader } from "lucide-react";
import { checkAuthStore } from "../store/checkAuthStore";

const sidebar = () => {
  const { users, getUsers, selectedUser, setSelectedUser, isUserLoading } =
    useChatStore();

  const { onlineUsers } = checkAuthStore();
  console.log(onlineUsers);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  if (isUserLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  return (
    <aside className="w-80 border-r border-base-200 flex flex-col bg-base-100">
      {/* Header */}
      <div className="p-4 border-b border-base-200">
        <h2 className="text-lg font-bold">Chats</h2>
      </div>

      {/* Users List */}

      <div className="flex-1 overflow-y-auto">
        {users.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-600">No users found</p>
          </div>
        ) : (
          users.map((user) => (
            <button
              type="button"
              key={user.id}
              onClick={() => setSelectedUser(user)}
              className={`w-full px-4 py-3 text-left cursor-pointer hover:bg-base-200 transition-colors flex items-center gap-3 ${
                selectedUser?.id === user.id
                  ? "bg-primary/10 border-l-4 border-primary"
                  : "border-l-4 border-transparent"
              }`}
            >
              {/* Avatar with initials and online dot */}
              <div className="relative shrink-0">
                <div className="size-11 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-sm">
                  {user.fullName
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase()}
                </div>
                <span
                  className={`absolute top-0 right-0 size-3 rounded-full border-2 border-base-100 ${
                    onlineUsers.includes(user.id)
                      ? "bg-green-500"
                      : "bg-gray-400"
                  }`}
                />
              </div>
              {/* User info */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{user.fullName}</p>
                <p
                  className={`text-xs ${
                    onlineUsers.includes(user.id)
                      ? "text-green-500"
                      : "text-base-content/40"
                  }`}
                >
                  {onlineUsers.includes(user.id) ? "Online" : "Offline"}
                </p>
              </div>
            </button>
          ))
        )}
      </div>
    </aside>
  );
};

export default sidebar;
