import React from "react"
import { Badge, Button, Card, Navbar, Nav, Table, Container, Row, Col, Modal, Form, InputGroup, FormLabel } from "react-bootstrap"
import api from 'utils/api'
import Switch from "react-switch"
import ReactStars from "react-rating-stars-component"
import MeditationAudioCreateModal from "./modals/MeditationAudioCreateModal"
import MeditationAudioUpdateModal from "./modals/MeditationAudioUpdateModal"
import MeditationAudioDeleteModal from "./modals/MeditationAudioDeleteModal"
import { apiUrl, filepath, imagePathForCsvUpload, mAudioPathForCsvUpload } from "./config"
import { CSVLink } from 'react-csv'
import { Importer, ImporterField } from 'react-csv-importer';
import 'react-csv-importer/dist/index.css';
// axios.defaults.baseURL = apiUrl

function MeditationAudioManagement() {
  React.useEffect(async () => {
    await getMeditationAudios()
    await getEmotionPacks()
  }, [])

  const [meditationAudios, setMeditationAudios] = React.useState([])
  const [emotionPacks, setEmotionPacks] = React.useState([])
  const [showModalCreate, setShowModalCreate] = React.useState(false)
  const [showModalUpdate, setShowModalUpdate] = React.useState(false)
  const [showModalDelete, setShowModalDelete] = React.useState(false)
  const [meditationAudioForUpdate, setMeditationAudioForUpdate] = React.useState(null)
  const [downloadDate, setDownloadDate] = React.useState(`Meditation Audios_${(new Date()).toLocaleDateString()}_${(new Date()).toLocaleTimeString()}.csv`)
  const [downloadData, setDownloadData] = React.useState([])
  const [showCSVImport, setShowCSVImport] = React.useState("none")

  const getUpdateModal = (meditationAudio) => {
    setMeditationAudioForUpdate(meditationAudio)
    setShowModalUpdate(true)
  }

  const getMeditationAudios = async () => {
    let meditationAudiosFromDB = (await api.get('/meditationaudio')).data
    let downloadDataTemp = []
    for (let i = 0; i < meditationAudiosFromDB.length; i++) {
      let tempMeditationAudio = meditationAudiosFromDB[i]
      let avgrating = 0
      if (tempMeditationAudio.ratings.length) {
        let ratings = tempMeditationAudio.ratings
        for (let j = 0; j < ratings.length; j++) {
          avgrating += ratings[j]
        }
        avgrating = avgrating / ratings.length
      }
      tempMeditationAudio.avgrating = avgrating

      var destinationObject = {}
      destinationObject["No"] = i + 1
      destinationObject["Name"] = tempMeditationAudio["name"]
      destinationObject["Author"] = tempMeditationAudio["author"]
      destinationObject["Purpose"] = tempMeditationAudio["purpose"]
      destinationObject["Description"] = tempMeditationAudio["description"]
      destinationObject["Duration"] = tempMeditationAudio["duration"]
      let tempRatings = ''
      for (let j = 0; j < tempMeditationAudio["ratings"].length; j++) {
        tempRatings += tempMeditationAudio["ratings"][j]
        if (tempMeditationAudio["ratings"][j + 1]) tempRatings += ","
      }
      destinationObject["Ratings"] = tempRatings
      destinationObject["Listened Times"] = tempMeditationAudio["listen_counts"]
      let tempTags = ''
      for (let j = 0; j < tempMeditationAudio["tags"].length; j++) {
        tempTags += tempMeditationAudio["tags"][j]
        if (tempMeditationAudio["tags"][j + 1]) tempTags += ","
      }
      destinationObject["Tags"] = tempTags
      destinationObject["Featured"] = tempMeditationAudio["featured"]
      destinationObject["Type"] = tempMeditationAudio["type"]
      destinationObject["Price"] = tempMeditationAudio["price"]
      destinationObject["Thumb Image"] = tempMeditationAudio["thumbimage"]
      destinationObject["Image"] = tempMeditationAudio["image"]
      destinationObject["Audio File"] = tempMeditationAudio["audiofile"]
      // destinationObject["Status"] = tempMeditationAudio["status"]
      downloadDataTemp.push(destinationObject)
    }
    setDownloadData(downloadDataTemp)
    setMeditationAudios(meditationAudiosFromDB)
  }

  const getEmotionPacks = async () => {
    setEmotionPacks((await api.get("/emotion_packs")).data)
  }

  const uploadCSVdata = async (dataForUpload) => {
    await axios.post('/api/meditationaudio/csv', {
      imagePath: imagePathForCsvUpload + dataForUpload["Image"],
      image: dataForUpload["Image"],
      thumbimagePath: imagePathForCsvUpload + dataForUpload["Thumb Image"],
      thumbimage: dataForUpload["Thumb Image"],
      audioPath: mAudioPathForCsvUpload + dataForUpload["Audio File"],
      audiofile: dataForUpload["Audio File"],
      name: dataForUpload["Name"],
      author: dataForUpload["Author"],
      purpose: dataForUpload["Purpose"],
      description: dataForUpload["Description"],
      avgrating: dataForUpload["Ratings"].split(','),
      listen_counts: dataForUpload["Listened Times"],
      tags: dataForUpload["Tags"],
      featured: dataForUpload["Featured"] ? dataForUpload["Featured"] : false,
      type: dataForUpload["Type"],
      price: dataForUpload["Price"],
    })
    await getMeditationAudios()
  }

  return (
    <>
      <Container fluid>
        <Row>
          <Col md="12">
            <Card className="card-plain table-plain-bg">
              <Card.Header>
                <Card.Title as="h4">Meditation Audio Management</Card.Title>
                <p className="card-category">
                  Manage Meditation Audio
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
                      onClick={() => setDownloadDate(`Meditation Audios_${(new Date()).toLocaleDateString()}_${(new Date()).toLocaleTimeString()}.csv`)}
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
                    <ImporterField name="Name" label="Name" />
                    <ImporterField name="Author" label="Author" />
                    <ImporterField name="Purpose" label="Purpose" />
                    <ImporterField name="Description" label="Description" />
                    <ImporterField name="Duration" label="Duration" />
                    <ImporterField name="Ratings" label="Ratings" />
                    <ImporterField name="Listened Times" label="Listened Times" />
                    <ImporterField name="Tags" label="Tags" />
                    <ImporterField name="Featured" label="Featured" />
                    <ImporterField name="Type" label="Type" />
                    <ImporterField name="Price" label="Price" />
                    <ImporterField name="Thumb Image" label="Thumb Image" />
                    <ImporterField name="Image" label="Image" />
                    <ImporterField name="Audio File" label="Audio File" />
                    {/* <ImporterField name="Status" label="Status" /> */}
                  </Importer>
                </div>
              </Card.Header>
              <Card.Body className="table-full-width table-responsive px-0">
                <Table className="table-hover">
                  <thead>
                    <tr>
                      <th className="border-0">No</th>
                      <th className="border-0">Name</th>
                      <th className="border-0">Author</th>
                      <th className="border-0">Purpose</th>
                      <th className="border-0">Description</th>
                      <th className="border-0">Duration</th>
                      <th className="border-0">Avg Rating</th>
                      <th className="border-0">Listened Times</th>
                      <th className="border-0">tags</th>
                      <th className="border-0">Featured</th>
                      <th className="border-0">Type</th>
                      <th className="border-0">Price</th>
                      <th className="border-0">Thumb Image</th>
                      <th className="border-0">Image</th>
                      <th className="border-0">Audio File</th>
                      <th className="border-0">Status</th>
                      <th className="border-0">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {meditationAudios.map((each, i) => (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{each.name}</td>
                        <td>{each.author}</td>
                        <td>{each.purpose}</td>
                        <td>{each.description}</td>
                        <td>{Math.floor(each.duration / 60) + "m " + each.duration % 60 + "s"}</td>
                        <td>
                          <ReactStars
                            value={each.avgrating}
                            isHalf={true}
                            edit={false}
                          />
                        </td>
                        <td>{each.listen_counts}</td>
                        <td>
                          {each.tags.map((each, i) => (
                            <span key={i}>{each},</span>
                          ))}
                        </td>
                        <td>{each.featured ? "Featured" : "Not"}</td>
                        <td>{each.type}</td>
                        <td>₹ {each.price}</td>
                        <td><img src={filepath + each.thumbimage} height="50px" alt="no image" /></td>
                        <td><img src={filepath + each.image} height="50px" alt="no image" /></td>
                        <td>
                          <audio controls>
                            <source src={filepath + each.audiofile} type="audio/mpeg" />
                              Your browser does not support the audio element.
                          </audio>
                        </td>
                        <td><Switch onChange={e => console.log(each.status)} checked={each.status ? each.status : false} /></td>
                        <td>
                          <Button
                            className="btn-fill"
                            variant="info"
                            size="sm"
                            onClick={() => getUpdateModal(each)}
                          >
                            <i className="nc-icon nc-settings-gear-64" />
                          </Button>
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
        <MeditationAudioCreateModal 
          showModalCreate={showModalCreate}
          setShowModalCreate={setShowModalCreate}
          emotionPacks={emotionPacks}
          setMeditationAudios={setMeditationAudios}
          getMeditationAudios={getMeditationAudios}
        />
        <MeditationAudioUpdateModal
          showModalUpdate={showModalUpdate}
          setShowModalUpdate={setShowModalUpdate}
          meditationAudioForUpdate={meditationAudioForUpdate}
          emotionPacks={emotionPacks}
          setMeditationAudios={setMeditationAudios}
          getMeditationAudios={getMeditationAudios}
        />
        <MeditationAudioDeleteModal
          showModalDelete={showModalDelete}
          setShowModalDelete={setShowModalDelete}
          setMeditationAudios={setMeditationAudios}
          getMeditationAudios={getMeditationAudios}
        />
      </Container>
    </>
  )
}

export default MeditationAudioManagement