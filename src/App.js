import React, { useState } from 'react';
import axios from 'axios';
import './index.css';

const App = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const api= process.env.REACT_APP_API_KEY;
  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
  };

  const chatHistoryTuples = [];



  const handleSubmit = async (e) => {
    e.preventDefault();
    if (inputMessage.trim() === '') return;

    const newChatHistory = [...chatHistory, { message: inputMessage, sender: 'user' }];
    setChatHistory(newChatHistory);
    console.log(chatHistoryTuples)
    try {
      const response = await fetch(`${api}/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: inputMessage,
          chat_history: chatHistoryTuples,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setChatHistory((prevChatHistory) => [...prevChatHistory, { message: data.answer, sender: 'bot' }]);
       chatHistoryTuples.push(inputMessage, data.answer)
      } else {
        throw new Error('Error al enviar la pregunta.');
      }
    } catch (error) {
      console.error('Error al enviar la pregunta:', error);
    }

    setInputMessage('');
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-600 via-red-500 to-blue-600">
      <h1 className="text-5xl font-bold text-white mb-8">Petronia y Paprikas</h1>
      <div className="w-full max-w-4xl">
        <div className="bg-white shadow p-4 rounded-xl mb-4 h-[calc(70vh-6rem)] overflow-y-auto">
          {chatHistory.map((chatItem, index) => (
            <div key={index} className={`py-2 px-4 my-1 rounded-lg text-lg font-semibold ${chatItem.sender === 'user' ? 'bg-blue-600 text-white self-start' : 'bg-red-600 text-white self-end'}`}>
              {chatItem.message}
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="flex">
          <input
            type="text"
            value={inputMessage}
            onChange={handleInputChange}
            placeholder="Escribe tu pregunta aquí..."
            className="flex-grow p-4 text-lg border rounded-l-xl focus:outline-none focus:border-blue-600"
          />
          <button type="submit" className="bg-blue-600 text-white px-8 py-4 text-lg rounded-r-xl hover:bg-blue-700">
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
};

export default App;