import React from "react";
import { Badge, Button, Card, Navbar, Nav, Table, Container, Row, Col } from "react-bootstrap";
import QuestionCreateModal from "./modals/QuestionCreateModal";
import QuestionReadModal from "./modals/QuestionReadModal";
import QuestionUpdateModal from "./modals/QuestionUpdateModal";
import QuestionDeleteModal from "./modals/QuestionDeleteModal";
import api from 'utils/api';
import {apiUrl, filepath} from "./config";
// axios.defaults.baseURL = apiUrl;

function QAmanagement() {
  const [showModalCreate, setShowModalCreate] = React.useState(false);
  const [showModalRead, setShowModalRead] = React.useState(false);
  const [showModalUpdate, setShowModalUpdate] = React.useState(false);
  const [showModalDelete, setShowModalDelete] = React.useState(false);
  const [emotionPacks, setEmotionPacks] = React.useState([]);
  const [questions, setQuestions] = React.useState([]);
  const [questionForRead, setQuestionForRead] = React.useState(null);
  const [questionForUpdate, setQuestionForUpdate] = React.useState(null);

  React.useEffect(async () => {
    setEmotionPacks((await api.get("/emotion_packs")).data);
    setQuestions((await api.get("/questions")).data);
  }, [showModalCreate, showModalDelete]);

  // console.log(questions)
  const getReadModal = (question) => {
    setQuestionForRead(question);
    setShowModalRead(true)
  }

  const getUpdateModal = (question) => {
    setQuestionForUpdate(question);
    setShowModalUpdate(true);
  }

  const deleteQuestion = async () => {
    setQuestions((await api.delete("/questions/" + showModalDelete)).data);
    setShowModalDelete(false);
  }

  return (
    <>
      <Container fluid>
        <Row>
          <Col md="12">
            <Card className="card-plain table-plain-bg">
              <Card.Header>
                <Card.Title as="h4">Question & Answer Management</Card.Title>
                <p className="card-category">
                  You can manage QA here.
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
                      <th className="border-0">Question</th>
                      <th className="border-0">SN</th>
                      <th className="border-0">Question Type</th>
                      <th className="border-0">Category</th>
                      <th className="border-0">Parent Question</th>
                      <th className="border-0">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {questions.map((each, i) => (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{each.question}</td>
                        <td>{each.serial_number}</td>
                        <td>{each.type}</td>
                        <td>{each.emotionpack ? each.emotionpack.name : null}</td>
                        <td>{each.parent ? each.parent.question : null}</td>
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
        <QuestionCreateModal
          showModalCreate={showModalCreate}
          setShowModalCreate={setShowModalCreate}
          emotionPacks={emotionPacks}
          questions={questions}
        />
        <QuestionReadModal 
          question={questionForRead}
          showModalRead={showModalRead}
          setShowModalRead={setShowModalRead}
        />
        <QuestionUpdateModal 
          showModalUpdate={showModalUpdate}
          setShowModalUpdate={setShowModalUpdate}
          question={questionForUpdate}
          emotionPacks={emotionPacks}
          questions={questions}
          setQuestions={setQuestions}
        />
        <QuestionDeleteModal
          showModalDelete={showModalDelete}
          setShowModalDelete={setShowModalDelete}
          deleteQuestion={deleteQuestion}
        />
      </Container>
    </>
  );
}

export default QAmanagement;
