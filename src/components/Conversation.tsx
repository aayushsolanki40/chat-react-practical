import React, { useEffect, useState } from "react";
import ConversationItem from "./ConversationItem";
import axiosInstance from "../api/axiosInstance";
import socketInstance from "../api/socketInstance";
import { Button, Input, Modal } from "antd";

const Conversation = ({
  setCurrentGroup,
}: {
  setCurrentGroup: React.Dispatch<any>;
}) => {
  const [conversations, setConversations] = useState<
    { id: string; name: string }[]
  >([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newChatName, setNewChatName] = useState("");

  async function fetchConversation() {
    try {
      const result = await axiosInstance.get("/chat/groups");
      setConversations(result.data.data);
    } catch (error) {
      alert("Error to fetch conversations");
    }
  }

  function changeRoom(item: any) {
    setCurrentGroup((prev: any) => {
      if (prev) {
        socketInstance.emit("leave-room", prev.id);
      }
      return item;
    });
  }

  useEffect(() => {
    fetchConversation();
  }, []);

  // Function to handle adding new chat
  const addNewChat = async () => {
    if (!newChatName.trim()) {
      alert("Please enter a name for the new chat.");
      return;
    }

    try {
      const result = await axiosInstance.post("/chat/group", {
        name: newChatName,
      });

      setConversations((prev) => [
        ...prev,
        { id: result.data.id, name: result.data.name },
      ]);
      
      setIsModalOpen(false);
      setNewChatName("");
    } catch (error) {
      alert("Error adding new chat");
    }
  };

  return (
    <div className="p-1">
      {conversations.map((item) => (
        <ConversationItem
          onClick={() => changeRoom(item)}
          key={item.id}
          id={item.id}
          name={item.name}
        />
      ))}
      <div onClick={() => setIsModalOpen((prev) => !prev)}>
        <div className={"conversation-item p-1  m-1 rounded-md bg-gray-700 "}>
          <div className={"flex items-center p-2  cursor-pointer  "}>
            <div className="w-12 h-5 m-1 flex justify-center align-middle">
              <img
                className="rounded-full"
                src="https://cdn.pixabay.com/photo/2017/03/19/03/51/material-icon-2155448_1280.png"
                alt="avatar"
              />
            </div>
            <div className="flex-grow p-2">
              <div className="flex justify-between text-md ">
                <div className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Add new chat
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        title="Create New Chat"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Input
          value={newChatName}
          onChange={(e) => setNewChatName(e.target.value)}
          placeholder="Enter chat name"
        />
        <div className="flex justify-end mt-3">
          <Button
            type="primary"
            onClick={addNewChat}
            disabled={!newChatName.trim()}
          >
            Add Chat
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Conversation;
