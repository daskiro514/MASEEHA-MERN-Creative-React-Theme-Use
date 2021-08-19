import React from "react";
import { Badge, Button, Card, Navbar, Nav, Table, Container, Row, Col, Modal, Form, InputGroup, FormLabel } from "react-bootstrap";
import api from 'utils/api';
import { TimeDurationInput } from 'react-time-duration-input'
import {apiUrl, filepath, imagePathForCsvUpload} from "../config";
// axios.defaults.baseURL = apiUrl;

function EmotionAudioCreateModal(props) {
  const [title, setTitle] = React.useState("");
  const [composername, setComposerName] = React.useState("");
  const [image, setImage] = React.useState(null);
  const [audiofile, setAudioFile] = React.useState(null);
  const [emotion_pack, setEmotionPack] = React.useState("");
  const [question, setQuestion] = React.useState("");
  const [questions, setQuestions] = React.useState([]);
  const [answer, setAnswer] = React.useState("");
  const [answers, setAnswers] = React.useState([]);

  const onSelectEmotionPack = e => {
    setEmotionPack(e.target.value);
    setQuestions([...props.questions].filter(element => element.emotionpack !== undefined && element.emotionpack !== null).filter(element => element.emotionpack._id === e.target.value));
  }

  const onSelectQuestion = e => {
    setQuestion(e.target.value);
    setAnswers([...questions].find(element => element._id === e.target.value).answers)
  }

  const addNewEmotionAudio = async () => {
    let formData = new FormData();
    formData.append('image', image);
    formData.append('audiofile', audiofile);
    formData.append('title', title);
    formData.append('composername', composername);
    formData.append('emotion_pack', emotion_pack);
    formData.append('question', question);
    formData.append('answer', answer);
    if (title && audiofile && emotion_pack) {
      props.setEmotionAudios((await api.post('/emotionaudio/add', formData)).data);
      closeModal()
    } else {
      alert("please input the fields")
    }
  }

  const allClear = () => {
    setTitle("");
    setComposerName("");
    setImage(null);
    setAudioFile(null);
    setEmotionPack("");
    setQuestion("");
    setQuestions([]);
    setAnswer("");
    setAnswers([]);
  }

  const closeModal = () => {
    allClear()
    props.setShowModalCreate(false);
  }
  return (
    <>
      <Modal
        className="modal modal-primary"
        show={props.showModalCreate}
        onHide={() => props.setShowModalCreate(false)}
      >
        <Modal.Header className="justify-content-center">
          <p>Create New Emotion Audio</p>
        </Modal.Header>
        <Modal.Body className="text-center">
          <Row>
            <Col md="6">
              <FormLabel><b>Title</b></FormLabel>
              <Form.Group>
                <Form.Control
                  type="text"
                  placeholder="Input"
                  name="title"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required 
                />
              </Form.Group>
            </Col>
            <Col md="6">
              <FormLabel><b>Composer Name</b></FormLabel>
              <Form.Group>
                <Form.Control
                  type="text"
                  placeholder="Input"
                  name="composername"
                  value={composername}
                  onChange={e => setComposerName(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md="6">
              <FormLabel><b>Image</b></FormLabel>
              <Form.Group>
                <Form.Control
                  type="file"
                  name="image"
                  accept=".png, .jpg, .jpeg"
                  onChange={e => setImage(e.target.files[0])}
                ></Form.Control>
              </Form.Group>
            </Col>
            <Col md="6">
              <FormLabel><b>Audio File</b></FormLabel>
              <Form.Group>
                <Form.Control
                  type="file"
                  name="audiofile"
                  accept=".mp3, .wav"
                  onChange={e => setAudioFile(e.target.files[0])}
                ></Form.Control>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md="6">
              <FormLabel><b>Emotion Pack</b></FormLabel>
              <Form.Group>
                <Form.Control
                  placeholder="Input"
                  as="select"
                  name="emotion_pack"
                  value={emotion_pack}
                  onChange={onSelectEmotionPack}
                >
                  <option value={null}>Choose Category...</option>
                  {props.emotionPacks.map((each, i) => (
                    <option key={i} value={each._id}>{each.name}</option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md="6">
              <FormLabel><b>Question</b></FormLabel>
              <Form.Group>
                <Form.Control
                  placeholder="Input"
                  as="select"
                  name="question"
                  value={question}
                  onChange={onSelectQuestion}
                >
                  <option value={null}>Choose Question...</option>
                  {questions.map((each, i) => (
                    <option key={i} value={each._id}>{each.question}</option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
            <Col md="6">
              <FormLabel><b>Answer</b></FormLabel>
              <Form.Group>
                <Form.Control
                  placeholder="Input"
                  as="select"
                  name="question"
                  value={answer}
                  onChange={e => setAnswer(e.target.value)}
                >
                  <option value={null}>Choose Question...</option>
                  {answers.map((each, i) => (
                    <option key={i} value={each._id}>{each.answer}</option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <div className="modal-footer">
          <Button
            className="btn-simple"
            type="button"
            variant="link"
            onClick={() => addNewEmotionAudio()}
          >
            Create
          </Button>
          <Button
            className="btn-simple"
            type="button"
            variant="link"
            onClick={() => closeModal()}
          >
            Close
          </Button>
        </div>
      </Modal>
    </>
  );
}

export default EmotionAudioCreateModal;
