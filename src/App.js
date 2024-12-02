import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [userMessage, setUserMessage] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [messages, setMessages] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(true); // Dark mode state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // Add the user message to the conversation
      const newMessage = { sender: 'user', text: userMessage };
      setMessages((prevMessages) => [...prevMessages, newMessage]);

      // Send the message to the server
      const response = await axios.post('http://localhost:5000/message', { message: userMessage });
      const aiMessage = { sender: 'ai', text: response.data.answer };

      // Add the AI response to the conversation
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
      setAiResponse(response.data.answer);
    } catch (err) {
      console.error('Error in Frontend:', err);
      if (err.response) {
        setError(`Backend error: ${err.response.data.error}`);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
      setUserMessage('');
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`App ${isDarkMode ? 'dark' : 'light'}`}>
      {/* Navigation bar */}
      <header className="navbar">
        <button className="connect-wallet-btn">Connect Wallet</button>
        <h1 className="navbar-title">$SLICK</h1>
      </header>

      <div className="chat-container">
        <div className="chatbox">
          <div className="messages">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`message ${message.sender === 'user' ? 'user-message' : 'ai-message'}`}
              >
                {message.text}
              </div>
            ))}
            {loading && <div className="bot-message">Slick is Thinking...</div>}
          </div>

          {/* Input form */}
          <form onSubmit={handleSubmit} className="input-form">
            <input
              type="text"
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              placeholder="Ask me anything..."
              className="user-input"
            />
            <button type="submit" disabled={loading} className="send-btn">
              {loading ? 'Sending...' : 'Send'}
            </button>
          </form>
        </div>
      </div>

      {/* Error message */}
      {error && <div className="error">{error}</div>}

      {/* Footer */}
      <footer className="footer">
        <p>Made with ❤️ on NEAR Protocol</p>
      </footer>
    </div>
  );
}

export default App;
