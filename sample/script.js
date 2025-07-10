function App() {
  const [data, setData] = React.useState(null);
  const [currentSession, setCurrentSession] = React.useState(null);
  const [input, setInput] = React.useState('');

  React.useEffect(() => {
    fetch('./data/sample.json')
      .then(res => res.json())
      .then(json => {
        setData(json);
        if (json.sessions && json.sessions.length > 0) {
          setCurrentSession(json.sessions[0].id);
        }
      });
  }, []);

  if (!data) {
    return React.createElement('div', {className: 'loading'}, 'Loading...');
  }

  const messages = data.messages.filter(m => m.session_id === currentSession);
  const handleSend = () => {
    if (!input.trim()) return;
    const newMessage = {
      id: data.messages.length + 1,
      session_id: currentSession,
      role: 'user',
      content: input,
      timestamp: new Date().toISOString()
    };
    setData({...data, messages: [...data.messages, newMessage]});
    setInput('');
  };

  return (
    <div className="app">
      <Sidebar sessions={data.sessions} current={currentSession} onSelect={setCurrentSession} />
      <Chat messages={messages} input={input} onInput={setInput} onSend={handleSend} />
    </div>
  );
}

function Sidebar({sessions, current, onSelect}) {
  return (
    <div className="sidebar">
      {sessions.map(s => (
        <div key={s.id}
             className={['chat-item', s.id === current ? 'active' : ''].join(' ')}
             onClick={() => onSelect(s.id)}>
          {s.title}
        </div>
      ))}
    </div>
  );
}

function Chat({messages, input, onInput, onSend}) {
  return (
    <div className="chat">
      <div className="messages">
        {messages.map(m => (
          <div key={m.id} className={'message ' + m.role}>
            <div className="content">{m.content}</div>
          </div>
        ))}
      </div>
      <div className="input-box">
        <textarea value={input} onChange={e => onInput(e.target.value)} />
        <button onClick={onSend}>送信</button>
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
