import { io } from "socket.io-client";
import React from "react";
// const socket_url = "https://b-c-a.onrender.com";
const socket_url = process.env.REACT_APP_BASE_URL;

export const socket = io(socket_url);

// app context
export const AppContext = React.createContext();
