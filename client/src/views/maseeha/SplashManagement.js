import React from "react"
import { Badge, Button, Card, Navbar, Nav, Table, Container, Row, Col, Modal, Form, InputGroup, FormLabel } from "react-bootstrap"
import Switch from "react-switch"
import api from 'utils/api'
import SplashCreateModal from "./modals/SplashCreateModal"
import SplashUpdateModal from "./modals/SplashUpdateModal"
import SplashDeleteModal from "./modals/SplashDeleteModal"
import { apiUrl, filepath } from "./config"
// axios.defaults.baseURL = apiUrl

const SplashManagement = () => {
  const [showModalCreate, setShowModalCreate] = React.useState(false)
  const [showModalDelete, setShowModalDelete] = React.useState(false)
  const [showModalUpdate, setShowModalUpdate] = React.useState(false)
  const [splashes, setSplashes] = React.useState([])
  const [splashForUpdate, setSplashForUpdate] = React.useState({})

  React.useEffect(async () => {
    await getAllSplashes()
  }, [showModalCreate, showModalDelete, showModalUpdate])

  const getAllSplashes = async () => {
    setSplashes((await api.get("/splash")).data)
  }

  const getUpdateModal = (splash) => {
    setSplashForUpdate(splash);
    setShowModalUpdate(true);
  }

  const deleteSplash = async () => {
    let deleteAnswer = (await api.delete("/splash/" + showModalDelete)).data
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
              <Card.Title as="h4">Splash Screens</Card.Title>
              <p className="card-category">
                You Can Manage Splash Screens Here.
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
                    <th className="border-0">Week</th>
                    <th className="border-0">Video</th>
                    <th className="border-0">Status</th>
                    <th className="border-0">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {splashes.map((each, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{each.week}</td>
                      <td>{each.video}</td>
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
      <SplashCreateModal
        showModalCreate={showModalCreate}
        setShowModalCreate={setShowModalCreate}
        splashes={splashes}
      />
      <SplashUpdateModal
        showModalUpdate={showModalUpdate}
        setShowModalUpdate={setShowModalUpdate}
        splash={splashForUpdate}
        splashes={splashes}
      />
      <SplashDeleteModal
        showModalDelete={showModalDelete}
        setShowModalDelete={setShowModalDelete}
        deleteSplash={deleteSplash}
      />
    </Container>
  )
}

export default SplashManagement