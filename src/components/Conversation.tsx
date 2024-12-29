import React, { useEffect, useState } from "react";
import ConversationItem from "./ConversationItem";
import axiosInstance from "../api/axiosInstance";

const Conversation = ({
  setCurrentGroupId,
}: {
  setCurrentGroupId: React.Dispatch<any>;
}) => {
  const [conversations, setConversations] = useState<
    { id: string; name: string }[]
  >([]);

  async function fetchConversation() {
    try {
      const result = await axiosInstance.get("/chat/groups");
      setConversations(result.data.data);
    } catch (error) {
      alert("Error to fetch conversations");
    }
  }

  useEffect(() => {
    fetchConversation();
  }, []);

  return (
    <div className="p-1">
      {conversations.map((item) => (
        <ConversationItem
          onClick={() => setCurrentGroupId(item)}
          key={item.id}
          id={item.id}
          name={item.name}
        />
      ))}
    </div>
  );
};

export default Conversation;
