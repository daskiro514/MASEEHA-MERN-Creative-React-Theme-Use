import React from "react";
import { Badge, Button, Card, Navbar, Nav, Table, Container, Row, Col, Modal, Form, InputGroup, FormLabel } from "react-bootstrap";
import api from 'utils/api';
import AnswerListForUpdate from "../partials/AnswerListForUpdate";
import QuestionAnswerList from "../partials/QuestionAnswerList";
import { apiUrl, filepath } from "../config";
// axios.defaults.baseURL = apiUrl;

function QuestionUpdateModal(props) {
  const [updatedSerialNumber, setUpdatedSerialNumber] = React.useState("");
  const [updatedQuestion, setUpdatedQuestion] = React.useState("");
  const [updatedType, setUpdatedType] = React.useState("");
  const [updatedCategory, setUpdatedCategory] = React.useState("");
  const [updatedParentQuestion, setUpdatedParentQuestion] = React.useState("");
  const [updatedParentAnswer, setUpdatedParentAnswer] = React.useState("");
  const [updatedAnswers, setUpdatedAnswers] = React.useState([]);
  const [answers, setAnswers] = React.useState([]);
  const [parentQuestions, setParentQuestions] = React.useState([]);
  const [parentAnswers, setParentAnswers] = React.useState([]);

  React.useEffect(() => {
    if (props.question) {
      setUpdatedSerialNumber(props.question.serial_number)
      setUpdatedQuestion(props.question.question);
      setUpdatedType(props.question.type);
      setUpdatedCategory(props.question.emotionpack ? props.question.emotionpack._id : "");
      if (props.question.emotionpack) {
        let tempParentQuestions = [...props.questions].filter(element => element.emotionpack !== undefined && element.emotionpack !== null).filter(element => element.emotionpack._id === props.question.emotionpack._id);
        setParentQuestions(tempParentQuestions);
        let tempParentQuestion = tempParentQuestions.find(element => element._id === props.question.parent._id)
        console.log(tempParentQuestion)
        setParentAnswers(tempParentQuestion ? tempParentQuestion.answers : []);
      } else {
        setParentQuestions([]);
        setParentAnswers([]);
      }
      if (props.question.answers) {
        let tempUpdatedAnswers = [...props.question.answers]
        setUpdatedAnswers(tempUpdatedAnswers);
      } else {
        setUpdatedAnswers([]);
      }
      setUpdatedParentQuestion(props.question.parent ? props.question.parent._id : "");
      setUpdatedParentAnswer(props.question.parent_answer ? props.question.parent_answer._id : "");
    }
  }, [props.question]);

  const onSelectCategory = e => {
    setUpdatedCategory(e.target.value)
    let tempParentQuestions = [...props.questions];
    let tempParentQuestions1 = tempParentQuestions.filter(element => element.emotionpack !== undefined).filter(element => element.emotionpack._id === e.target.value);
    setParentQuestions(tempParentQuestions1);
    setParentAnswers(tempParentQuestions1[0] ? tempParentQuestions1[0].answers : []);
  }

  const onSelectParentQuestion = e => {
    setUpdatedParentQuestion(e.target.value);
    let tempParentQuestions = [...parentQuestions];
    let tempParentQuestions1 = tempParentQuestions.find(element => element._id === e.target.value);
    setParentAnswers(tempParentQuestions1.answers);
  }

  const setEachUpdatedAnswer = (answerIndex, answerObject) => {
    let temp = [...updatedAnswers];
    temp[answerIndex] = answerObject;
    setUpdatedAnswers(temp);
  }

  const addNewAnswer = () => {
    let temp = [...answers];
    temp.push({
      answer: "",
      explaination: ""
    });
    setAnswers(temp);
  }

  const setEachAnswer = (answerIndex, answerObject) => {
    let temp = [...answers];
    temp[answerIndex] = answerObject;
    setAnswers(temp);
  }

  const allClear = () => {
    // setUpdatedQuestion("");
    // setUpdatedType("");
    // setUpdatedCategory("")
    // setAnswers([]);
    // setParentQuestions([]);
    // setParentAnswers([]);
    // setUpdatedParentQuestion("");
    // setUpdatedParentAnswer("");
  }

  const closeModal = () => {
    allClear()
    props.setShowModalUpdate(false);
  }

  const updateQuestion = async () => {
    const sendData = {
      serial_number: updatedSerialNumber,
      question: updatedQuestion,
      type: updatedType,
      emotionpack: updatedCategory,
    }
    sendData._id = props.question._id;
    if (updatedParentQuestion) sendData.parent = updatedParentQuestion;
    if (updatedParentAnswer) sendData.parent_answer = updatedParentAnswer;
    sendData.answers = [];
    updatedAnswers.forEach(element => {
      if (element.answer) {
        sendData.answers.push(element);
      }
    });
    answers.forEach(element => {
      if (element.answer) {
        sendData.answers.push(element);
      }
    });
    if (updatedType === "Descriptive") {
      sendData.answers = [];
    }
    props.setQuestions((await api.post("/questions/update", sendData)).data);
    allClear()
    props.setShowModalUpdate(false);
  }

  if (props.question)
    return (
      <>
        <Modal
          className="modal modal-primary"
          show={props.showModalUpdate}
          onHide={() => props.setShowModalUpdate(false)}
        >
          <Modal.Header className="justify-content-center">
            <p>Update Question</p>
          </Modal.Header>
          <Modal.Body className="text-center">
            <Row>
              <Col md="6">
                <FormLabel><b>Serial Number</b></FormLabel>
                <Form.Group>
                  <Form.Control
                    placeholder="Serial Number Here."
                    name="serial_number"
                    value={updatedSerialNumber}
                    onChange={e => setUpdatedSerialNumber(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md="6">
                <FormLabel><b>Question</b></FormLabel>
                <Form.Group>
                  <Form.Control
                    placeholder="Question here."
                    rows="2"
                    as="textarea"
                    name="question"
                    value={updatedQuestion}
                    onChange={e => setUpdatedQuestion(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md="6">
                <FormLabel><b>Question Type</b></FormLabel>
                <Form.Group>
                  <Form.Control
                    placeholder="Input"
                    as="select"
                    name="type"
                    value={updatedType}
                    onChange={e => setUpdatedType(e.target.value)}
                  >
                    <option>Objective</option>
                    <option>Descriptive</option>
                    <option>Informative</option>
                    <option>Rating</option>
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md="6">
                <FormLabel><b>Category</b></FormLabel>
                <Form.Group>
                  <Form.Control
                    placeholder="Input"
                    as="select"
                    name="category"
                    value={updatedCategory}
                    onChange={onSelectCategory}
                  >
                    <option value={null}>Choose Category...</option>
                    {props.emotionPacks.length ? props.emotionPacks.map((each, i) => (
                      <option key={i} value={each._id}>{each.name}</option>
                    )) : null}
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md="6">
                <FormLabel><b>Parent Question</b></FormLabel>
                <Form.Group>
                  <Form.Control
                    placeholder="Input"
                    as="select"
                    name="type"
                    value={updatedParentQuestion}
                    onChange={onSelectParentQuestion}
                  >
                    <option value={""}>Choose Parent ...</option>
                    {parentQuestions.map((each, i) => (
                      <option key={i} value={each._id}>{each.question}</option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md="6">
                <FormLabel><b>Parent Answer</b></FormLabel>
                <Form.Group>
                  <Form.Control
                    placeholder="Input"
                    as="select"
                    name="category"
                    value={updatedParentAnswer}
                    onChange={e => setUpdatedParentAnswer(e.target.value)}
                  >
                    <option value={""}>Choose Parent Answer...</option>
                    {parentAnswers.map((each, i) => (
                      <option key={i} value={each._id}>{each.answer}</option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>
            {updatedType === "Descriptive" ? null : updatedAnswers.map((each, i) => (
              <AnswerListForUpdate
                key={i}
                ID={i}
                each={each}
                setEachUpdatedAnswer={setEachUpdatedAnswer}
              />
            ))}
            {updatedType === "Descriptive" ? null :
              <Button
                className="btn-fill"
                variant="primary"
                size="sm"
                onClick={() => addNewAnswer()}
              >
                + New Answer
              </Button>
            }
            {updatedType === "Descriptive" ? null : answers.map((each, i) => (
              <QuestionAnswerList
                key={i}
                ID={i}
                each={each}
                setEachAnswer={setEachAnswer}
              />
            ))}
          </Modal.Body>
          <div className="modal-footer">
            <Button
              className="btn-simple"
              type="button"
              variant="link"
              onClick={() => updateQuestion()}
            >
              Update
            </Button>
            <Button
              className="btn-simple"
              type="button"
              variant="link"
              onClick={closeModal}
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

export default QuestionUpdateModal;
