## A simple websocket-chat-app
The application is a real-time chat system using WebSockets, allowing two (or more) clients to exchange text messages. This design focuses on simplicity for beginners while incorporating professional engineering practices like modularity, error handling, and basic security (e.g., input validation). It's not just a bare-bones echo server; it includes features like user authentication via usernames, message broadcasting with timestamps, and connection/disconnection notifications to mimic a "real engineering job" (e.g., a basic collaborative tool or live support chat). This can be shown to others as a scalable starting point for more complex apps like binary file transfers (as you mentioned for future chats).

#### **Key Components**
- **1.Server (Node.js)**
    - Acts as the central hub.
    - Handles WebSocket connections from clients.
    - Maintains a list of connected clients (with usernames).
    - Broadcasts messages to all other clients (excluding the sender for efficiency).
    - Sends system messages (e.g., "User joined/left").
    - Includes basic error handling (e.g., invalid messages, disconnections).

- **2.Clients (Browser-based JavaScript)**
    - Connect to the server via WebSocket.
    - Prompt for a username on connection.
    - Send text messages to the server.
    - Receive and display messages in real-time (with sender info and timestamps).
    - Use HTML for UI (input field, send button, message display area).

    
- **3.Communication Flow**
    - Client connects to WebSocket endpoint (ws://localhost:8080).
    - Client sends a "join" message with username.
    - Server validates and broadcasts join notification.
    - Client sends "message" with text; server broadcasts to others.
    - On disconnect, server broadcasts leave notification.

- **4.Assumptions and Scalability**
    - Designed for 2 clients but supports more (broadcast model).
    - Messages are JSON-encoded for structure (type: 'join'/'message'/'system', content, sender, timestamp).
    - No database ( in-memory client list)
    - Security- Basic input sanitization; in real-world, need to add HTTPS/WSS.
    - Future extension: Add binary support by handling ArrayBuffer in messages.


#### Architecture/High level design 
[Architecture_of_directMsgs](./assets/websocket_type_1_architecture.png)
