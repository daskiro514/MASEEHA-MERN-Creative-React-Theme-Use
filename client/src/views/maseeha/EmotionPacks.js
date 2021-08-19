import React from "react"
import { Badge, Button, Card, Navbar, Nav, Table, Container, Row, Col, Modal, Form, InputGroup, FormLabel } from "react-bootstrap"
import api from 'utils/api'
import Switch from "react-switch"
import { apiUrl, filepath } from "./config"
// axios.defaults.baseURL = apiUrl

function EmotionPacks() {
  const [emotionPacks, setEmotionPacks] = React.useState([])
  const [showModalCreate, setShowModalCreate] = React.useState(false)
  const [showModalEdit, setShowModalEdit] = React.useState(false)
  const [showModalDeleteConfirm, setShowModalDeleteConfirm] = React.useState(false)
  const [formData, setFormData] = React.useState({
    name: '',
    type: 'Free',
    price: 0,
    description: '',
  })
  const { name, type, price, description } = formData
  const [thumbimage, setThumbImage] = React.useState(null)
  const [image, setImage] = React.useState(null)
  const [status, setStatus] = React.useState(false)

  const changeThumbImage = e => {
    setThumbImage(e.target.files[0])
  }

  const changeImage = e => {
    setImage(e.target.files[0])
  }

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value })

  const addNewEmotionPack = async () => {
    let formData1 = new FormData()
    formData1.append('thumbimage', thumbimage)
    formData1.append('image', image)
    formData1.append('name', name)
    formData1.append('type', type)
    formData1.append('price', price)
    formData1.append('status', status)
    formData1.append('description', description)
    if (name && type && price >= 0 && description && thumbimage && image) {
      const res = await api.post("/emotion_packs/add", formData1)
      setEmotionPacks(res.data)
      allClear()
      setShowModalCreate(false)
    } else {
      alert("Please Input The Values")
    }
  }

  const editEmotionPackModal = (emotionID) => {
    setShowModalEdit(true)
    let temp = emotionPacks.find(element => element._id === emotionID)
    setFormData(temp)
    setStatus(temp.status)
  }

  const updateEmotionPack = async () => {
    if (name && type && price >= 0 && description) {
      let formData1 = new FormData()
      formData1.append('image', image)
      formData1.append('thumbimage', thumbimage)
      formData1.append('name', name)
      formData1.append('type', type)
      formData1.append('price', price)
      formData1.append('status', status)
      formData1.append('description', description)
      formData1.append('_id', formData._id)
      const res = await api.post("/emotion_packs/update", formData1)
      setEmotionPacks(res.data)
      allClear()
      setShowModalEdit(false)
    } else {
      alert("Please Input The Values")
    }
  }

  const deleteEmotionModal = (emotionID) => {
    setShowModalDeleteConfirm(true)
    let temp = emotionPacks.find(element => element._id === emotionID)
    setFormData(temp)
  }

  const deleteEmotionPack = async () => {
    const res = await api.delete("/emotion_packs/" + formData._id)
    setEmotionPacks(res.data)
    allClear()
    setShowModalDeleteConfirm(false)
  }

  const closeModal = (item) => {
    if (item === "create") {
      setShowModalCreate(false)
    } else if (item === "edit") {
      setShowModalEdit(false)
    } else if (item === "delete") {
      setShowModalDeleteConfirm(false)
    }
    allClear()
  }

  const allClear = () => {
    setFormData({
      name: '',
      type: 'Free',
      price: 0,
      description: ''
    })
    setThumbImage(null)
    setImage(null)
    setStatus(false)
  }

  React.useEffect(async () => {
    setEmotionPacks(await getAllEmotionPacks())
  }, [])

  const getAllEmotionPacks = async () => {
    const res = await api.get("/emotion_packs")
    return res.data
  }

  return (
    <>
      <Container fluid>
        <Row>
          <Col md="12">
            <Card className="card-plain table-plain-bg">
              <Card.Header>
                <Card.Title as="h4">Emotion Packs</Card.Title>
                <p className="card-category">
                  Manage Emotion Packs
                  <Button
                    className="btn-fill"
                    variant="primary"
                    style={{ "float": "right" }}
                    onClick={() => setShowModalCreate(true)}
                  >
                    <i className="nc-icon nc-simple-add" />&nbsp;
                    New
                  </Button>
                </p>
              </Card.Header>
              <Card.Body className="table-full-width table-responsive px-0">
                <Table className="table-hover">
                  <thead>
                    <tr>
                      <th className="border-0">No</th>
                      <th className="border-0">Pack Name</th>
                      <th className="border-0">Pack Type</th>
                      <th className="border-0">Price</th>
                      <th className="border-0">Thumb Triangle</th>
                      <th className="border-0">Image</th>
                      <th className="border-0">Pack Details</th>
                      <th className="border-0">Status</th>
                      <th className="border-0">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {emotionPacks.map((each, i) => (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{each.name}</td>
                        <td>{each.type}</td>
                        <td>₹ {each.price}</td>
                        <td><img src={filepath + each.thumbimage} height="50px" /></td>
                        <td><img src={filepath + each.image} height="50px" /></td>
                        <td>{each.description}</td>
                        <td><Switch onChange={e => console.log(each.status)} checked={each.status} /></td>
                        <td>
                          <Button
                            className="btn-fill"
                            variant="info"
                            size="sm"
                            onClick={() => editEmotionPackModal(each._id)}
                          >
                            <i className="nc-icon nc-settings-gear-64" />
                          </Button>&nbsp;
                          <Button
                            className="btn-fill"
                            variant="danger"
                            size="sm"
                            onClick={() => deleteEmotionModal(each._id)}
                          >
                            <i className="nc-icon nc-simple-remove" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        {/* delete confirm modal */}
        <Modal
          className="modal-mini modal-primary"
          show={showModalDeleteConfirm}
          onHide={() => setShowModalDeleteConfirm(false)}
        >
          <Modal.Header className="justify-content-center">
            <p>Delete Emotion Pack</p>
          </Modal.Header>
          <div className="modal-footer">
            <Button
              className="btn-simple"
              type="button"
              variant="danger"
              onClick={() => deleteEmotionPack()}
            >
              Delete
            </Button>
            <Button
              className="btn-simple"
              type="button"
              variant="primary"
              onClick={() => closeModal("delete")}
            >
              Close
            </Button>
          </div>
        </Modal>
        {/* edit modal */}
        <Modal
          className="modal modal-primary"
          show={showModalEdit}
          onHide={() => setShowModalEdit(false)}
        >
          <Modal.Header className="justify-content-center">
            <p>Edit Emotion Pack</p>
          </Modal.Header>
          <Modal.Body className="text-center">
            <Row>
              <Col md="6">
                <FormLabel>Name</FormLabel>
                <Form.Group>
                  <Form.Control
                    type="text"
                    placeholder="Input"
                    name="name"
                    value={name}
                    onChange={onChange}
                    required />
                </Form.Group>
              </Col>
              <Col md="6">
                <FormLabel>Type</FormLabel>
                <Form.Group>
                  <Form.Control
                    type="text"
                    placeholder="Input"
                    as="select"
                    name="type"
                    value={type}
                    onChange={onChange}>
                    <option>Free</option>
                    <option>Paid</option>
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md="6">
                <FormLabel>Price</FormLabel>
                <Form.Group style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>₹&nbsp;&nbsp;</span>
                  <Form.Control
                    type="number"
                    placeholder="Input"
                    name="price"
                    value={price}
                    onChange={onChange}
                    required />
                </Form.Group>
              </Col>
              <Col md="6">
                <FormLabel>Description</FormLabel>
                <Form.Group>
                  <Form.Control
                    placeholder="Here can be your description"
                    rows="4"
                    as="textarea"
                    name="description"
                    value={description}
                    onChange={onChange}
                    required
                  ></Form.Control>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md="6">
                <FormLabel>Thumb Triangle</FormLabel>
                <Form.Group>
                  <Form.Control
                    type="file"
                    name="thumbimage"
                    onChange={changeThumbImage}
                    required
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col md="6">
                <FormLabel>Image</FormLabel>
                <Form.Group>
                  <Form.Control
                    type="file"
                    name="image"
                    onChange={changeImage}
                    required
                  ></Form.Control>
                </Form.Group>
              </Col>
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
              onClick={() => updateEmotionPack()}
            >
              Update
            </Button>
            <Button
              className="btn-simple"
              type="button"
              variant="link"
              onClick={() => closeModal("edit")}
            >
              Close
            </Button>
          </div>
        </Modal>
        {/* create modal */}
        <Modal
          className="modal modal-primary"
          show={showModalCreate}
          onHide={() => setShowModalCreate(false)}
        >
          <Modal.Header className="justify-content-center">
            <p>Create New Emotion Pack</p>
          </Modal.Header>
          <Modal.Body className="text-center">
            <Row>
              <Col md="6">
                <FormLabel>Name</FormLabel>
                <Form.Group>
                  <Form.Control
                    type="text"
                    placeholder="Input"
                    name="name"
                    value={name}
                    onChange={onChange}
                    required />
                </Form.Group>
              </Col>
              <Col md="6">
                <FormLabel>Type</FormLabel>
                <Form.Group>
                  <Form.Control
                    type="text"
                    placeholder="Input"
                    as="select"
                    name="type"
                    value={type}
                    onChange={onChange}>
                    <option>Free</option>
                    <option>Paid</option>
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md="6">
                <FormLabel>Price</FormLabel>
                <Form.Group style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>₹&nbsp;&nbsp;</span>
                  <Form.Control
                    type="number"
                    placeholder="Input"
                    name="price"
                    value={price}
                    onChange={onChange}
                    required />
                </Form.Group>
              </Col>
              <Col md="6">
                <FormLabel>Description</FormLabel>
                <Form.Group>
                  <Form.Control
                    placeholder="Here can be your description"
                    rows="4"
                    as="textarea"
                    name="description"
                    value={description}
                    onChange={onChange}
                    required
                  ></Form.Control>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md="6">
                <FormLabel>Thumb Triangle</FormLabel>
                <Form.Group>
                  <Form.Control
                    type="file"
                    name="thumbimage"
                    onChange={changeThumbImage}
                    required
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col md="6">
                <FormLabel>Image</FormLabel>
                <Form.Group>
                  <Form.Control
                    type="file"
                    name="image"
                    onChange={changeImage}
                    required
                  ></Form.Control>
                </Form.Group>
              </Col>
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
              onClick={() => addNewEmotionPack()}
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
      </Container>
    </>
  )
}

export default EmotionPacks
