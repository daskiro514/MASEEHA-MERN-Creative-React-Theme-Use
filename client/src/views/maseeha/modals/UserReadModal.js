import React from "react";
import { Badge, Button, Card, Navbar, Nav, Table, Container, Row, Col, Modal, Form, InputGroup, FormLabel } from "react-bootstrap";
import Moment from 'react-moment';

function UserReadModal(props) {
  const user = props.user
  if (user)
    return (
      <>
        <Modal
          className="modal modal-primary"
          show={props.showModalRead}
          onHide={() => props.setShowModalRead(false)}
        >
          <Modal.Header className="justify-content-center">
            <h4>User Info</h4>
          </Modal.Header>
          <Modal.Body className="text-center">
            <Table className="table-hover">
              <tbody>
                <tr>
                  <td>Name</td>
                  <td>{user.name}</td>
                </tr>
                <tr>
                  <td>Email</td>
                  <td>{user.email}</td>
                </tr>
                <tr>
                  <td>Location</td>
                  <td>{user.location}</td>
                </tr>
                <tr>
                  <td>Emotion</td>
                  <td>{user.emotion_pack ? user.emotion_pack.name : null}</td>
                </tr>
                <tr>
                  <td>Registration Date</td>
                  <td><Moment format="MM/DD/YYYY HH:mm:ss">{new Date(user.date)}</Moment></td>
                </tr>
              </tbody>
            </Table>
          </Modal.Body>
          <div className="modal-footer">
            <Button
              className="btn-simple"
              type="button"
              variant="link"
              style={{ visibility: "hidden" }}
              onClick={() => props.setShowModalRead(false)}
            >
              Close
            </Button>
            <Button
              className="btn-simple"
              type="button"
              variant="link"
              onClick={() => props.setShowModalRead(false)}
            >
              Close
            </Button>
          </div>
        </Modal>
      </>
    );
  else
    return (
      <></>
    )
}

export default UserReadModal;
