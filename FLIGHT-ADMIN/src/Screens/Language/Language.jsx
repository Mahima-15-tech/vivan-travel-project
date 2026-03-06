import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { post, get } from "../../API/apiHelper";
import { toast, ToastContainer } from "react-toastify";
import LanguageTableRow from "./Widget/LanguageTableRow";
import { Modal, Button, Form } from 'react-bootstrap';

import { language_add, language_list, siteconfig } from "../../API/endpoints";
import CircularProgressBar from "../Component/Loading";
import languageimage from "../../Assets/Images/language.png";
import '../../Assets/css/CloseButton.css';

function Language() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    if (settings) {
      getlanguagelist();
    }
  }, [settings]);

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
  const [newLanguage, setNewLanguage] = useState({ name: '', icon: '' });

  // Function to handle page change
  const handlePageChange = (page) => {
    setcurrentPage(page);
    getlanguagelist(page);
  };
  const handleSearch = () => {
    setcurrentPage(1);
    getlanguagelist(1);
  };

  const handleReset = () => {
    setcurrentPage(1);
    getlanguagelist(1);
  };
  const [loading, SetLoading] = useState(true);

  // Fetch settings data on mount
  useEffect(() => {
    const fetchSettings = async () => {
      SetLoading(true);
      try {
        const res = await get(siteconfig, true);
        const response = await res.json();
        setSettings(response.data);
      } catch (error) {
        toast.error("Failed to fetch settings");
      } finally {
        SetLoading(false);
      }
    };

    fetchSettings();
  }, []);

  async function getlanguagelist(page) {
    if (!settings) {
      return;
    }

    SetLoading(true);
    const response = await post(
      language_list,
      {
        page: page,
        limit: settings.par_page_limit,
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
      toast.error("Session Expire");
    } else {
      toast.error("Somthing Went Wrong");
    }
  }

  const [showCreateModal, setShowCreateModal] = useState(false);
  const handleShowCreate = () => {
    setShowCreateModal(true);
  };
  const handleCloseCreate = () => setShowCreateModal(false);
  const handleSave = async () => {
    await post(
      language_add,
      {
        name: newLanguage.name,
        folder: 'language',
        icon: newLanguage.icon,
      },
      true,
    );

    toast.success('Add Successfully');
    handleCloseCreate();
    getlanguagelist(currentPage); // Refetch data to show updated list
  };

  return (
    <main id="content" role="main" class="main pointer-event">
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
              src={languageimage}
              alt=""
            />
            Language list
            <span className="badge badge-soft-dark radius-50">{res.pagination.totallist}</span>
          </h6>
        </div>
        <div className="card">
          <div class="p-3 flex-grow-1">
            <div class="d-flex justify-content-between gap-3 flex-wrap align-items-center">

              <div class="align-items-center d-flex gap-3 justify-content-lg-end flex-wrap flex-lg-nowrap flex-grow-1">
                <div class="">
                  <Button variant="primary" size="sm" onClick={handleShowCreate}>
                    <i className="tio-add"> ADD NEW</i>
                  </Button>
                  <Modal show={showCreateModal} onHide={handleCloseCreate}>
                    <Modal.Header closeButton className="customModalHeader">
                      <Modal.Title>Add Language</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <Form>
                        <Form.Group controlId="formCategoryName">
                          <Form.Label>Language Name</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter label name"
                            value={newLanguage.name}
                            onChange={(e) => setNewLanguage({ ...newLanguage, name: e.target.value })}
                          />
                        </Form.Group>
                        <Form.Group controlId="formCategoryImage">
                          <Form.Label>Image</Form.Label>
                          <Form.Control
                            type="file"
                            onChange={(e) => setNewLanguage({ ...newLanguage, icon: e.target.files[0] })}
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
          </div>
          <div className="table-responsive datatable-custom">
            <table className="table table-hover table-borderless table-thead-bordered table-nowrap table-align-middle card-table w-100">
              <thead className="thead-light thead-50 text-capitalize">
                <tr>
                  <th className="text-center">SL</th>
                  <th className="text-center">NAME</th>
                  <th className="text-center">ICON</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              {loading ? (<CircularProgressBar />) : (<tbody>
                {res.data.map((language, index) => (
                  <LanguageTableRow
                    key={index}
                    language={language}
                    onUpdate={getlanguagelist} />
                ))}
              </tbody>)}
            </table>
          </div>
          <div class="table-responsive mt-4">
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

export default Language;
