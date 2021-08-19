import React from "react"
import { Badge, Button, Card, Navbar, Nav, Table, Container, Row, Col, Modal, Form, InputGroup, FormLabel } from "react-bootstrap"
import Switch from "react-switch"
import api from 'utils/api'
import ReviewCreateModal from "./modals/ReviewCreateModal"
import ReviewUpdateModal from "./modals/ReviewUpdateModal"
import ReviewDeleteModal from "./modals/ReviewDeleteModal"
import { apiUrl, filepath } from "./config"
// axios.defaults.baseURL = apiUrl

const ReviewManagement = () => {
  const [showModalCreate, setShowModalCreate] = React.useState(false)
  const [showModalDelete, setShowModalDelete] = React.useState(false)
  const [showModalUpdate, setShowModalUpdate] = React.useState(false)
  const [reviews, setReviewes] = React.useState([])
  const [users, setUsers] = React.useState([])
  const [meditationAudios, setMeditationAudios] = React.useState([])
  const [reviewForUpdate, setReviewForUpdate] = React.useState({})

  React.useEffect(async () => {
    await getAllReviewes()
    await getAllUsers()
    await getMeditationAudios();
  }, [showModalCreate, showModalDelete, showModalUpdate])

  const getAllReviewes = async () => {
    setReviewes((await api.get("/review")).data)
  }

  const getAllUsers = async () => {
    setUsers((await api.get("/users")).data)
  }

  const getMeditationAudios = async () => {
    setMeditationAudios((await api.get('/meditationaudio')).data);
  }

  const getUpdateModal = (review) => {
    setReviewForUpdate(review);
    setShowModalUpdate(true);
  }

  const deleteReview = async () => {
    let deleteAnswer = (await api.delete("/review/" + showModalDelete)).data
    if (deleteAnswer === "ok") {
      setShowModalDelete(false)
    } else {
      alert("There is en error. Try again.")
    }
  }

  return (
    <Container fluid>
      <Row>
        <Col md="12">
          <Card className="card-plain table-plain-bg">
            <Card.Header>
              <Card.Title as="h4">Review Management</Card.Title>
              <p className="card-category">
                You Can Manage Reviews Here.
                  <Button
                  className="btn-fill"
                  variant="primary"
                  style={{ "float": "right" }}
                  onClick={() => setShowModalCreate(true)}
                >
                  <i className="nc-icon nc-simple-add" />&nbsp;New
                </Button>
              </p>
            </Card.Header>
            <Card.Body className="table-full-width table-responsive px-0">
              <Table className="table-hover">
                <thead>
                  <tr>
                    <th className="border-0">No</th>
                    <th className="border-0">Date</th>
                    <th className="border-0">User</th>
                    <th className="border-0">Meditation Audio</th>
                    <th className="border-0">Review</th>
                    <th className="border-0">Show / Hide</th>
                    <th className="border-0">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map((each, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{(new Date(each.date)).toLocaleDateString()} {(new Date(each.date)).toLocaleTimeString()}</td>
                      <td>{each.user.name}</td>
                      <td>{each.meditation_audio ? each.meditation_audio.name : null}</td>
                      <td>{each.review}</td>
                      <td><Switch onChange={e => console.log(each.status)} checked={each.status} /></td>
                      <td>
                        <Button
                          className="btn-fill"
                          variant="info"
                          size="sm"
                          onClick={() => getUpdateModal(each)}
                        >
                          <i className="nc-icon nc-settings-gear-64" />
                        </Button>&nbsp;
                          <Button
                          className="btn-fill"
                          variant="danger"
                          size="sm"
                          onClick={() => setShowModalDelete(each._id)}
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
      <ReviewCreateModal
        showModalCreate={showModalCreate}
        setShowModalCreate={setShowModalCreate}
        users={users}
        meditationAudios={meditationAudios}
      />
      <ReviewUpdateModal
        showModalUpdate={showModalUpdate}
        setShowModalUpdate={setShowModalUpdate}
        review={reviewForUpdate}
        users={users}
        meditationAudios={meditationAudios}
      />
      <ReviewDeleteModal
        showModalDelete={showModalDelete}
        setShowModalDelete={setShowModalDelete}
        deleteReview={deleteReview}
      />
    </Container>
  )
}

export default ReviewManagement