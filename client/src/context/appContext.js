import { io } from "socket.io-client";
import React from "react";
const socket_url = "http://localhost:8080";

export const socket = io(socket_url);

// app context
export const AppContext = React.createContext();
