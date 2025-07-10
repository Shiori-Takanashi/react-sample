import React, { useState, useEffect } from 'react';

export default function App() {
  const [data, setData] = useState(null);
  const [currentSession, setCurrentSession] = useState(null);
  const [input, setInput] = useState('');

  useEffect(() => {
    fetch('/sample.json')
      .then(res => res.json())
      .then(json => {
        setData(json);
        if (json.sessions && json.sessions.length > 0) {
          setCurrentSession(json.sessions[0].id);
        }
      });
  }, []);

  if (!data) {
    return <div className="p-4">Loading...</div>;
  }

  const messages = data.messages.filter(m => m.session_id === currentSession);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMessage = {
      id: data.messages.length + 1,
      session_id: currentSession,
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };
    setData({ ...data, messages: [...data.messages, newMessage] });
    setInput('');
  };

  return (
    <div className="flex h-screen">
      <Sidebar sessions={data.sessions} current={currentSession} onSelect={setCurrentSession} />
      <Chat messages={messages} input={input} onInput={setInput} onSend={handleSend} />
    </div>
  );
}

function Sidebar({ sessions, current, onSelect }) {
  return (
    <div className="w-48 bg-gray-800 overflow-y-auto p-2">
      {sessions.map(s => (
        <div
          key={s.id}
          className={`p-2 cursor-pointer rounded ${s.id === current ? 'bg-gray-600' : ''}`}
          onClick={() => onSelect(s.id)}
        >
          {s.title}
        </div>
      ))}
    </div>
  );
}

function Chat({ messages, input, onInput, onSend }) {
  return (
    <div className="flex flex-col flex-1">
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map(m => (
          <div key={m.id} className={`mb-4 ${m.role === 'user' ? 'text-right' : ''}`}>
            <div className="inline-block bg-gray-700 px-3 py-2 rounded">
              {m.content}
            </div>
          </div>
        ))}
      </div>
      <div className="flex p-2 border-t border-gray-700">
        <textarea
          className="flex-1 resize-none mr-2 text-black"
          value={input}
          onChange={e => onInput(e.target.value)}
        />
        <button className="bg-blue-500 text-white px-3 py-1 rounded" onClick={onSend}>
          送信
        </button>
      </div>
    </div>
  );
}
