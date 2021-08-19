import React from "react";
import { Badge, Button, Card, Navbar, Nav, Table, Container, Row, Col, Modal, Form, InputGroup, FormLabel } from "react-bootstrap";

function QuestionAnswerList(props) {
  const [formData, setFormData] = React.useState({
    answer: '',
    explaination: '',
  });
  const { answer, explaination } = formData;
  
  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    props.setEachAnswer(props.ID, formData);
  }

  return (
    <>
      <Row>
        <Col md="6">
          <FormLabel><b>Answer</b></FormLabel>
          <Form.Group>
            <Form.Control
              placeholder="Answer here."
              rows="2"
              as="textarea"
              name="answer"
              value={answer}
              onChange={onChange}
              required
            />
          </Form.Group>
        </Col>
        <Col md="6">
          <FormLabel><b>Answer Explanation</b></FormLabel>
          <Form.Group>
            <Form.Control
              placeholder="Answer here."
              rows="2"
              as="textarea"
              name="explaination"
              value={explaination}
              onChange={onChange}
              required
            />
          </Form.Group>
        </Col>
      </Row>
    </>
  );
}

export default QuestionAnswerList;
