import React, { useEffect, useState } from "react";
import Conversation from "../components/Conversation";
import Messages from "../components/Message";
import socketInstance from "../api/socketInstance";

function Dashboard() {
  const [currentGroup, setCurrentGroup] = useState<{
    id: string;
    name: string;
  } | null>(null);

  useEffect(() => {
    if (currentGroup?.id) {
      socketInstance.connect();
      socketInstance.emit("join-room", {
        room: currentGroup.id,
      });
      socketInstance.on("new-message", (data) => {
        console.log(data);
      });
    }

    return () => {
      socketInstance.off("new-message");
      socketInstance.emit("leave-room", currentGroup?.id);
    };
  }, [currentGroup]);

  return (
    <div className="">
      <div className="flex bg-white dark:bg-gray-900">
        <div className="w-20  text-gray-500 h-screen flex flex-col items-center justify-between py-5">
          <div className="">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
              />
            </svg>
          </div>
          <div className="">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
        </div>
        <div className="w-80 h-screen dark:bg-gray-800 bg-gray-100 p-2 hidden md:block">
          <div className="h-full overflow-y-auto">
            <div className="text-xl font-extrabold text-gray-600 dark:text-gray-200 p-3">
              Chat App
            </div>
            <div className="text-lg font-semibol text-gray-600 dark:text-gray-200 p-3">
              Chats
            </div>
            <Conversation setCurrentGroupId={setCurrentGroup} />
          </div>
        </div>
        <div className="flex-grow  h-screen p-2 rounded-md">
          {currentGroup?.id && <Messages currentGroup={currentGroup} />}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
