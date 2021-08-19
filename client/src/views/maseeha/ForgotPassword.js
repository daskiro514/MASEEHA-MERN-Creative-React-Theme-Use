import React, { useState } from "react";
import { Link, Redirect } from 'react-router-dom';
import { Alert, Badge, Button, Card, Navbar, Nav, Table, Container, Row, Col, Modal, Form, InputGroup, FormLabel } from "react-bootstrap";
import api from 'utils/api'
import NotificationAlert from "react-notification-alert";

const ForgotPassword = () => {
  const [email, setEmail] = React.useState("")
  const [response, setResponse] = React.useState({})

  const onSubmit = async (e) => {
    e.preventDefault();
    let responseFromServer = (await api.post('/users/forgotpassword/', { email })).data
    setResponse(responseFromServer)
  };

  return (
    <>
      <Container fluid>
        <Row style={{ height: "100vh" }}>
          <Col md="8" style={{ background: "#3f51b5" }}>
            <div style={{ display: "flex", margin: "auto", paddingTop: "20%", alignItems: 'center', width: "90%" }}>
              <i className="nc-icon nc-circle-09" style={{ color: "white", fontSize: "150px" }}></i>
              <div style={{ display: "flex", flexDirection: "column", paddingLeft: "30px" }}>
                <h1 style={{ color: "white" }}>Welcome to MESIAH!</h1>
                <h2 style={{ color: "#999" }}>Here, You can get the greatest thing within you!</h2>
              </div>
            </div>
          </Col>
          <Col md="4" style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
            {response.type ?
              <Alert variant={response.type}>
                <span>{response.content}</span>
              </Alert> : null
            }
            <FormLabel>Email</FormLabel>
            <Form.Group>
              <Form.Control
                type="text"
                placeholder="Email Address"
                name="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required />
            </Form.Group>
            <Button
              className="btn-fill"
              type="button"
              variant="primary"
              onClick={onSubmit}
            >
              Reset
            </Button>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default (ForgotPassword);
