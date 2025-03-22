import React, { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const API_KEY = import.meta.env.VITE_APP_URI;
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;
  const handleSendMessage = async () => {
    if (input.trim()) {
      const newMessages = [...messages, { text:input, user: true }];
      setMessages(newMessages);
      setInput("");
      try {
        const { data } = await axios.post(API_URL, {
          contents: [{ parts: [{ text: input }] }],
        });
        const botResponse = data.candidates[0].content.parts[0].text;
        const typeBotResponse = async (response, newMessages) => {
          for (let i = 0; i < response.length; i++) {
            setMessages(prev => [...newMessages, { text: response.slice(0, i + 1), user: false }]);
            await new Promise(resolve => setTimeout(resolve, 50)); 
          }
        };
        typeBotResponse(botResponse, newMessages);
      } catch (error) {
        console.error('Error:', error);
        setMessages([...newMessages, { text: 'Error: Could not get response from AI', user: false }]);
      }
    }
  };
  return (
    <>   <h1 className="heading">Chat-Bot</h1>
      <div className="container">
      <div className="messages-container">
        {messages.map((msg, index) => (
          <div key={index} className={`messages ${msg.user ? 'user' : 'bot'}`}>
            <ReactMarkdown>{msg.text}</ReactMarkdown>
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          className="input-field"
        />
        <button onClick={handleSendMessage} className="send-button"> ➤  </button>
      </div>
    </div>
    </>
  );
}
export default Chatbot;






