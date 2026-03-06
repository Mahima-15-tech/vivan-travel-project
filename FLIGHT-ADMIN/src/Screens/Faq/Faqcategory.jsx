import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { post, get } from "../../API/apiHelper";
import { ToastContainer, toast } from "react-toastify";
import FaqcatTableRow from "./Widget/FaqcateTableRow";
import { Modal, Button, Form } from 'react-bootstrap';
import { faq_category_list, add_faq_category, siteconfig } from "../../API/endpoints";
import CircularProgressBar from "../Component/Loading";
import faqimage from "../../Assets/Images/faq.png";
import '../../Assets/css/CloseButton.css';

function Faqcategory() {
  const navigate = useNavigate();

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
  const [newCategory, setNewCategory] = useState({ category_name: '' });
  const [settings, setSettings] = useState(null);
  const [loading, SetLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Fetch settings data on mount
  useEffect(() => {
    const fetchSettings = async () => {
      SetLoading(true);
      try {
        const response = await get(siteconfig, true);
        const data = await response.json();
        setSettings(data.data);
      } catch (error) {
        toast.error("Failed to fetch settings");
      } finally {
        SetLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Fetch FAQ categories
  useEffect(() => {
    if (settings) {
      getfaqcatlist(currentPage);
    }
  }, [settings, currentPage]);

  async function getfaqcatlist(page) {
    if (!settings) {
      return;
    }

    SetLoading(true);
    try {
      const response = await post(
        faq_category_list,
        {
          page: page,
          limit: settings.par_page_limit, // Use limit from settings
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
      } else if (response.status === 403) {
        data.errors.forEach((error) => {
          toast.error(error.msg);
        });
      } else if (response.status === 401) {
        sessionStorage.setItem("authtoken", null);
        navigate("/");
        toast.error("Session Expire");
      } else {
        toast.error("Something Went Wrong");
      }
    } catch (error) {
      console.error("Error fetching FAQ categories:", error);
    } finally {
      SetLoading(false);
    }
  }

  const handlePageChange = (page) => {
    setcurrentPage(page);
    getfaqcatlist(page);
  };

  const handleSearch = () => {
    setcurrentPage(1);
    getfaqcatlist(1);
  };

  const handleReset = () => {
    setcurrentPage(1);
    getfaqcatlist(1);
  };

  const handleShowCreate = () => setShowCreateModal(true);
  const handleCloseCreate = () => setShowCreateModal(false);

  const handleSave = async () => {
    try {
      await post(
        add_faq_category,
        {
          category_name: newCategory.category_name,
        },
        true,
      );
      toast.success('Added Successfully');
      handleCloseCreate();
      getfaqcatlist(currentPage); // Refetch data to show updated list
    } catch (error) {
      toast.error('Failed to add category');
    }
  };

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
            <img width="30" src={faqimage} alt="" />
            FAQ Category List
            <span className="badge badge-soft-dark radius-50">{res.pagination.totalUsers}</span>
          </h6>
        </div>
        <div className="card">
          <div className="p-3 flex-grow-1">
            <div className="d-flex justify-content-between gap-3 flex-wrap align-items-center">
              <div className="align-items-center d-flex gap-3 justify-content-lg-end flex-wrap flex-lg-nowrap flex-grow-1">
                <Button variant="primary" size="sm" onClick={handleShowCreate}>
                  <i className="tio-add">ADD NEW</i>
                </Button>
                <Modal show={showCreateModal} onHide={handleCloseCreate}>
                  <Modal.Header closeButton className="customModalHeader">
                    <Modal.Title>Add Category</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Form>
                      <Form.Group controlId="formCategoryName">
                        <Form.Label>Category Name</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter category name"
                          value={newCategory.category_name}
                          onChange={(e) => setNewCategory({ category_name: e.target.value })}
                        />
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
            <table className="table table-hover table-bordered table-thead-bordered table-align-middle card-table w-100">
              <thead className="thead-light thead-50 text-capitalize">
                <tr>
                  <th className="text-center">SL</th>
                  <th className="text-center">Category Name</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              {loading ? (
                <CircularProgressBar />
              ) : (
                <tbody>
                  {res.data.map((category, index) => (
                    <FaqcatTableRow
                      key={index}
                      category={category}
                      onUpdate={getfaqcatlist}
                    />
                  ))}
                </tbody>
              )}
            </table>
          </div>
          <div className="table-responsive mt-4">
            <div className="px-4 d-flex justify-content-lg-end">
              <nav className="pagination">
                <ul className="pagination">
                  <li
                    className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
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
                      className={`page-item ${page === currentPage ? "active" : ""}`}
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
                    className={`page-item ${currentPage === res.pagination.totalPages ? "disabled" : ""}`}
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
        </div>
      </div>
    </main>
  );
}

export default Faqcategory;
