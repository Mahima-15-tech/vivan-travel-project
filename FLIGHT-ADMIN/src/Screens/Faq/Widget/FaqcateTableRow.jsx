import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { post ,del} from '../../../API/apiHelper';
import { add_faq_category, faq_category_delete } from '../../../API/endpoints';
import { toast } from 'react-toastify';
import '../../../Assets/css/CloseButton.css';

const FaqcatTableRow = ({ category, onUpdate }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [modalData, setModalData] = useState({ category_name: '', category_id: '' });

  const handleShowEdit = () => {
    setModalData({ category_name: category.category_name, category_id: category.id });
    setShowEditModal(true);
  };
  const handleCloseEdit = () => setShowEditModal(false);

  const handleShowDelete = () => {
    setModalData({ category_id: category.id });
    setShowDeleteModal(true);
  }
  const handleCloseDelete = () => setShowDeleteModal(false);

  const handleSave = async () => {
    await post(
      add_faq_category,
      {
        category_name: modalData.category_name,
        id: modalData.category_id,
      },
      true
    );
    toast.success('Update Successfully');
    handleCloseEdit();
    onUpdate(); // Call the onUpdate callback to refresh data
  };

  const handleDelete = async () => {
    // Call delete API here
    // await deleteFunction(category.id);
    await del (
      faq_category_delete,
      {
        id: modalData.category_id,
      },
      true
    );
    toast.success('Deleted Successfully');
    handleCloseDelete();
    onUpdate(); // Call the onUpdate callback to refresh data
  };

  return (
    <>
      <tr>
        <td className="text-center">{category.id}</td>
        <td className="text-center">{category.category_name || '-'}</td>
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

      {/* Modal for updating category */}
      <Modal show={showEditModal} onHide={handleCloseEdit}>
        <Modal.Header closeButton className="customModalHeader">
          <Modal.Title>Update Category Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formCategoryName">
              <Form.Label>Category Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Category Name"
                value={modalData.category_name}
                onChange={(e) =>
                  setModalData({ ...modalData, category_name: e.target.value })
                }
              />
              <Form.Control
                type="hidden"
                placeholder="Category id"
                value={modalData.category_id}
                onChange={(e) =>
                  setModalData({ ...modalData, category_id: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEdit}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for delete confirmation */}
      <Modal show={showDeleteModal} onHide={handleCloseDelete}>
        <Modal.Header closeButton className="customModalHeader">
          <Modal.Title>Delete Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this category?
          <Form>
            <Form.Group controlId="formCategoryName">
              <Form.Control
                type="hidden"
                placeholder="Category id"
                value={modalData.category_id}
                onChange={(e) =>
                  setModalData({ ...modalData, category_id: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDelete}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default FaqcatTableRow;
