import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

function ChatBot() {
  const [messages, setMessages] = useState([
    { text: 'Hello! How can I assist you today?', sender: 'bot' },
  ]);
  const [userInput, setUserInput] = useState('');
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }

    // Initialize Chatbase script
    const script = document.createElement("script");
    script.src = "https://www.chatbase.co/embed.min.js";
    script.id = "P0i7XFQc1GGKujkrSTCkd";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [messages]);

  const generateResponse = async (userInput) => {
    if (userInput.trim() === '') return;

    const newMessages = [
      ...messages,
      { text: userInput, sender: 'user' },
    ];

    setMessages(newMessages);

    try {
      const response = await axios.post('/api/gemini', {
        message: userInput,
      });

      const botMessage = response.data.response.trim();

      setMessages((prevMessages) => [...prevMessages, { text: botMessage, sender: 'bot' }]);
    } catch (error) {
      console.error('Error fetching chatbot response:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: 'Oops! Something went wrong. Please try again later.', sender: 'bot' },
      ]);
    }
  };

  const handleSend = () => {
    if (userInput.trim() === '') return;
    generateResponse(userInput);
    setUserInput('');
  };

  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div>
      <h2>Gemini Chatbot</h2>
      <div
        style={{
          border: '1px solid black',
          height: '300px',
          overflowY: 'scroll',
          padding: '10px',
          marginBottom: '10px',
        }}
        ref={chatContainerRef}
      >
        {messages.map((msg, index) => (
          <div key={index} style={{ textAlign: msg.sender === 'user' ? 'right' : 'left' }}>
            <p
              style={{
                backgroundColor: msg.sender === 'user' ? '#DCF8C6' : '#F1F0F0',
                display: 'inline-block',
                padding: '10px',
                borderRadius: '10px',
                maxWidth: '80%',
              }}
            >
              <strong>{msg.sender === 'user' ? 'You' : 'Bot'}:</strong> {msg.text}
            </p>
          </div>
        ))}
      </div>
      <input
        type="text"
        placeholder="Type your message..."
        value={userInput}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        style={{ width: '80%', padding: '10px' }}
      />
      <button onClick={handleSend} style={{ padding: '10px', marginLeft: '10px' }}>
        Send
      </button>
    </div>
  );
}

export default ChatBot;
