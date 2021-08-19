import React from "react";
import { Badge, Button, Card, Navbar, Nav, Table, Container, Row, Col, Modal, Form, InputGroup, FormLabel } from "react-bootstrap";
import api from 'utils/api';
import {apiUrl, filepath} from "../config";
// axios.defaults.baseURL = apiUrl;

function MeditationAudioDeleteModal(props) {
  const deleteMeditationAudio = async () => {
    props.setMeditationAudios((await api.delete("/meditationaudio/" + props.showModalDelete)).data);
    await props.getMeditationAudios();
    props.setShowModalDelete(false);
  }

  return (
    <Modal
      className="modal-mini modal-primary"
      show={props.showModalDelete}
      onHide={() => props.setShowModalDelete(false)}
    >
      <Modal.Header className="justify-content-center">
        <p>Delete Meditation Audio</p>
      </Modal.Header>
      <div className="modal-footer">
        <Button
          className="btn-simple"
          type="button"
          variant="danger"
          onClick={() => deleteMeditationAudio()}
        >
          Delete
        </Button>
        <Button
          className="btn-simple"
          type="button"
          variant="primary"
          onClick={() => props.setShowModalDelete(false)}
        >
          Close
        </Button>
      </div>
    </Modal>
  );
}

export default MeditationAudioDeleteModal;
