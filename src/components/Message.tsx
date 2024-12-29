import React, { useEffect, useState } from "react";
import socketInstance from "../api/socketInstance";
import axiosInstance from "../api/axiosInstance";
import moment from "moment";
import { Form, Input } from "antd";

interface iMessage {
  userId: string;
  username: string;
  message: string;
  time: Date;
}

const Messages = ({
  currentGroup,
}: {
  currentGroup: { id: string; name: string };
}) => {
  const [form] = Form.useForm();
  const [message, setMessage] = useState("");
  const [groupMembers, setGroupMembers] = useState<any>([]);
  const [messagesList, setMessagesList] = useState<iMessage[]>([]);
  const user = JSON.parse(localStorage.getItem("user") ?? "");
  const [isUsernameModalOpen, setIsUsernameModalOpen] = useState(false);

  function onKeyUp(e: any) {
    if (e.key === "Enter" && message !== "") {
      socketInstance.emit("message", {
        room: currentGroup.id,
        message: e.target.value,
      });
      setMessage("");
    }
  }

  useEffect(() => {
    const handleNewMessage = (data: any) => {
      setMessagesList((prevMessages) => [
        ...prevMessages,
        {
          userId: data.userId,
          username: data.username,
          message: data.message,
          time: new Date(),
        },
      ]);
    };

    socketInstance.on("new-message", handleNewMessage);

    return () => {
      socketInstance.off("new-message", handleNewMessage);
    };
  }, []);

  useEffect(() => {
    async function fetchGroupDetails() {
      const members = await axiosInstance.get(
        `/chat/group/${currentGroup.id}/members`
      );

      if (Array.isArray(members.data.data)) {
        setGroupMembers(members.data.data.map((e: any) => e.user.username));
      }
    }

    setMessagesList([]);

    if (currentGroup.id) {
      fetchGroupDetails();
    }
  }, [currentGroup.id]);

  const handleInviteSubmit = async (data: { username: string }) => {
    try {
      const response = await axiosInstance.post(`/chat/group/invite`, {
        groupId: currentGroup.id,
        username: data.username,
      });
      alert(response.data.message);
      setGroupMembers((prev: string[]) => [...prev, data.username]);
      setIsUsernameModalOpen(false);
      form.resetFields();
    } catch (error: any) {
      console.error("Invite Error:", error);
      alert(error?.response?.data?.message ?? "Error while sending invite");
    }
  };

  const InviteModal = ({ isOpen, onClose, onSubmit }: any) => {
    return (
      isOpen && (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-gray-500 bg-opacity-50">
          <div className="bg-white p-5 rounded-lg w-80">
            <h3 className="text-lg font-semibold mb-4">Invite a Friend</h3>
            <Form form={form} onFinish={handleInviteSubmit}>
              <Form.Item name="username" required>
                <Input
                  type="text"
                  placeholder="Enter username"
                  className="w-full p-2 border rounded-md mb-4"
                />
              </Form.Item>
              <div className="flex justify-between">
                <button
                  onClick={onClose}
                  className="bg-gray-400 text-white px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                  Invite
                </button>
              </div>
            </Form>
          </div>
        </div>
      )
    );
  };

  return (
    <div className="flex-grow h-full flex flex-col">
      <div className="w-full h-15 p-1 bg-purple-600 dark:bg-gray-800 shadow-md rounded-xl rounded-bl-none rounded-br-none">
        <div className="flex p-2 align-middle items-center">
          <div className="p-2 md:hidden rounded-full mr-1 hover:bg-purple-500 text-white">
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
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </div>
          <div className="border rounded-full border-white p-1/2">
            <img
              className="w-14 h-14 rounded-full"
              src="https://cdn.pixabay.com/photo/2017/01/31/21/23/avatar-2027366_960_720.png"
              alt="avatar"
            />
          </div>
          <div className="flex-grow p-2">
            <div className="text-md text-gray-50 font-semibold">
              {currentGroup?.name}
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-300 rounded-full"></div>
              <div className="text-xs text-gray-50 ml-1">
                Online - {groupMembers.join(", ")}
              </div>
            </div>
          </div>
          <div
            className="p-2 text-white cursor-pointer hover:bg-purple-500 rounded-full"
            onClick={() => setIsUsernameModalOpen((prev) => !prev)}
          >
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
                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
              />
            </svg>
          </div>
        </div>
      </div>
      <div className="w-full flex-grow bg-gray-100 dark:bg-gray-900 my-2 p-2 overflow-y-auto">
        {messagesList.map((message, key) =>
          message.userId !== user?.id ? (
            <div key={key} className="flex items-end w-3/4">
              <img
                className="hidden w-8 h-8 m-3 rounded-full"
                src="https://cdn.pixabay.com/photo/2017/01/31/21/23/avatar-2027366_960_720.png"
                alt="avatar"
              />
              <div className="w-8 m-3 rounded-full" />
              <div className="p-3 bg-purple-300 dark:bg-gray-800 mx-3 my-1 rounded-2xl rounded-bl-none sm:w-3/4 md:w-3/6">
                <div className="text-xs text-gray-600 dark:text-gray-200">
                  {message.username}
                </div>
                <div className="text-gray-700 dark:text-gray-200">
                  {message.message}
                </div>
                <div className="text-xs text-gray-400">
                  {moment(message.time).format("MMM DD, YYYY h:mm A")}
                </div>
              </div>
            </div>
          ) : (
            <div key={key} className="flex justify-end">
              <div className="flex items-end w-auto bg-purple-500 dark:bg-gray-800 m-1 rounded-xl rounded-br-none sm:w-3/4 md:w-auto">
                <div className="p-2">
                  <div className="text-gray-200">{message.message}</div>
                </div>
              </div>
            </div>
          )
        )}
      </div>
      <div className="h-15  p-3 rounded-xl rounded-tr-none rounded-tl-none bg-gray-100 dark:bg-gray-800">
        <div className="flex items-center">
          <div className="p-2 text-gray-600 dark:text-gray-200 ">
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
                d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="search-chat flex flex-grow p-2">
            <input
              className="input text-gray-700 dark:text-gray-200 text-sm p-5 focus:outline-none bg-gray-100 dark:bg-gray-800  flex-grow rounded-l-md"
              type="text"
              placeholder="Type your message and press enter key to send ..."
              onKeyUp={onKeyUp}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      <InviteModal
        isOpen={isUsernameModalOpen}
        onClose={() => setIsUsernameModalOpen(false)}
        onSubmit={handleInviteSubmit}
      />
    </div>
  );
};

export default Messages;
