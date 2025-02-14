import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([]);
  const wsRef = useRef(null);
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080"); 

    ws.onopen = () => {
      ws.send(JSON.stringify({
        type: "join",
        payload: { roomId: "red" }
      }));
    };

    ws.onmessage = (event) => {
      setMessages((prev) => [...prev, event.data]);
    };

    wsRef.current = ws;

    return () => {
      ws.close();
    };
  }, []);

  const sendMessage = () => {
    const message = inputRef.current?.value.trim();
    if (!message) return; 

    wsRef.current?.send(JSON.stringify({
      type: "chat",
      payload: { message }
    }));

    inputRef.current.value = ""; 
  };

  return (
    <div className="h-screen bg-black flex flex-col">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg, index) => (
          <div key={index} className="m-4">
            <span className="bg-white text-black rounded p-4 inline-block">
              {msg}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef}></div>
      </div>

      <div className="w-full bg-white flex p-2 border-t">
        <input
          ref={inputRef}
          type="text"
          placeholder="Type a message..."
          className="flex-1 p-2 border rounded-lg outline-none"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()} 
        />
        <button onClick={sendMessage} className="bg-purple-600 text-white px-4 py-2 rounded-lg">
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
