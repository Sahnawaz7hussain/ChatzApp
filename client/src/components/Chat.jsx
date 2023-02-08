import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { Send } from "@mui/icons-material";
import {
  FormControl,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Box,
} from "@mui/material";
// import { Box } from "@mui/system";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const [chat, setChat] = useState([]);

  const mainContainer = {
    height: "400px",
    width: "90%",
    margin: `auto`,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    border: "1px solid black",
  };

  useEffect(() => {
    setSocket(io("http://localhost:8080"));
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on("message-from-server", (data) => {
      setChat((prev) => [...prev, { ...data, received: true }]);
    });
  }, [socket]);

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = () => {
    socket.emit("send-message", { message });
    setChat((pre) => [...pre, { message, received: false }]);
    setMessage("");
  };
  //console.log(chat, "received message from server");

  return (
    <Box sx={mainContainer}>
      <Box sx={{ height: "auto", width: "100%", border: "1px solid blue" }}>
        {chat.map((el, index) => {
          return (
            <Box
              key={index}
              sx={{
                height: "fit-content",
                width: "fit-content",
                border: "1px solid lightgray",
                background: "lightgray",
                marginBottom: "5px",
              }}
            >
              <p sx={{ padding: 0 }}>{el.message}</p>
            </Box>
          );
        })}
      </Box>

      <FormControl
        sx={{ border: "1px solid green", width: "100%", margin: "auto" }}
        variant="outlined"
      >
        <OutlinedInput
          value={message}
          onChange={handleInputChange}
          endAdornment={
            <InputAdornment position="end">
              <IconButton onClick={handleSendMessage} edge="end">
                {<Send />}
              </IconButton>
            </InputAdornment>
          }
          id="chat-message"
          size="small"
          placeholder="Enter new message..."
        />
      </FormControl>
    </Box>
  );
};

export default Chat;
