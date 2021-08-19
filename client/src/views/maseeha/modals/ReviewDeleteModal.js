import React from "react";
import { Badge, Button, Card, Navbar, Nav, Table, Container, Row, Col, Modal, Form, InputGroup, FormLabel } from "react-bootstrap";

function ReviewDeleteModal(props) {
  return (
    <Modal
      className="modal-mini modal-primary"
      show={props.showModalDelete}
      onHide={() => props.setShowModalDelete(false)}
    >
      <Modal.Header className="justify-content-center">
        <p>Delete Review</p>
      </Modal.Header>
      <div className="modal-footer">
        <Button
          className="btn-simple"
          type="button"
          variant="danger"
          onClick={() => props.deleteReview()}
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

export default ReviewDeleteModal;
