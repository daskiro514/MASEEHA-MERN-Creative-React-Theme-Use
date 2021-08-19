import React from "react"
import { Badge, Button, Card, Navbar, Nav, Table, Container, Row, Col, Modal, Form, InputGroup, FormLabel } from "react-bootstrap"
import Switch from "react-switch"
import api from 'utils/api'
import { apiUrl, filepath } from "../config"
// axios.defaults.baseURL = apiUrl

function SplashCreateModal(props) {
  const weekValues = [1, 2, 3, 4, 5]
  const [week, setWeek] = React.useState(0)
  const [video, setVideo] = React.useState(null)
  const [status, setStatus] = React.useState(false)

  const addNewSplash = async () => {
    let formData = new FormData();
    formData.append('video', video);
    formData.append('week', week);
    formData.append('status', status);
    if (week && video) {
      await api.post('/splash/add', formData);
      closeModal()
    } else {
      alert("please input the fields")
    }
  }

  const closeModal = () => {
    setWeek(0)
    setVideo(null)
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
        <p>Create New Splash Screen</p>
      </Modal.Header>
      <Modal.Body className="text-center">
        <Row>
          <Col md="6">
            <FormLabel><b>Week</b></FormLabel>
            <Form.Group>
              <Form.Control
                as="select"
                value={week}
                onChange={e => setWeek(e.target.value)}
              >
                <option value={0}>Choose Week...</option>
                {weekValues.filter(element => {
                  for (let i = 0; i < props.splashes.length; i++) {
                    if (props.splashes[i].week === element) return false
                  }
                  return true
                }).map((each, i) =>
                  <option key={i} value={each}>{each}</option>
                )}
              </Form.Control>
            </Form.Group>
          </Col>
          <Col md="6">
            <FormLabel><b>Video File</b></FormLabel>
            <Form.Group>
              <Form.Control
                type="file"
                accept=".mp4, .MP4, .Mp4"
                onChange={e => setVideo(e.target.files[0])}
              ></Form.Control>
            </Form.Group>
          </Col>
          <Col md="6" style={{display: "flex", justifyContent: "space-between"}}>
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
          onClick={() => addNewSplash()}
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

export default SplashCreateModal
