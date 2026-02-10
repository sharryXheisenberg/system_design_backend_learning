import React, { useEffect } from "react";
import { io } from "socket.io-client";

export const App = () => {
  const _socket = io("http://localhost:3000");

  useEffect(() => {
    _socket.on("connect", () => {
      console.log("connected", _socket.id);
    });
    _socket.on("welcome", (s) => {
      console.log(s);
    });

    return () => {
      _socket.disconnet();
    };
  }, []);

  return <div>App</div>;
};

export default App;
