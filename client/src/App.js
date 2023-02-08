import "./App.css";
// import Button from "@mui/material/Button";
// import { io } from "socket.io-client";
// import { useEffect, useState } from "react";
// import { TextField, Button, Box } from "@mui/material";
import Chat from "./components/Chat";

function App() {
  // const [socket, setSocket] = useState(null);
  // const [message, setMessage] = useState("");

  // const handleSend = (e) => {
  //   e.preventDefault();
  //   socket.emit("sendMessage", { message });
  //   setMessage("");
  // };

  return (
    <div className="App">
      {/* <Box component="form" onSubmit={handleSend}>
        <TextField
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          label="write your message Message"
          variant="standard"
        />
        <Button variant="contained" type="submit">
          send
        </Button>
      </Box> */}
      <Chat />
    </div>
  );
}

export default App;
