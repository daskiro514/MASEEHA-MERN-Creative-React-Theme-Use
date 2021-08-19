import React from "react";
import { Badge, Button, Card, Navbar, Nav, Table, Container, Row, Col, Modal, Form, InputGroup, FormLabel } from "react-bootstrap";
import api from 'utils/api';
import {apiUrl, filepath} from "../config";
// axios.defaults.baseURL = apiUrl;

function EmotionAudioDeleteModal(props) {
  const deleteEmotionAudio = async () => {
    props.setEmotionAudios((await api.delete("/emotionaudio/" + props.showModalDelete)).data);
    props.setShowModalDelete(false);
  }

  return (
    <Modal
      className="modal-mini modal-primary"
      show={props.showModalDelete}
      onHide={() => props.setShowModalDelete(false)}
    >
      <Modal.Header className="justify-content-center">
        <p>Delete Emotion Audio</p>
      </Modal.Header>
      <div className="modal-footer">
        <Button
          className="btn-simple"
          type="button"
          variant="danger"
          onClick={() => deleteEmotionAudio()}
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

export default EmotionAudioDeleteModal;
