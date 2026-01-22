let ws;
let username;

function connect() {
  ws = new WebSocket('ws://localhost:8080');

  ws.onopen = () => {
    username = prompt('Enter your username:');
    if (username) {
      ws.send(JSON.stringify({ type: 'join', username }));
      document.getElementById('input').disabled = false;
      document.getElementById('send').disabled = false;
    }
  };

  ws.onmessage = (event) => {
    const message = JSON.parse(event.data);
    const messagesDiv = document.getElementById('messages');
    let displayText;
    if (message.type === 'system') {
      displayText = `[System] ${message.content} at ${message.timestamp}`;
    } else if (message.type === 'message') {
      displayText = `[${message.sender}] ${message.content} at ${message.timestamp}`;
    } else if (message.type === 'error') {
      displayText = `Error: ${message.content}`;
    }
    messagesDiv.innerHTML += `<p>${displayText}</p>`;
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  };

  ws.onclose = () => {
    alert('Connection closed. Refresh to reconnect.');
    document.getElementById('input').disabled = true;
    document.getElementById('send').disabled = true;
  };

  ws.onerror = (err) => {
    console.error('WebSocket error:', err);
  };
}

document.getElementById('send').addEventListener('click', () => {
  const input = document.getElementById('input');
  const content = input.value.trim();
  if (content) {
    ws.send(JSON.stringify({ type: 'message', content }));
    input.value = '';
  }
});

document.getElementById('input').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    document.getElementById('send').click();
  }
});

// Initial connection
connect();