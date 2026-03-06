import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { post } from "../../API/apiHelper";
import { ToastContainer, toast } from "react-toastify";
import { Modal, Button, Form } from 'react-bootstrap';
import { faq_list, faq_add, faq_category_list } from "../../API/endpoints";
import CircularProgressBar from "../Component/Loading";
import FaqTableRow from "./widget/FaqListRow";
import faqimage from "../../Assets/Images/faq.png";
import '../../Assets/css/CloseButton.css';

function Faq() {
  const navigate = useNavigate();

  useEffect(() => {
    getfaqlist();
  }, []);

  const [res, setResponce] = useState({
    status: true,
    message: "Data retrieved successfully",
    data: [],
    pagination: {
      totalUsers: 1,
      currentPage: 2,
      totalPages: 1,
      pageSize: 10,
    },
  });

  const [currentPage, setcurrentPage] = useState(1);
  const [pages, setPages] = useState([]);
  const [newFeq, setnewfeq] = useState({ selectedCategory: '', question: '', answer: '' });

  const [errors, setErrors] = useState({}); // New state for form errors

  // Function to handle page change
  const handlePageChange = (page) => {
    setcurrentPage(page);
    getfaqlist(page);
  };
  const handleSearch = () => {
    setcurrentPage(1);
    getfaqlist(1);
  };

  const handleReset = () => {
    setcurrentPage(1);
    getfaqlist(1);
  };
  const [loading, SetLoading] = useState(true);

  async function getfaqlist(page) {
    SetLoading(true);
    const response = await post(
      faq_list,
      {
        page: page,
        limit: 50,
      },
      true
    );
    const data = await response.json();

    if (response.status === 200) {
      setResponce(data);
      const totalPages = data.pagination.totalPages;
      const pagesArray = Array.from(
        { length: totalPages },
        (_, index) => index + 1
      );
      setPages(pagesArray);
      SetLoading(false);
    } else if (response.status === 403) {
      data.errors.forEach((error) => {
        toast.error(error.msg);
      });
    } else if (response.status === 401) {
      sessionStorage.setItem("authtoken", null);
      navigate("/");
      toast.error("Session Expired");
    } else {
      toast.error("Something Went Wrong");
    }
  }

  const [showCreateModal, setShowCreateModal] = useState(false);
  const handleShowCreate = () => {
    setShowCreateModal(true);
  };
  const handleCloseCreate = () => setShowCreateModal(false);

  const handleSave = async () => {
    const newErrors = {};

    // Validation checks
    if (!newFeq.selectedCategory) newErrors.selectedCategory = "Category is required";
    if (!newFeq.question) newErrors.question = "Question is required";
    if (!newFeq.answer) newErrors.answer = "Answer is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return; // Stop execution if there are validation errors
    }

    try {
      await post(
        faq_add,
        {
          category_id: newFeq.selectedCategory,
          question: newFeq.question,
          answer: newFeq.answer,
        },
        true,
      );

      toast.success('Added Successfully');
      handleCloseCreate();
      getfaqlist(currentPage); // Refetch data to show updated list
    } catch (error) {
      console.error('Error adding FAQ:', error);
      toast.error('Error adding FAQ');
    }
  };

  const [categories, setCategories] = useState([]);
  // Fetch categories when the component mounts
  useEffect(() => {
    SetLoading(true);
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
    SetLoading(false);
  }, []);

  return (
    <main id="content" role="main" className="main pointer-event">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <div className="content container-fluid">
        <div className="mb-4">
          <h6 className="h1 mb-0 text-capitalize d-flex align-items-center gap-2">
            <img
              width="30"
              src={faqimage}
              alt=""
            />
            Faq list
            <span className="badge badge-soft-dark radius-50">{res.pagination.totalUsers}</span>
          </h6>
        </div>
        <div className="card">
          <div className="p-3 flex-grow-1">
            <div className="d-flex justify-content-between gap-3 flex-wrap align-items-center">
              <div className="align-items-center d-flex gap-3 justify-content-lg-end flex-wrap flex-lg-nowrap flex-grow-1">
                <Button variant="primary" size="sm" onClick={handleShowCreate}>
                  <i className="tio-add"> ADD NEW</i>
                </Button>
                <Modal show={showCreateModal} onHide={handleCloseCreate}>
                  <Modal.Header closeButton className="customModalHeader">
                    <Modal.Title>Add FAQ</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Form>
                      <Form.Group controlId="formCategorySelect">
                        <Form.Label>Select Category</Form.Label>
                        <Form.Control
                          as="select"
                          value={newFeq.selectedCategory}
                          onChange={(e) => setnewfeq({ ...newFeq, selectedCategory: e.target.value })}
                          isInvalid={!!errors.selectedCategory} // Show error if validation fails
                        >
                          <option value="">Choose a category...</option>
                          {categories.map((category) => (
                            <option key={category.category_name} value={category.category_name}>
                              {category.category_name}
                            </option>
                          ))}
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">
                          {errors.selectedCategory}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group controlId="formQuestion">
                        <Form.Label>Question</Form.Label>
                        <Form.Control
                          as="textarea"
                          placeholder="Enter Question"
                          value={newFeq.question}
                          onChange={(e) => setnewfeq({ ...newFeq, question: e.target.value })}
                          isInvalid={!!errors.question} // Show error if validation fails
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.question}
                        </Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group controlId="formAnswer">
                        <Form.Label>Answer</Form.Label>
                        <Form.Control
                          as="textarea"
                          placeholder="Enter Answer"
                          value={newFeq.answer}
                          onChange={(e) => setnewfeq({ ...newFeq, answer: e.target.value })}
                          isInvalid={!!errors.answer} // Show error if validation fails
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.answer}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Form>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseCreate}>
                      Close
                    </Button>
                    <Button variant="primary" onClick={handleSave}>
                      Save Changes
                    </Button>
                  </Modal.Footer>
                </Modal>
              </div>
            </div>
          </div>
          <div className="table-responsive datatable-custom">
            <table className="table table-hover table-bordered table-thead-bordered  table-align-middle card-table w-100">
              <thead className="thead-light thead-50 text-capitalize">
                <tr>
                  <th className="text-center">SL</th>
                  <th className="text-center">Category</th>
                  <th className="text-center">Question</th>
                  <th className="text-center">Answer</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              {loading ? (<CircularProgressBar />) : (<tbody>
                {res.data.map((faq, index) => (
                  <FaqTableRow
                    key={index}
                    faq={faq}
                    onUpdate={getfaqlist} />
                ))}
              </tbody>)}
            </table>
          </div>
          <div className="table-responsive mt-4">
            <div className="px-4 d-flex justify-content-lg-end">
              <nav className="pagination">
                <ul className="pagination">
                  <li
                    className={`page-item ${currentPage === 1 ? "disabled" : ""
                      }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      ‹
                    </button>
                  </li>
                  {pages.map((page) => (
                    <li
                      key={page}
                      className={`page-item ${page === currentPage ? "active" : ""
                        }`}
                      aria-current={page === currentPage ? "page" : null}
                    >
                      {page === currentPage ? (
                        <span className="page-link">{page}</span>
                      ) : (
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </button>
                      )}
                    </li>
                  ))}
                  <li
                    className={`page-item ${currentPage === res.pagination.totalPages
                      ? "disabled"
                      : ""
                      }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(currentPage + 1)}
                    >
                      ›
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
          {/* <Pagination /> */}
        </div>
      </div>
    </main>
  );
}

export default Faq;
