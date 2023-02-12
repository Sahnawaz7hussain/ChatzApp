import React, { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "./Signup.css";
import robot from "../assests/robot.jpg";
import { useSignupUserMutation } from "../services/appApi";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [signupUser, { isLoading, error }] = useSignupUserMutation();
  const navigate = useNavigate();
  // image upload states
  const [image, setImage] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  function validateImg(e) {
    const file = e.target.files[0];
    if (file.size >= 1048576) {
      return alert("Max file size is 1mb");
    } else {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!image) return alert("Please upload your profile picture");

    const url = await uploadImage(image);
    //console.log("image url", url);
    // signup User.
    signupUser({ name, email, password, picture: url }).then((data) => {
      if (data.data) {
        navigate("/chat");
        //console.log(data);
      }
    });
  };

  async function uploadImage() {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "k1qaltld");
    try {
      setUploadingImage(true);
      let res = await fetch(
        `https://api.cloudinary.com/v1_1/didggve77/image/upload`,
        {
          method: "POST",
          body: data,
        }
      );
      const urlData = await res.json();
      setUploadingImage(false);
      return urlData.url;
    } catch (err) {
      //  console.log(err);
      setUploadingImage(false);
    }
  }

  return (
    <Container>
      <Row>
        <Col
          md={7}
          className="d-flex align-items-center justify-content-center flex-direction-column"
        >
          <Form style={{ width: "80%", maxWidth: 500 }} onSubmit={handleSignup}>
            <h1 className="text-center">Create account</h1>
            <div className="signup_profile_container">
              <img
                src={imagePreview || robot}
                alt="Profile"
                className="signup_profile_pic"
              />
              <label htmlFor="image-upload" className="image-upload-label">
                <i className="fas fa-plus-circle add-picture-icon"></i>
              </label>
              <input
                type="file"
                id="image-upload"
                hidden
                accept="image/png,image/jpeg"
                onChange={validateImg}
              />
            </div>
            <Form.Group className="mb-3" controlId="formBasicName">
              {error && <p className="alert alert-danger">{error.data}</p>}
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                onChange={(e) => setName(e.target.value)}
                value={name}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
              />
              <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              {uploadingImage || isLoading
                ? "Creating your up..."
                : "Create account"}
            </Button>
            <div className="py-4">
              <p className="text-center">
                Already have an account ? <Link to="/login">Login</Link>
              </p>
            </div>
          </Form>
        </Col>
        <Col md={5} className="signup__bg"></Col>
      </Row>
    </Container>
  );
};

export default Signup;
