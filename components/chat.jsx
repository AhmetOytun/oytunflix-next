import { useState, useEffect, useRef } from "react";

const Chat = ({ socket, userName, visible, profilePicture }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.on("message", (m) => {
      setMessages((prevMessages) => [...prevMessages, m].slice(-7));
    });
    return () => socket.off("message");
  }, [socket]);

  useEffect(() => {
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    scrollToBottom();
  }, [messages]);

  const sendMessage = (m) => {
    if (m.trim()) {
      socket.emit("message", {
        username: userName,
        message: m,
        profilePic: profilePicture,
      });
      setMessage("");
    }
  };

  return (
    <div
      className={`chat-container ${
        visible ? "block" : "hidden"
      } fixed sm:bottom-5 sm:right-5 bg-gray-800 p-4 rounded-lg w-full sm:w-[32rem] sm:h-80 h-64 overflow-hidden flex flex-col justify-between`}
      style={{ maxWidth: "100%", maxHeight: "calc(100vh - 2.5rem)" }}
    >
      <div className="messages mb-4 h-64 overflow-y-auto flex-1">
        {messages.map((m, index) => (
          <div key={index} className="text-white flex items-center mb-2">
            <img className="w-6 h-6 mr-2" src={`/images/${m.profilePic}.png`} />
            <strong className="mr-1">{m.username}:</strong>
            <span>{m.message}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
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
