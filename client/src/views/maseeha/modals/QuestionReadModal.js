import React from "react";
import { Badge, Button, Card, Navbar, Nav, Table, Container, Row, Col, Modal, Form, InputGroup, FormLabel } from "react-bootstrap";

function QuestionReadModal(props) {
  const question = props.question
  if (question)
    return (
      <>
        <Modal
          className="modal modal-primary"
          show={props.showModalRead}
          onHide={() => props.setShowModalRead(false)}
        >
          <Modal.Header className="justify-content-center">
            <h4>Question Info</h4>
          </Modal.Header>
          <Modal.Body className="text-center">
            <Table className="table-hover">
              <tbody>
                <tr>
                  <td>Question</td>
                  <td>{question.question}</td>
                </tr>
                <tr>
                  <td>Question Type</td>
                  <td>{question.type}</td>
                </tr>
                <tr>
                  <td>Category</td>
                  <td>{question.emotionpack ? question.emotionpack.name : null}</td>
                </tr>
                <tr>
                  <td>Parent Question</td>
                  <td>{question.parent ? question.parent.question : null}</td>
                </tr>
                <tr>
                  <td>Parent Answer</td>
                  <td>{question.parent_answer ? question.parent_answer.answer : null}</td>
                </tr>
                <tr>
                  <td>Answers</td>
                  <td>
                    <Table>
                      <thead>
                        <tr>
                          <th>Answer</th>
                          <th>Explanation</th>
                        </tr>
                      </thead>
                      <tbody>
                        {question.answers.map((each, i) => (
                          <tr key={i}>
                            <td>{each.answer}</td>
                            <td>{each.explaination}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </td>
                </tr>
              </tbody>
            </Table>
          </Modal.Body>
          <div className="modal-footer">
            <Button
              className="btn-simple"
              type="button"
              variant="link"
              style={{ visibility: "hidden" }}
              onClick={() => props.setShowModalRead(false)}
            >
              Close
            </Button>
            <Button
              className="btn-simple"
              type="button"
              variant="link"
              onClick={() => props.setShowModalRead(false)}
            >
              Close
            </Button>
          </div>
        </Modal>
      </>
    );
  else
    return (
      <></>
    )
}

export default QuestionReadModal;
