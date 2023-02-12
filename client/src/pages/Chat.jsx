import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import MessageForm from "../components/MessageForm";
import Sidebars from "../components/Sidebars";
import "../components/Sidebar.css";

const Chat = () => {
  return (
    <Container>
      <Row>
        <Col md={4} className="sideBarCol">
          <Sidebars />
        </Col>
        <Col md={8}>
          <MessageForm />
        </Col>
      </Row>
    </Container>
  );
};

export default Chat;
