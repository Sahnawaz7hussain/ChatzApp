import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import MessageForm from "../components/MessageForm";
import Sidebars from "../components/Sidebars";

const Chat = () => {
  return (
    <Container>
      <Row>
        <Col md={4}>
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
