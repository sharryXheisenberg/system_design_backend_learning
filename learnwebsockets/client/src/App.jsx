import React from "react";
import { io } from "socket.io-client";

export const App = () => {
  const _socket = io("http://localhost:3000");
  return <div>App</div>;
};

export default App;
