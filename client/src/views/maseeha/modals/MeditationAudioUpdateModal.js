import React from "react"
import { Badge, Button, Card, Navbar, Nav, Table, Container, Row, Col, Modal, Form, InputGroup, FormLabel } from "react-bootstrap"
import api from 'utils/api'
import ReactStars from "react-rating-stars-component"
import Switch from "react-switch"
// import { TimeDurationInput } from 'react-time-duration-input'
import { InputTagsContainer } from 'react-input-tags'
import { apiUrl, filepath } from "../config"
// axios.defaults.baseURL = apiUrl

function MeditationAudioUpdateModal(props) {
  React.useEffect(() => {
    if (props.meditationAudioForUpdate) {
      setName(props.meditationAudioForUpdate.name)
      setAuthor(props.meditationAudioForUpdate.author)
      setPurpose(props.meditationAudioForUpdate.purpose)
      setDescription(props.meditationAudioForUpdate.description)
      // setDuration(props.meditationAudioForUpdate.duration)
      // setAvgRating(props.meditationAudioForUpdate.avgrating)
      setTags(props.meditationAudioForUpdate.tags)
      setFeatured(props.meditationAudioForUpdate.featured)
      setType(props.meditationAudioForUpdate.type)
      setPrice(props.meditationAudioForUpdate.price)
      // setEmotionPack(props.meditationAudioForUpdate.emotion_pack._id)
      setStatus(props.meditationAudioForUpdate.status)
    }
  }, [props.meditationAudioForUpdate])

  const [name, setName] = React.useState("")
  const [author, setAuthor] = React.useState("")
  const [purpose, setPurpose] = React.useState("")
  const [description, setDescription] = React.useState("")
  // const [duration, setDuration] = React.useState(61)
  const [ratings, setRatings] = React.useState([])
  const [tags, setTags] = React.useState([])
  const [featured, setFeatured] = React.useState(false)
  const [type, setType] = React.useState("")
  const [price, setPrice] = React.useState(0)
  const [audiofile, setAudioFile] = React.useState(null)
  // const [emotion_pack, setEmotionPack] = React.useState("")
  const [status, setStatus] = React.useState(false)
  const [thumbimage, setThumbImage] = React.useState(null)
  const [image, setImage] = React.useState(null)

  const handleUpdateTags = (tags) => {
    setTags([...tags])
  }

  const allClear = () => {
    // setAudioFile(null)
  }

  const closeModal = () => {
    allClear()
    props.setShowModalUpdate(false)
  }

  const updateMeditationAudio = async () => {
    let formData = new FormData()
    formData.append('audiofile', audiofile)
    formData.append('name', name)
    formData.append('author', author)
    formData.append('purpose', purpose)
    formData.append('description', description)
    // formData.append('duration', duration)
    formData.append('ratings', ratings)
    formData.append('tags', tags)
    formData.append('featured', featured)
    formData.append('type', type)
    formData.append('price', price)
    formData.append('status', status ? status : false)
    formData.append('thumbimage', thumbimage)
    formData.append('image', image)
    // formData.append('emotion_pack', emotion_pack)
    formData.append('_id', props.meditationAudioForUpdate._id)
    if (name && author && purpose) {
      props.setMeditationAudios((await api.post('/meditationaudio/update', formData)).data)
      closeModal()
      await props.getMeditationAudios()
    } else {
      alert("please input the fields")
    }
  }

  if (props.meditationAudioForUpdate)
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
                <FormLabel><b>Name</b></FormLabel>
                <Form.Group>
                  <Form.Control
                    placeholder="Input"
                    name="name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md="6">
                <FormLabel><b>Author</b></FormLabel>
                <Form.Group>
                  <Form.Control
                    placeholder="Input"
                    name="author"
                    value={author}
                    onChange={e => setAuthor(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md="6">
                <FormLabel><b>Purpose</b></FormLabel>
                <Form.Group>
                  <Form.Control
                    placeholder="Input"
                    rows="2"
                    as="textarea"
                    name="purpose"
                    value={purpose}
                    onChange={e => setPurpose(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md="6">
                <FormLabel><b>Description</b></FormLabel>
                <Form.Group>
                  <Form.Control
                    placeholder="Input"
                    rows="2"
                    as="textarea"
                    name="description"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              {/* <Col md="6">
                <FormLabel><b>Duration</b></FormLabel>
                <Form.Group>
                  <TimeDurationInput
                    className="form-control"
                    value={duration}
                    scale="s"
                    onChange={(newValue) => setDuration(newValue)}
                  />
                </Form.Group>
              </Col> */}
              <Col md="6">
                <FormLabel><b>Featured</b></FormLabel>
                <Form.Check className="mb-1 pl-0">
                  <Form.Check.Label>
                    <Form.Check.Input
                      checked={featured}
                      type="checkbox"
                      onChange={e => setFeatured(!featured)}
                    ></Form.Check.Input>
                    <span className="form-check-sign"></span>
                    {featured ? "Yes" : "No"}
                  </Form.Check.Label>
                </Form.Check>
              </Col>
            </Row>
            <Row>
              <Col md="12">
                <FormLabel><b>Tags</b></FormLabel>
                <InputTagsContainer
                  tags={tags}
                  handleUpdateTags={handleUpdateTags}
                  inputMaxWidth={100}
                />
              </Col>
            </Row>
            <Row>
              <Col md="6">
                <FormLabel><b>Type</b></FormLabel>
                <Form.Group>
                  <Form.Control
                    as="select"
                    placeholder="Input"
                    name="type"
                    value={type}
                    onChange={e => setType(e.target.value)}
                  >
                    <option value="Free">Free</option>
                    <option value="Paid">Paid</option>
                  </Form.Control>
                </Form.Group>
              </Col>
              {type === "Paid" ? (<Col md="6">
                <FormLabel><b>Price</b></FormLabel>
                <Form.Group style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>₹&nbsp;&nbsp;</span>
                  <Form.Control
                    type="number"
                    placeholder="Input"
                    name="price"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                  />
                </Form.Group>
              </Col>) : null}
            </Row>
            <Row>
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
              {/* <Col md="6">
                <FormLabel><b>Emotion Pack</b></FormLabel>
                <Form.Group>
                  <Form.Control
                    placeholder="Input"
                    as="select"
                    name="emotion_pack"
                    value={emotion_pack}
                    onChange={e => setEmotionPack(e.target.value)}
                  >
                    <option value={""}>Choose Emotion...</option>
                    {props.emotionPacks.map((each, i) => (
                      <option key={i} value={each._id}>{each.name}</option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col> */}
              <Col md="6">
                <FormLabel><b>Thumb Triangle</b></FormLabel>
                <Form.Group>
                  <Form.Control
                    type="file"
                    name="thumbimage"
                    onChange={e => setThumbImage(e.target.files[0])}
                    required
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col md="6">
                <FormLabel><b>Image</b></FormLabel>
                <Form.Group>
                  <Form.Control
                    type="file"
                    name="image"
                    onChange={e => setImage(e.target.files[0])}
                    required
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
              onClick={() => updateMeditationAudio()}
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
    )
  else
    return (
      <></>
    )
}

export default MeditationAudioUpdateModal
