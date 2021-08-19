import React from "react"
import { Badge, Button, Card, Navbar, Nav, Table, Container, Row, Col, Modal, Form, InputGroup, FormLabel } from "react-bootstrap"
import api from 'utils/api'
import Switch from "react-switch"
import { apiUrl, filepath } from "../config"
// axios.defaults.baseURL = apiUrl

function ReviewCreateModal(props) {
  const [user, setUser] = React.useState("")
  const [meditation_audio, setMeditationAudio] = React.useState("")
  const [review, setReview] = React.useState("")
  const [status, setStatus] = React.useState(false)

  const addNewReview = async () => {
    if (user && meditation_audio && review) {
      let sendData = { user, meditation_audio, review, status }
      await api.post('/review/add', sendData)
    } else {
      alert("Please check the inputs below.")
    }
    closeModal()
  }

  const closeModal = () => {
    setUser("")
    setMeditationAudio("")
    setReview("")
    setStatus(false)
    props.setShowModalCreate(false)
  }

  return (
    <Modal
      className="modal modal-primary"
      show={props.showModalCreate}
      onHide={() => closeModal()}
    >
      <Modal.Header className="justify-content-center">
        <p>Create New Review</p>
      </Modal.Header>
      <Modal.Body className="text-center">
        <Row>
          <Col md="6">
            <FormLabel><b>User</b></FormLabel>
            <Form.Control
              as="select"
              placeholder="Input"
              name="type"
              value={user}
              onChange={e => setUser(e.target.value)}
            >
              <option value="">Choose User...</option>
              {props.users.map((each, i) =>
                <option value={each._id} key={i}>{each.name}</option>
              )}
            </Form.Control>
          </Col>
          <Col md="6">
            <FormLabel><b>Meditation Audio</b></FormLabel>
            <Form.Control
              as="select"
              placeholder="Input"
              name="type"
              value={meditation_audio}
              onChange={e => setMeditationAudio(e.target.value)}
            >
              <option value="">Choose Audio...</option>
              {props.meditationAudios.map((each, i) =>
                <option value={each._id} key={i}>{each.name}</option>
              )}
            </Form.Control>
          </Col>
          <Col md="6">
            <FormLabel><b>Review</b></FormLabel>
            <Form.Group>
              <Form.Control
                placeholder="Input"
                rows="2"
                as="textarea"
                name="purpose"
                value={review}
                onChange={e => setReview(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md="6" style={{ display: "flex", justifyContent: "space-between" }}>
            <FormLabel><b>Status</b></FormLabel>
            <Switch onChange={e => setStatus(!status)} checked={status} />
          </Col>
        </Row>
      </Modal.Body>
      <div className="modal-footer">
        <Button
          className="btn-simple"
          type="button"
          variant="link"
          onClick={() => addNewReview()}
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
  )
}

export default ReviewCreateModal
