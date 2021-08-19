import React from "react";
import { Alert, Badge, Button, Card, Form, Navbar, Nav, Container, Row, Col } from "react-bootstrap";
import api from 'utils/api'
import { apiUrl, filepath, imagePathForCsvUpload, eAudioPathForCsvUpload } from "./maseeha/config"

function User() {
  const [users, setUsers] = React.useState([])
  const [user, setUser] = React.useState({})
  const [emotionPacks, setEmotionPacks] = React.useState([])
  const [emotionPack, setEmotionPack] = React.useState({})
  const [question, setQuestion] = React.useState({})
  const [currentAnswer, setCurrentAnswer] = React.useState("")
  const [emotionAudio, setEmotionAudio] = React.useState({})
  const [showMessage, setShowMessage] = React.useState(false)

  React.useEffect(async () => {
    await getAllUsers()
    await getEmotionPacks()
  }, [])

  const getAllUsers = async () => {
    let tempUsers = (await api.get("/users")).data
    setUsers(tempUsers)
    setUser(tempUsers[0])
  }

  const getEmotionPacks = async () => {
    setEmotionPacks((await api.get("/emotion_packs")).data)
  }

  const getQuestionOnEmotionPack = async (emotionPack) => {
    let tempQuestion = (await api.post("/questions/ancestor", { emotionPack_id: emotionPack._id })).data
    if (tempQuestion) {
      setQuestion(tempQuestion)
    }
    setEmotionPack(emotionPack)
  }

  const getQuestionOnQuestionAndAnswer = async (question, answer) => {
    setCurrentAnswer("")
    let tempQuestion = (await api.post("/questions/question_answer", {
      emotionPack_id: emotionPack._id,
      question_id: question._id,
      answer_id: answer._id
    })).data
    if (tempQuestion) {
      setQuestion(tempQuestion)
      setShowMessage(false)
      if (!tempQuestion.answers.length) {
        setShowMessage(true)
        let tempEmotionAudio = (await api.post("/emotionaudio/matched", {
          emotionPack_id: emotionPack._id,
          question_id: tempQuestion._id,
        })).data
        setEmotionAudio(tempEmotionAudio)
      }
    } else {
      setShowMessage(true)
      let tempEmotionAudio = (await api.post("/emotionaudio/matched", {
        emotionPack_id: emotionPack._id,
        question_id: question._id,
        answer_id: answer._id
      })).data
      setEmotionAudio(tempEmotionAudio)
    }
  }

  return (
    <>
      <Container fluid>
        <Row>
          <Col md="8">
            <Card>
              <Card.Header>
                <Card.Title as="h4">Select User</Card.Title>
              </Card.Header>
              <Card.Body>
                <Form>
                  <Row>
                    <Col className="pr-1" md="6">
                      <Form.Control
                        placeholder="Input"
                        as="select"
                        value={user._id}
                        onChange={e => {
                          let tempUser = users.find(element => element._id === e.target.value)
                          setUser(tempUser)
                        }}
                      >
                        {users.map((each, i) => (
                          <option key={i} value={each._id}>{each.name}</option>
                        ))}
                      </Form.Control>
                    </Col>
                  </Row>
                </Form>
              </Card.Body>
            </Card>
            <Card>
              <Card.Header>
                <Card.Title as="h4">Edit Profile</Card.Title>
              </Card.Header>
              <Card.Body>
                <Form>
                  <Row>
                    <Col className="pr-1" md="6">
                      <Form.Group>
                        <label>Username</label>
                        <Form.Control
                          defaultValue={user.name}
                          placeholder="Username"
                          type="text"
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                    <Col className="pl-1" md="6">
                      <Form.Group>
                        <label htmlFor="exampleInputEmail1">
                          Email address
                        </label>
                        <Form.Control
                          defaultValue={user.email}
                          placeholder="Email"
                          type="email"
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="6">
                      <Form.Group>
                        <label>Location</label>
                        <Form.Control
                          defaultValue={user.location}
                          placeholder="Home Address"
                          type="text"
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                  {/* <Button
                    className="btn-fill pull-right"
                    type="submit"
                    variant="info"
                  >
                    Update Profile
                  </Button> */}
                  <div className="clearfix"></div>
                </Form>
              </Card.Body>
            </Card>
            <Card>
              <Card.Header>
                <Card.Title as="h4">Start Emotion Questioning</Card.Title>
              </Card.Header>
              <Card.Body>
                <Form>
                  <Row>
                    <Col className="pr-1" md="6">
                      <Form.Control
                        placeholder="Input"
                        as="select"
                        onChange={e => {
                          let tempEmotionPack = emotionPacks.find(element => element._id === e.target.value)
                          getQuestionOnEmotionPack(tempEmotionPack)
                        }}
                      >
                        <option>choose emotion ...</option>
                        {emotionPacks.map((each, i) => (
                          <option key={i} value={each._id}>{each.name}</option>
                        ))}
                      </Form.Control>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="6">
                      <Form.Group>
                        <label>Question</label>
                        <Form.Control
                          defaultValue={question.question}
                          placeholder="Question"
                          type="text"
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                    <Col className="pl-1" md="6">
                      <label>Ancestor Answers</label>
                      <Form.Control
                        placeholder="Input"
                        as="select"
                        value={currentAnswer}
                        onChange={e => {
                          let answer = question.answers.find(element => element._id === e.target.value)
                          getQuestionOnQuestionAndAnswer(question, answer)
                        }}
                      >
                        <option value="">choose answer ...</option>
                        {question.answers ? question.answers.map((each, i) => (
                          <option key={i} value={each._id}>{each.answer}</option>
                        )) : null}
                      </Form.Control>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="6">
                      {showMessage ?
                        <Alert variant="primary">
                          <span>We have found the best song for you.</span>
                        </Alert> : null
                      }
                    </Col>
                  </Row>
                </Form>
              </Card.Body>
            </Card>
          </Col>
          <Col md="4">
            <Card className="card-user">
              <div className="card-image">
                <img alt="..." src={require("assets/img/photo-1431578500526-4d9613015464.jpeg").default}></img>
              </div>
              <Card.Body>
                <div className="author">
                  <a href="#pablo" onClick={(e) => e.preventDefault()}>
                    <img alt="..." className="avatar border-gray" src={require("assets/img/faces/face-3.jpg").default}></img>
                    <h5 className="title">{user.name}</h5>
                  </a>
                  <p className="description">{user.email}</p>
                </div>
              </Card.Body>
              <hr></hr>
              <div className="button-container mr-auto ml-auto">
                <Button
                  className="btn-simple btn-icon"
                  href="#pablo"
                  onClick={(e) => e.preventDefault()}
                  variant="link"
                >
                  <i className="fab fa-facebook-square"></i>
                </Button>
                <Button
                  className="btn-simple btn-icon"
                  href="#pablo"
                  onClick={(e) => e.preventDefault()}
                  variant="link"
                >
                  <i className="fab fa-twitter"></i>
                </Button>
                <Button
                  className="btn-simple btn-icon"
                  href="#pablo"
                  onClick={(e) => e.preventDefault()}
                  variant="link"
                >
                  <i className="fab fa-google-plus-square"></i>
                </Button>
              </div>
            </Card>
            <Card>
              <Card.Header>
                <Card.Title as="h4">The Best Song For You</Card.Title>
              </Card.Header>
              <Card.Body>
                {(emotionAudio && emotionAudio.title) ?
                  <>
                    <p>{emotionAudio.title}</p>
                    <p>{emotionAudio.composername}</p>
                    <p><img src={filepath + emotionAudio.image} height="50px" alt="no image" /></p>
                    <audio controls>
                      <source src={filepath + emotionAudio.audiofile} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  </> : null
                }
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default User;
