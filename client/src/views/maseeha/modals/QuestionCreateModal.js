import React from "react";
import { Badge, Button, Card, Navbar, Nav, Table, Container, Row, Col, Modal, Form, InputGroup, FormLabel } from "react-bootstrap";
import api from 'utils/api';
import QuestionAnswerList from "../partials/QuestionAnswerList";
import { apiUrl, filepath } from "../config";
// axios.defaults.baseURL = apiUrl;

function QuestionCreateModal(props) {
  const [formData, setFormData] = React.useState({
    serial_number: '',
    question: '',
    type: 'Objective',
    category: '',
  });
  const { serial_number, question, type, category } = formData;

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const [answers, setAnswers] = React.useState([]);
  const [parentQuestions, setParentQuestions] = React.useState([]);
  const [parentAnswers, setParentAnswers] = React.useState([]);
  const [currentParentQuestion, setCurrentParentQuestion] = React.useState("");
  const [currentParentAnswer, setCurrentParentAnswer] = React.useState("")

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
    setFormData({
      serial_number: '',
      question: '',
      type: 'Objective',
      category: '',
    })
    setAnswers([]);
    setParentQuestions([]);
    setParentAnswers([]);
    setCurrentParentQuestion("");
    setCurrentParentAnswer("");
  }

  const closeModal = () => {
    allClear()
    props.setShowModalCreate(false);
  }

  const addNewQuestion = async () => {
    if (serial_number && question) {
      let sendData = { ...formData };
      sendData.answers = [];
      answers.forEach(element => {
        if (element.answer) {
          sendData.answers.push(element);
        }
      });
      if (currentParentQuestion) sendData.parent = currentParentQuestion
      if (currentParentAnswer) sendData.parent_answer = currentParentAnswer
      console.log(sendData)
      await api.post('/questions/add', sendData);
    }
    allClear()
    props.setShowModalCreate(false);
  }

  const onSelectCategory = e => {
    onChange(e);
    let tempParentQuestions = [...props.questions];
    let tempParentQuestions1 = tempParentQuestions.filter(element => element.emotionpack !== undefined && element.emotionpack !== null).filter(element => element.emotionpack._id === e.target.value);
    setParentQuestions(tempParentQuestions1);
    setParentAnswers(tempParentQuestions1[0] ? tempParentQuestions1[0].answers : []);
  }

  const onSelectParentQuestion = e => {
    setCurrentParentQuestion(e.target.value);
    let tempParentQuestions = [...parentQuestions];
    let tempParentQuestions1 = tempParentQuestions.find(element => element._id === e.target.value);
    setParentAnswers(tempParentQuestions1.answers);
  }

  return (
    <>
      <Modal
        className="modal modal-primary"
        show={props.showModalCreate}
        onHide={() => props.setShowModalCreate(false)}
      >
        <Modal.Header className="justify-content-center">
          <p>Create New Question</p>
        </Modal.Header>
        <Modal.Body className="text-center">
          <Row>
            <Col md="6">
              <FormLabel><b>Serial Number</b></FormLabel>
              <Form.Group>
                <Form.Control
                  type="text"
                  placeholder="Input"
                  name="serial_number"
                  value={serial_number}
                  onChange={onChange}
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
                  value={question}
                  onChange={onChange}
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
                  value={type}
                  onChange={onChange}
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
                  value={category}
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
                  value={currentParentQuestion}
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
                  value={currentParentAnswer}
                  onChange={e => setCurrentParentAnswer(e.target.value)}
                >
                  <option value={""}>Choose Parent Answer...</option>
                  {parentAnswers.map((each, i) => (
                    <option key={i} value={each._id}>{each.answer}</option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>
          {answers.map((each, i) => (
            <QuestionAnswerList
              key={i}
              ID={i}
              each={each}
              setEachAnswer={setEachAnswer}
            />
          ))}
          {(type === "Descriptive" || (type === "Informative" && answers.length === 1)) ? null :
            <Button
              className="btn-fill"
              variant="primary"
              size="sm"
              onClick={() => addNewAnswer()}
            >
              + New Answer
            </Button>
          }
        </Modal.Body>
        <div className="modal-footer">
          <Button
            className="btn-simple"
            type="button"
            variant="link"
            onClick={() => addNewQuestion()}
          >
            Create
          </Button>
          <Button
            className="btn-simple"
            type="button"
            variant="link"
            onClick={() => closeModal("create")}
          >
            Close
          </Button>
        </div>
      </Modal>
    </>
  );
}

export default QuestionCreateModal;
