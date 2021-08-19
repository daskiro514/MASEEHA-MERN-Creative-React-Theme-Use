import React from "react"
import { Badge, Button, Card, Navbar, Nav, Table, Container, Row, Col, Modal, Form, InputGroup, FormLabel } from "react-bootstrap"
import api from 'utils/api'
import Switch from "react-switch"
import { apiUrl, filepath } from "../config"
// axios.defaults.baseURL = apiUrl

function ReviewUpdateModal(props) {
  const [status, setStatus] = React.useState(false)
  const [review, setReview] = React.useState("")

  React.useEffect(() => {
    setStatus(props.review.status)
    setReview(props.review.review)
  }, [props])

  const updateReview = async () => {
    let formData = {
      status: status,
      review: review,
      _id: props.review._id
    }
    await api.post('/review/update', formData)
    props.setShowModalUpdate(false)
  }

  return (
    <Modal
      className="modal modal-primary"
      show={props.showModalUpdate}
      onHide={() => props.setShowModalUpdate(false)}
    >
      <Modal.Header className="justify-content-center">
        <p>Update Review Screen</p>
      </Modal.Header>
      <Modal.Body className="text-center">
        <Row>
          <Col md="12">
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
          onClick={() => updateReview()}
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

export default ReviewUpdateModal
