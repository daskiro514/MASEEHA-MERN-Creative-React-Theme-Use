import React, { useState } from "react";
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { setAlert } from '../../actions/alert';
import { register } from '../../actions/auth';
import PropTypes from 'prop-types';
import { Badge, Button, Card, Navbar, Nav, Table, Container, Row, Col, Modal, Form, InputGroup, FormLabel } from "react-bootstrap";

const Register = ({ setAlert, register, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
    location: ''
  });

  const { name, email, password, password2, location } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      setAlert('Passwords do not match', 'danger');
    } else {
      register({ name, email, password, location });
    }
  };

  if (isAuthenticated) {
    return <Redirect to="/admin/dashboard" />;
  }

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
            <FormLabel>Name</FormLabel>
            <Form.Group>
              <Form.Control
                type="text"
                placeholder="name"
                name="name"
                value={name}
                onChange={onChange}
                required />
            </Form.Group>
            <FormLabel>Email</FormLabel>
            <Form.Group>
              <Form.Control
                type="text"
                placeholder="email"
                name="email"
                value={email}
                onChange={onChange}
                required />
            </Form.Group>
            <FormLabel>Location</FormLabel>
            <Form.Group>
              <Form.Control
                type="text"
                placeholder="location"
                name="location"
                value={location}
                onChange={onChange}
                required />
            </Form.Group>
            <FormLabel>Password</FormLabel>
            <Form.Group>
              <Form.Control
                type="password"
                placeholder="password"
                name="password"
                value={password}
                onChange={onChange}
                required />
            </Form.Group>
            <FormLabel>Confirm Password</FormLabel>
            <Form.Group>
              <Form.Control
                type="password"
                placeholder="confirm password"
                name="password2"
                value={password2}
                onChange={onChange}
                required />
            </Form.Group>
            <Button
              className="btn-fill"
              type="button"
              variant="primary"
              onClick={onSubmit}
            >
              Register
            </Button>
          </Col>
        </Row>
      </Container>
    </>
  );
}

Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { setAlert, register })(Register);
