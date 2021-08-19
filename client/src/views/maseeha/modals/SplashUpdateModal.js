import React from "react"
import { Badge, Button, Card, Navbar, Nav, Table, Container, Row, Col, Modal, Form, InputGroup, FormLabel } from "react-bootstrap"
import api from 'utils/api'
import Switch from "react-switch"
import { apiUrl, filepath } from "../config"
// axios.defaults.baseURL = apiUrl

function SplashUpdateModal(props) {
  const weekValues = [1, 2, 3, 4, 5]
  const [week, setWeek] = React.useState(0)
  const [video, setVideo] = React.useState(null)
  const [status, setStatus] = React.useState(false)

  React.useEffect(() => {
    setWeek(props.splash.week)
    setVideo(props.splash.video)
    setStatus(props.splash.status)
  }, [props])

  const updateSplash = async () => {
    let formData = new FormData();
    formData.append('video', video);
    formData.append('week', week);
    formData.append('status', status);
    formData.append('_id', props.splash._id);
    await api.post('/splash/update', formData);
    props.setShowModalUpdate(false)
  }

  return (
    <Modal
      className="modal modal-primary"
      show={props.showModalUpdate}
      onHide={() => props.setShowModalUpdate(false)}
    >
      <Modal.Header className="justify-content-center">
        <p>Update Splash Screen</p>
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
                    if (props.splashes[i].week === element && props.splashes[i].week !== props.splash.week) return false
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
          <Col md="6" style={{ display: "flex", justifyContent: "space-between" }}>
            <FormLabel><b>Status</b></FormLabel>
            <Switch onChange={e => setStatus(!status)} checked={status ? status : false} />
          </Col>
        </Row>
      </Modal.Body>
      <div className="modal-footer">
        <Button
          className="btn-simple"
          type="button"
          variant="link"
          onClick={() => updateSplash()}
        >
          Update
        </Button>
        <Button
          className="btn-simple"
          type="button"
          variant="link"
          onClick={() => props.setShowModalUpdate(false)}
        >
          Close
        </Button>
      </div>
    </Modal>
  )
}

export default SplashUpdateModal
