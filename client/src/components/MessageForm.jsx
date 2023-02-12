import React, { useContext, useEffect, useRef, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { AppContext } from "../context/appContext";
import "./MessageForm.css";

const MessageForm = () => {
  const user = useSelector((state) => state.user);
  const [message, setMessage] = useState("");

  const { socket, currentRoom, messages, setMessages, privateMemberMsg } =
    useContext(AppContext);

  const messageEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  function getFormattedDate() {
    const date = new Date();
    let year = date.getFullYear();
    let month = (1 + date.getMonth()).toString();

    month = month.length > 1 ? month : "0" + month;
    let day = date.getDate().toString();
    day = day.length > 1 ? day : "0" + day;

    return month + "/" + day + "/" + year;
  }

  const todayDate = getFormattedDate();

  socket.off("room-messages").on("room-messages", (roomMessages) => {
    //console.log("room-messages", roomMessages);
    setMessages(roomMessages);
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message) return;
    const today = new Date();
    const minutes =
      today.getMinutes() < 10 ? "0" + today.getMinutes() : today.getMinutes();
    const time = today.getHours() + ":" + minutes;
    const roomId = currentRoom;
    socket.emit("message-room", roomId, message, user, time, todayDate);
    setMessage("");
  };

  function scrollToBottom() {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }
  //console.log("messages: ", messages);
  return (
    <>
      <div className="messages-output">
        {user && !privateMemberMsg?._id && (
          <div className="conversation-info">
            <p style={{ color: "#fff", marginLeft: 10, marginTop: 15 }}>
              {" "}
              You are in the {currentRoom} room
            </p>
          </div>
        )}
        {user && privateMemberMsg?._id && (
          <>
            <div className="conversation-info">
              <img
                src={privateMemberMsg.picture}
                className="conversation-profile-picture"
              />
              <p style={{ color: "#fff", marginTop: 15 }}>
                {privateMemberMsg.name}
              </p>
            </div>
          </>
        )}
        {!user && <div className="alert alert-danger">Please login</div>}

        {user &&
          messages.map(({ _id: date, messageByDate }, idx) => (
            <div key={idx}>
              <p className="alert alert-info text-center messages-date-indicator">
                {date}
              </p>
              {messageByDate?.map(({ content, time, sender }, msgIdx) => (
                <div
                  key={msgIdx}
                  className={
                    sender?.email === user?.email
                      ? "message"
                      : "incoming-message"
                  }
                >
                  <div className="message-inner">
                    <div className="d-flex align-items-center">
                      <img
                        src={sender?.picture}
                        style={{
                          width: 35,
                          height: 35,
                          objectFit: "cover",
                          borderRadius: "50%",
                          marginRight: 10,
                        }}
                      />
                      <p className="message-sender">
                        {sender._id === user?._id ? "You" : sender.name}
                      </p>
                    </div>
                    <p className="message-content">{content}</p>
                    <p className="message-timestamp-left">{time}</p>
                  </div>
                </div>
              ))}
            </div>
          ))}
        <div ref={messageEndRef}></div>
      </div>
      {/* message input form  */}
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={11}>
            <Form.Group>
              <Form.Control
                type="text"
                placeholder="your message"
                disabled={!user}
                onChange={(e) => setMessage(e.target.value)}
                value={message}
              ></Form.Control>
            </Form.Group>
          </Col>
          <Col md={1}>
            <Button
              variant="primary"
              type="submit"
              style={{ width: "100%", backgroundColor: "orange" }}
              disabled={!user || !message}
            >
              <i className="fas fa-paper-plane"></i>
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default MessageForm;
