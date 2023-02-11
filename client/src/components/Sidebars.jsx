import React from "react";
import { ListGroup } from "react-bootstrap";
import { useSelector } from "react-redux";

const Sidebars = () => {
  const user = useSelector((state) => state.user);
  const rooms = ["first room", "second room", "third room"];

  if (!user) {
    return <></>;
  }
  return (
    <>
      <h2>Available rooms</h2>
      <ListGroup>
        {rooms.map((room, idx) => (
          <ListGroup.Item key={idx}>{room}</ListGroup.Item>
        ))}
      </ListGroup>
      <h2>Members</h2>
    </>
  );
};

export default Sidebars;
