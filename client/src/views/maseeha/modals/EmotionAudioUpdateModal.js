import React from "react";
import { Badge, Button, Card, Navbar, Nav, Table, Container, Row, Col, Modal, Form, InputGroup, FormLabel } from "react-bootstrap";
import api from 'utils/api';
import { TimeDurationInput } from 'react-time-duration-input'
import {apiUrl, filepath} from "../config";
// axios.defaults.baseURL = apiUrl;

function EmotionAudioUpdateModal(props) {
  React.useEffect(() => {
    if (props.emotionAudioForUpdate) {
      setTitle(props.emotionAudioForUpdate.title);
      setComposerName(props.emotionAudioForUpdate.composername);
      setEmotionPack(props.emotionAudioForUpdate.emotion_pack._id);
      if (props.emotionAudioForUpdate.emotion_pack) {
        let tempQuestions = [...props.questions].filter(element => element.emotionpack !== undefined && element.emotionpack !== null).filter(element => element.emotionpack._id === props.emotionAudioForUpdate.emotion_pack._id);
        setQuestions(tempQuestions);
        setAnswers(tempQuestions[0] ? tempQuestions[0].answers : []);
      } else {
        setQuestions([]);
        setAnswers([]);
      }
      setQuestion(props.emotionAudioForUpdate.question ? props.emotionAudioForUpdate.question._id : "");
      setAnswer(props.emotionAudioForUpdate.answer ? props.emotionAudioForUpdate.answer._id : "");
    }
  }, [props.emotionAudioForUpdate]);

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
    let tempQuestions = [...props.questions].filter(element => element.emotionpack !== undefined && element.emotionpack !== null).filter(element => element.emotionpack._id === e.target.value);
    setQuestions(tempQuestions);
    setAnswers(tempQuestions[0] ? tempQuestions[0].answers : []);
  }

  const onSelectQuestion = e => {
    setQuestion(e.target.value);
    let tempQuestions = [...questions].find(element => element._id === e.target.value);
    setAnswers(tempQuestions.answers);
  }

  const allClear = () => {
    setImage(null);
    setAudioFile(null);
  }

  const closeModal = () => {
    allClear()
    props.setShowModalUpdate(false);
  }

  const updateEmotionAudio = async () => {
    let formData = new FormData();
    formData.append('image', image);
    formData.append('audiofile', audiofile);
    formData.append('title', title);
    formData.append('composername', composername);
    formData.append('emotion_pack', emotion_pack);
    formData.append('question', question);
    formData.append('answer', answer);
    formData.append('_id', props.emotionAudioForUpdate._id);
    if (title && composername) {
      props.setEmotionAudios((await api.post('/emotionaudio/update', formData)).data);
      closeModal()
    } else {
      alert("please input the fields")
    }
  }

  if (props.emotionAudioForUpdate)
    return (
      <>
        <Modal
          className="modal modal-primary"
          show={props.showModalUpdate}
          onHide={() => props.setShowModalUpdate(false)}
        >
          <Modal.Header className="justify-content-center">
            <p>Update Emotion Audio</p>
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
                    accept=".mp3, .wav"
                    name="audiofile"
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
                    <option value={null}>Choose Emotion...</option>
                    {props.emotionPacks.length ? props.emotionPacks.map((each, i) => (
                      <option key={i} value={each._id}>{each.name}</option>
                    )) : null}
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md="6">
                <FormLabel><b>Question</b></FormLabel>
                <Form.Group>
                  <Form.Control
                    as="select"
                    name="question"
                    value={question}
                    onChange={onSelectQuestion}
                  >
                    <option value={null}>Choose Question...</option>
                    {questions.length ? questions.map((each, i) => (
                      <option key={i} value={each._id}>{each.question}</option>
                    )) : null}
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md="6">
                <FormLabel><b>Answer</b></FormLabel>
                <Form.Group>
                  <Form.Control
                    as="select"
                    name="answer"
                    value={answer}
                    onChange={e => setAnswer(e.target.value)}
                  >
                    <option value={null}>Choose Answer...</option>
                    {answers.length ? answers.map((each, i) => (
                      <option key={i} value={each._id}>{each.answer}</option>
                    )) : null}
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
              onClick={() => updateEmotionAudio()}
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

export default EmotionAudioUpdateModal;
