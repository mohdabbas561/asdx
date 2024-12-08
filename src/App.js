import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function DroppingWords() {
  useEffect(() => {
    const container = document.querySelector(".dropping-words-container");

    const generateWords = () => {
      const word = document.createElement("div");
      word.className = "dropping-word";

      // Create the vertical NEAR IS AI text
      const text = ["N", "E", "A", "R", "I", "S", "A", "I"];
      text.forEach((char) => {
        const span = document.createElement("span");
        span.textContent = char;
        word.appendChild(span);
      });

      // Randomize horizontal position and set animation duration
      word.style.left = `${Math.random() * 100}vw`;
      word.style.animationDuration = `${Math.random() * 2 + 5}s`;

      container.appendChild(word);

      // Remove the word after it finishes animating
      word.addEventListener("animationend", () => {
        container.removeChild(word);
      });
    };

    const interval = setInterval(generateWords, 1000); // Generate a new set of words every second
    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  return <div className="dropping-words-container"></div>;
}

function App() {
  const [userMessage, setUserMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const newMessage = { sender: "user", text: userMessage };
      setMessages((prevMessages) => [...prevMessages, newMessage]);

      const response = await axios.post(
        "https://chatbackend-g9je.onrender.com/message",
        { message: userMessage }
      );
      const aiMessage = { sender: "ai", text: response.data.answer };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
      setUserMessage("");
    }
  };

  return (
    <div className="App">
      <DroppingWords />
      <header className="navbar">
        <button className="connect-wallet-btn">Connect Wallet</button>
        <h1 className="navbar-title">$MUTANT</h1>
      </header>

      <div className="chat-container">
        <div className="chatbox">
          <div className="messages">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`message ${
                  message.sender === "user" ? "user-message" : "ai-message"
                }`}
              >
                {message.text}
              </div>
            ))}
            {loading && <div className="bot-message">NEAR is Thinking...</div>}
          </div>
          <form onSubmit={handleSubmit} className="input-form">
  <input
    type="text"
    value={userMessage}
    onChange={(e) => setUserMessage(e.target.value)}
    placeholder="Whats in Your Mind..."
    className="user-input"
  />
  <button type="submit" disabled={loading} className="send-btn">
    {loading ? "Sending..." : "Send"}
  </button>
</form>

        </div>
      </div>

      <footer className="footer">
        <p>&copy; With Love on $NEAR</p>
      </footer>
    </div>
  );
}

export default App;
