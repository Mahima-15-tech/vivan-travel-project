import React, { useState } from "react";
import { Modal, Button, Form } from 'react-bootstrap';
import { IMAGE_BASE_URL } from "../../../API/endpoints";
import { post, del } from '../../../API/apiHelper';
import { language_add, language_delete } from '../../../API/endpoints';
import { toast } from 'react-toastify';
import '../../../Assets/css/CloseButton.css';

const LanguageTableRow = ({ language, onUpdate }) => {
  const imageUrl = language.icon ? `${IMAGE_BASE_URL}${language.icon}` : null;


  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [modalData, setModalData] = useState({ name: '', id: '', icon: '' });

  const handleShowEdit = () => {
    setModalData({ name: language.name, id: language.id, icon: imageUrl });
    setShowEditModal(true);
  };
  const handleCloseEdit = () => setShowEditModal(false);

  const handleShowDelete = () => {
    setModalData({ id: language.id });
    setShowDeleteModal(true);
  };
  const handleCloseDelete = () => setShowDeleteModal(false);

  const handleSave = async () => {
    try {
      await post(
        language_add,
        {
          id: modalData.id,
          name: modalData.name,
          folder: 'language',
          icon: modalData.icon,
        },
        true
      );
      toast.success('Update Successfully');
      handleCloseEdit();
      onUpdate(); // Call the onUpdate callback to refresh data
    } catch (error) {
      toast.error('Update Failed');
    }
  };

  const handleDelete = async () => {
    try {
      await del(
        language_delete,
        {
          id: modalData.id,
        },
        true
      );
      toast.success('Deleted Successfully');
      handleCloseDelete();
      onUpdate(); // Call the onUpdate callback to refresh data
    } catch (error) {
      toast.error('Delete Failed');
    }
  };

  return (
    <>
      <tr>
        <td className="text-center">{language.id}</td>
        <td className="text-center">{language.name || "-"}</td>
        <td className="text-center">
          {language.icon ? (
            <img src={imageUrl} alt={language.name} style={{ width: "50px", height: "50px", objectFit: "cover", objectPosition: "center" }} />
          ) : (
            "-"
          )}
        </td>
        <td>
          <div className="d-flex justify-content-center gap-2">
            <Button variant="outline-info" size="sm" onClick={handleShowEdit}>
              <i className="tio-edit"></i>
            </Button>
            <Button variant="outline-danger" size="sm" onClick={handleShowDelete}>
              <i className="tio-delete"></i>
            </Button>
          </div>
        </td>
      </tr>

      <Modal show={showEditModal} onHide={handleCloseEdit}>
        <Modal.Header closeButton className="customModalHeader">
          <Modal.Title>Edit Language</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formCategoryName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Language name"
                value={modalData.name}
                onChange={(e) => setModalData({ ...modalData, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formCategoryImage">
              <Form.Label>Icon</Form.Label>
              <Form.Control
                type="file"
                // accept=".svg" // Restrict to only SVG files
                onChange={(e) => {
                  const file = e.target.files[0];
                  setModalData({ ...modalData, icon: file });
                }}
              />
            </Form.Group>

          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEdit}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDeleteModal} onHide={handleCloseDelete}>
        <Modal.Header closeButton className="customModalHeader">
          <Modal.Title>Delete Language</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this Language ?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDelete}>
            Close
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default LanguageTableRow;
