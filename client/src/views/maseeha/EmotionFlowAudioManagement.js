import React from "react"
import { Badge, Button, Card, Navbar, Nav, Table, Container, Row, Col, Modal, Form, InputGroup, FormLabel } from "react-bootstrap"
import api from 'utils/api'
import EmotionAudioCreateModal from "./modals/EmotionAudioCreateModal"
import EmotionAudioUpdateModal from "./modals/EmotionAudioUpdateModal"
import EmotionAudioDeleteModal from "./modals/EmotionAudioDeleteModal"
import { apiUrl, filepath, imagePathForCsvUpload, eAudioPathForCsvUpload } from "./config"
import { CSVLink } from 'react-csv'
import { Importer, ImporterField } from 'react-csv-importer';
import 'react-csv-importer/dist/index.css';
// axios.defaults.baseURL = apiUrl

function EmotionFlowAudioManagement() {
  const [emotionAudios, setEmotionAudios] = React.useState([])
  const [emotionPacks, setEmotionPacks] = React.useState([])
  const [questions, setQuestions] = React.useState([])
  const [showModalCreate, setShowModalCreate] = React.useState(false)
  const [showModalUpdate, setShowModalUpdate] = React.useState(false)
  const [showModalDelete, setShowModalDelete] = React.useState(false)
  const [emotionAudioForUpdate, setEmotionAudioForUpdate] = React.useState(null)
  const [downloadDate, setDownloadDate] = React.useState(`Emtion Audios_${(new Date()).toLocaleDateString()}_${(new Date()).toLocaleTimeString()}.csv`)
  const [downloadData, setDownloadData] = React.useState([])
  const [showCSVImport, setShowCSVImport] = React.useState("none")

  React.useEffect(async () => {
    await getEmotionAudios()
    setEmotionPacks((await api.get("/emotion_packs")).data)
    setQuestions((await api.get('/questions')).data)
  }, [])

  const getEmotionAudios = async () => {
    let emtionAudiosFromDB = (await api.get('/emotionaudio')).data
    setEmotionAudios(emtionAudiosFromDB)
    let downloadDataTemp = []
    emtionAudiosFromDB.forEach((item, i) => {
      var destinationObject = {}
      destinationObject["No"] = i + 1
      destinationObject["Title"] = item["title"]
      destinationObject["Composer"] = item["composername"]
      destinationObject["Image"] = item["image"] ? item["image"] : ""
      destinationObject["Audio File"] = item["audiofile"]
      destinationObject["Duration"] = item["duration"]
      destinationObject["Emotion"] = item["emotion_pack"] ? item["emotion_pack"].name : ""
      destinationObject["Question"] = item["question"] ? item["question"].question : ""
      destinationObject["Answer"] = item["answer"] ? item["answer"].answer : ""
      downloadDataTemp.push(destinationObject);
    });
    setDownloadData(downloadDataTemp)
  }

  const getUpdateModal = (emotionAudio) => {
    setEmotionAudioForUpdate(emotionAudio)
    setShowModalUpdate(true)
  }

  const uploadCSVdata = async (dataForUpload) => {
    await axios.post('/api/emotionaudio/csv', {
      imagePath: imagePathForCsvUpload + dataForUpload["Image"],
      image: dataForUpload["Image"],
      audioPath: eAudioPathForCsvUpload + dataForUpload["Audio File"],
      audiofile: dataForUpload["Audio File"],
      title: dataForUpload["Title"],
      composername: dataForUpload["Composer"],
      emotionpackContent: dataForUpload["Emotion"],
      questionContent: dataForUpload["Question"],
      answerContent: dataForUpload["Answer"]
    })
    await getEmotionAudios()
  }

  return (
    <>
      <Container fluid>
        <Row>
          <Col md="12">
            <Card className="card-plain table-plain-bg">
              <Card.Header>
                <Card.Title as="h4">Emotion Flow Audio Management</Card.Title>
                <p className="card-category">
                  Manage Emotion Flow
                  <Button
                    className="btn-fill"
                    variant="primary"
                    style={{ "float": "right", "marginLeft": "10px" }}
                    onClick={() => setShowModalCreate(true)}
                  >
                    <i className="nc-icon nc-simple-add" />&nbsp;
                    New
                  </Button>
                  <Button
                    className="btn-fill"
                    variant="success"
                    style={{ "float": "right", "marginLeft": "10px" }}
                  >
                    <CSVLink
                      filename={downloadDate}
                      data={downloadData}
                      onClick={() => setDownloadDate(`Emtion Audios_${(new Date()).toLocaleDateString()}_${(new Date()).toLocaleTimeString()}.csv`)}
                      className="btn-fill"
                      variant="success"
                      style={{ "color": "white" }}
                    >
                      <i className="nc-icon nc-cloud-download-93" />&nbsp;
                      CSV
                    </CSVLink>
                  </Button>
                  <Button
                    className="btn-fill"
                    variant="warning"
                    style={{ "float": "right", "marginLeft": "10px" }}
                    onClick={() => showCSVImport === "none" ? setShowCSVImport("block") : setShowCSVImport("none")}
                  >
                    <i className="nc-icon nc-cloud-upload-94" />&nbsp;
                    CSV
                  </Button>
                </p>
                <div style={{ display: showCSVImport }}>
                  <Importer
                    restartable={true}
                    processChunk={async (rows, { startIndex }) => {
                      for (let i = 0; i < rows.length; i++) {
                        await uploadCSVdata(rows[i])
                      }
                      setShowCSVImport("none")
                    }}
                  >
                    <ImporterField name="No" label="No" />
                    <ImporterField name="Title" label="Title" />
                    <ImporterField name="Composer" label="Composer" />
                    <ImporterField name="Image" label="Image" />
                    <ImporterField name="Audio File" label="Audio File" />
                    <ImporterField name="Duration" label="Duration" />
                    <ImporterField name="Emotion" label="Emotion" />
                    <ImporterField name="Question" label="Question" />
                    <ImporterField name="Answer" label="Answer" />
                  </Importer>
                </div>
              </Card.Header>
              <Card.Body className="table-full-width table-responsive px-0">
                <Table className="table-hover">
                  <thead>
                    <tr>
                      <th className="border-0">No</th>
                      <th className="border-0">Title</th>
                      <th className="border-0">Composer</th>
                      <th className="border-0">Image</th>
                      <th className="border-0">Audio File</th>
                      <th className="border-0">Duration</th>
                      <th className="border-0">Emotion</th>
                      <th className="border-0">Question</th>
                      <th className="border-0">Answer</th>
                      <th className="border-0">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {emotionAudios.map((each, i) => (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{each.title}</td>
                        <td>{each.composername}</td>
                        <td><img src={filepath + each.image} height="50px" alt="no image" /></td>
                        <td>
                          <audio controls>
                            <source src={filepath + each.audiofile} type="audio/mpeg" />
                              Your browser does not support the audio element.
                          </audio>
                        </td>
                        <td>{Math.floor(each.duration / 60) + "m " + each.duration % 60 + "s"}</td>
                        <td>{each.emotion_pack ? each.emotion_pack.name : null}</td>
                        <td>{each.question ? each.question.question : null}</td>
                        <td>{each.answer ? each.answer.answer : null}</td>
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
        <EmotionAudioCreateModal
          showModalCreate={showModalCreate}
          setShowModalCreate={setShowModalCreate}
          emotionPacks={emotionPacks}
          questions={questions}
          setEmotionAudios={setEmotionAudios}
        />
        <EmotionAudioUpdateModal
          showModalUpdate={showModalUpdate}
          setShowModalUpdate={setShowModalUpdate}
          emotionAudioForUpdate={emotionAudioForUpdate}
          emotionPacks={emotionPacks}
          questions={questions}
          setEmotionAudios={setEmotionAudios}
        />
        <EmotionAudioDeleteModal
          showModalDelete={showModalDelete}
          setShowModalDelete={setShowModalDelete}
          setEmotionAudios={setEmotionAudios}
        />
      </Container>
    </>
  )
}

export default EmotionFlowAudioManagement