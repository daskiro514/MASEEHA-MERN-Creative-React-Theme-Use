import React from "react"
import { Badge, Button, Card, Navbar, Nav, Table, Container, Row, Col, Modal, Form, InputGroup, FormLabel } from "react-bootstrap"
import api from 'utils/api'
import { apiUrl, filepath } from "../config"
// axios.defaults.baseURL = apiUrl

function UserCreateModal(props) {
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [location, setLocation] = React.useState("")
  const [emotion_pack, setEmotionPack] = React.useState("")
  const [emotion_packs, setEmotionPacks] = React.useState([])

  const addNewUser = async () => {
    if (name && email && location && emotion_packs.length) {
      let sendData = { name, email, location, emotion_packs }
      await api.post('/users/add', sendData)
    } else {
      alert("Please check the inputs below.")
    }
    closeModal()
  }

  const handleEmotionPacks = (emotion_pack) => {
    let temp = [...emotion_packs]
    temp.push(emotion_pack)
    setEmotionPacks(temp)
  }

  const closeModal = () => {
    setName("")
    setEmail("")
    setLocation("")
    setEmotionPacks([])
    props.setShowModalCreate(false)
  }

  return (
    <>
      <Modal
        className="modal modal-primary"
        show={props.showModalCreate}
        onHide={() => closeModal()}
      >
        <Modal.Header className="justify-content-center">
          <p>Create New User</p>
        </Modal.Header>
        <Modal.Body className="text-center">
          <Row>
            <Col md="6">
              <FormLabel><b>Name</b></FormLabel>
              <Form.Group>
                <Form.Control
                  type="text"
                  placeholder="Input"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md="6">
              <FormLabel><b>Email</b></FormLabel>
              <Form.Group>
                <Form.Control
                  type="email"
                  placeholder="Input"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md="6">
              <FormLabel><b>Location</b></FormLabel>
              <Form.Group>
                <Form.Control
                  type="text"
                  placeholder="Input"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md="6">
              <FormLabel><b>Emotion Pack</b></FormLabel>
              <Form.Group>
                <Form.Control
                  placeholder="Input"
                  as="select"
                  value={emotion_pack}
                  onChange={e => handleEmotionPacks(e.target.value)}
                >
                  <option value="">Choose Category...</option>
                  {props.emotionPacks.length ? props.emotionPacks.map((each, i) => (
                    <option key={i} value={each._id}>{each.name}</option>
                  )) : null}
                </Form.Control>
              </Form.Group>
              {emotion_packs.map((each, i) => 
                <span>{(props.emotionPacks.find(e => e._id === each)).name},</span>
              )}
            </Col>
          </Row>
        </Modal.Body>
        <div className="modal-footer">
          <Button
            className="btn-simple"
            type="button"
            variant="link"
            onClick={() => addNewUser()}
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
  )
}

export default UserCreateModal
