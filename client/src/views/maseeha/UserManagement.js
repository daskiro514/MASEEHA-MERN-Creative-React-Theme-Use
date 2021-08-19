import React from "react"
import { Badge, Button, Card, Navbar, Nav, Table, Container, Row, Col, Modal, Form, InputGroup, FormLabel } from "react-bootstrap"
import UserCreateModal from "./modals/UserCreateModal"
import UserReadModal from "./modals/UserReadModal"
import UserDeleteModal from "./modals/UserDeleteModal"
import api from 'utils/api'
import { apiUrl, filepath } from "./config"
// axios.defaults.baseURL = apiUrl

function UserManagement() {
  const [showModalCreate, setShowModalCreate] = React.useState(false)
  const [showModalRead, setShowModalRead] = React.useState(false)
  const [showModalDelete, setShowModalDelete] = React.useState(false)
  const [users, setUsers] = React.useState([])
  const [emotionPacks, setEmotionPacks] = React.useState([])
  const [userForRead, setUserForRead] = React.useState(null)

  React.useEffect(async () => {
    await getAllUsers()
    await getEmotionPacks()
  }, [showModalCreate, showModalDelete])

  const getAllUsers = async () => {
    setUsers((await api.get("/users")).data)
  }

  const getEmotionPacks = async () => {
    setEmotionPacks((await api.get("/emotion_packs")).data)
  }

  const getReadModal = (user) => {
    setUserForRead(user)
    setShowModalRead(true)
  }

  const deleteUser = async () => {
    let deleteAnswer = (await api.delete("/users/" + showModalDelete)).data
    if (deleteAnswer === "ok") {
      setShowModalDelete(false)
    } else {
      alert("There is en error. Try again.")
    }
  }

  return (
    <>
      <Container fluid>
        <Row>
          <Col md="12">
            <Card className="card-plain table-plain-bg">
              <Card.Header>
                <Card.Title as="h4">User Management</Card.Title>
                <p className="card-category">
                  Manage Users
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
                      <th className="border-0">Name</th>
                      <th className="border-0">Email</th>
                      <th className="border-0">Location</th>
                      <th className="border-0">Subscribed Packs</th>
                      <th className="border-0">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((each, i) => (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{each.name}</td>
                        <td>{each.email}</td>
                        <td>{each.location}</td>
                        <td>
                          {each.emotion_packs.map((each, j) => 
                            <span key={j}>{each.name},</span>
                          )}
                        </td>
                        <td>
                          <Button
                            className="btn-fill"
                            variant="success"
                            size="sm"
                            onClick={() => getReadModal(each)}
                          >
                            <i className="nc-icon nc-zoom-split" />
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
        <UserCreateModal
          showModalCreate={showModalCreate}
          setShowModalCreate={setShowModalCreate}
          emotionPacks={emotionPacks}
        />
        <UserReadModal 
          user={userForRead}
          showModalRead={showModalRead}
          setShowModalRead={setShowModalRead}
        />
        <UserDeleteModal
          showModalDelete={showModalDelete}
          setShowModalDelete={setShowModalDelete}
          deleteUser={deleteUser}
        />
      </Container>
    </>
  )
}

export default UserManagement
