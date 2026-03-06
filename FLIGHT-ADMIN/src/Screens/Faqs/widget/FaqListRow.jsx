import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { post, del } from '../../../API/apiHelper';
import { faq_add, faq_delete, faq_category_list } from '../../../API/endpoints';
import { toast } from 'react-toastify';
import '../../../Assets/css/CloseButton.css';

const FaqListRow = ({ faq, onUpdate }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [modalData, setModalData] = useState({ id: '', selectedCategory: '', question: '', answer: '' });
  const [errors, setErrors] = useState({ selectedCategory: false, question: false, answer: false });

  const handleShowEdit = () => {
    setModalData({ id: faq.id, selectedCategory: faq.category_id, question: faq.question, answer: faq.answer });
    setShowEditModal(true);
  };

  const handleCloseEdit = () => setShowEditModal(false);

  const handleShowDelete = () => {
    setModalData({ category_id: faq.id });
    setShowDeleteModal(true);
  };

  const handleCloseDelete = () => setShowDeleteModal(false);

  const validateForm = () => {
    const newErrors = {
      selectedCategory: !modalData.selectedCategory,
      question: !modalData.question,
      answer: !modalData.answer,
    };
    setErrors(newErrors);
    return !Object.values(newErrors).includes(true);
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error('All fields are required.');
      return;
    }

    await post(
      faq_add,
      {
        id: modalData.id,
        question: modalData.question,
        answer: modalData.answer,
        category_id: modalData.selectedCategory,
      },
      true
    );
    toast.success('Updated Successfully');
    handleCloseEdit();
    onUpdate(); // Call the onUpdate callback to refresh data
  };

  const handleDelete = async () => {
    try {
      await del(
        faq_delete,
        {
          id: modalData.category_id,
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

  const [categories, setCategories] = useState([]);
  // Fetch categories when the component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await post(
          faq_category_list,
          {
            page: 1,
            limit: 1000,
          },
          true
        );
        const response = await res.json();
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <>
      <tr>
        <td className="text-center">{faq.id}</td>
        <td className="text-center">{faq.category_id || '-'}</td>
        <td className="text-center">{faq.question || '-'}</td>
        <td className="text-center">{faq.answer || '-'}</td>
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
          <Modal.Title>Update Faq</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formCategorySelect">
              <Form.Label>Select Category</Form.Label>
              <Form.Control
                as="select"
                value={modalData.selectedCategory}
                onChange={(e) => setModalData({ ...modalData, selectedCategory: e.target.value })}
                isInvalid={errors.selectedCategory}
                required
              >
                <option value="">Choose a category...</option>
                {categories.map((category) => (
                  <option key={category.category_name} value={category.category_name}>
                    {category.category_name}
                  </option>
                ))}
              </Form.Control>
              {errors.selectedCategory && <Form.Control.Feedback type="invalid">Category is required</Form.Control.Feedback>}
            </Form.Group>

            <Form.Group controlId="formQuestion">
              <Form.Label>Question</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Enter Question"
                value={modalData.question}
                onChange={(e) => setModalData({ ...modalData, question: e.target.value })}
                isInvalid={errors.question}
                required
              />
              {errors.question && <Form.Control.Feedback type="invalid">Question is required</Form.Control.Feedback>}
            </Form.Group>
            <Form.Group controlId="formAnswer">
              <Form.Label>Answer</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Enter Answer"
                value={modalData.answer}
                onChange={(e) => setModalData({ ...modalData, answer: e.target.value })}
                isInvalid={errors.answer}
                required
              />
              {errors.answer && <Form.Control.Feedback type="invalid">Answer is required</Form.Control.Feedback>}
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
          Are you sure you want to delete this Faq?
          <Form>
            <Form.Group controlId="formCategoryName">
              <Form.Control
                type="hidden"
                placeholder="Category id"
                value={modalData.id}
                onChange={(e) => setModalData({ ...modalData, id: e.target.value })}
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

export default FaqListRow;
