const express = require('express');
const WebSocket = require('ws');
const http = require('http');
const { timeStamp } = require('console');
const { type } = require('os');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({server});

// Serve static files from 'public' directory
app.use(express.static('public'));

// In-memory store for connected clients (username: ws object)
const clients = new Map();

function broadcast(message , senderWs){
    clients.forEach((clientWs,username)=>{
        if(clientWs !== senderWs && clientWs.readyState === WebSocket.OPEN){
            clientWs.send(JSON.stringify(message));
        }
    });
};

// System message helper
function sendSystemMessage(content){
    const message = {
        type:'system',
        content,
        timestamp:new Date().toISOString()
    };
    clients.forEach((clientWs)=>{
        if(clientWs.readyState === WebSocket.OPEN){
            clientWs.send(JSON.stringify(message));
        }
    });
}

wss.on('connection' , (ws)=>{
    console.log('New client connected');

    ws.on('message',(data)=>{
        try{
            const message = JSON.parse(data);

            if(message.type === 'join'){
                const username = message.username.trim();
                if(!username || clients.has(username)){
                    ws.send(JSON.stringify({type:"error",content:'Invalid or taken username'}));
                    return ;
                }
                clients.set(username,ws);
                sendSystemMessage(`${username} has joined the chat `);
                console.log(`${username} joined`);
            }else if(message.type === 'message'){
                const sender = [... clients.entries()].find(([_,clients])=>clients === ws)?.[0];
                if(!sender){
                    ws.send(JSON.stringify({type:'error',content:'Not authenticated'}));
                    return;
                }
                const fullMessage = {
                    type:'message',
                    sender,
                    content:message.content.trim(),
                    timeStamp:new Date().toISOString()
                };
                broadcast(fullMessage,ws);
                console.log(`Message from ${sender}: ${message.content}`);
            }else{
                ws.send(JSON.stringify({type:'error',content:'Invalid message type'}));
            }
        }catch(err){
            console.error(`Error parsing message:`,err);
            ws.send(JSON.stringify({type:'error',content:'Invalid message format'}));
        }
    });

ws.on('close', () => {
    const username = [...clients.entries()].find(([_, clientWs]) => clientWs === ws)?.[0];
    if (username) {
      clients.delete(username);
      sendSystemMessage(`${username} has left the chat`);
      console.log(`${username} disconnected`);
    }
  });

  ws.on('error', (err) => {
    console.error('WebSocket error:', err);
  });
});

const PORT = 8080;
server.listen(PORT,()=>{
    console.log(`Server running on http://localhost:${PORT}`);
});
