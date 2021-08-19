import React, { useState } from "react";
import { Link, Redirect } from 'react-router-dom';
import { Badge, Button, Card, Navbar, Nav, Table, Container, Row, Col, Modal, Form, InputGroup, FormLabel } from "react-bootstrap";

import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from '../../actions/auth';

const Login = ({ login, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const { email, password } = formData;

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    login(email, password);
  };

  if (isAuthenticated) {
    return <Redirect to="/admin/dashboard" />;
  }

  return (
    <>
      <Container fluid>
        <Row style={{ height: "100vh" }}>
          <Col md="8" style={{ background: "#3f51b5" }}>
            <div style={{ display: "flex", margin: "auto", paddingTop: "20%", alignItems:'center', width: "90%" }}>
              <i className="nc-icon nc-circle-09" style={{ color: "white", fontSize: "150px" }}></i>
              <div style={{display: "flex", flexDirection:"column", paddingLeft: "30px"}}>
                <h1 style={{  color: "white" }}>Welcome to MESIAH!</h1>
                <h2 style={{  color: "#999" }}>Here, You can get the greatest thing within you!</h2>
              </div>
            </div>
          </Col>
          <Col md="4" style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <FormLabel>Email</FormLabel>
            <Form.Group>
              <Form.Control
                type="text"
                placeholder="Input"
                name="email"
                value={email}
                onChange={onChange}
                required />
            </Form.Group>
            <FormLabel>Password</FormLabel>
            <Form.Group>
              <Form.Control
                type="password"
                placeholder="Input"
                name="password"
                value={password}
                onChange={onChange}
                required />
            </Form.Group>
            <Link to="/forgot">Forgot Password</Link>
            <Button
              className="btn-fill"
              type="button"
              variant="primary"
              onClick={onSubmit}
            >
              Login
            </Button>
            <br/>
            <Button
              className="btn-fill"
              type="button"
              variant="primary"
            >
              <Link to="/register">Register</Link>
            </Button>
          </Col>
        </Row>
      </Container>
    </>
  );
}

Login.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { login })(Login);
