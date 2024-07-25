import { useState, useEffect } from "react";

const Chat = ({ socket, userName, visible }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("message", (m) => {
      setMessages((prevMessages) => [...prevMessages, m].slice(-7));
    });
    return () => socket.off("message");
  }, [socket]);

  const sendMessage = (m) => {
    if (m.trim()) {
      socket.emit("message", {
        username: userName,
        message: m,
      });
      setMessage("");
    }
  };

  return (
    <div
      className={`chat-container ${
        visible ? "block" : "hidden"
      } fixed sm:bottom-5 sm:right-5 bg-gray-800 p-4 rounded-lg w-full sm:w-[32rem] h-64 sm:h-64 flex flex-col justify-between`}
      style={{ maxWidth: "100%", maxHeight: "calc(100vh - 2.5rem)" }}
    >
      <div className="messages mb-4 h-64 overflow-y-auto flex-1">
        {messages.map((m, index) => (
          <div key={index} className="text-white">
            <strong>{m.username}:</strong> {m.message}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        maxLength={50}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Enter message"
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            sendMessage(e.target.value);
          }
        }}
        className="w-full p-2 rounded bg-gray-700 text-white"
      />
    </div>
  );
};

export default Chat;
