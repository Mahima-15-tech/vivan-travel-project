import React, { useState, useEffect } from 'react';
import { post } from "../../../API/apiHelper";
import { support_add } from "../../../API/endpoints";
import '../contact-form/contact-form.css';
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import CircularProgressBar from "../../../component/Loading";

const ContactUs = () => {
    const [loading, SetLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        try {
            SetLoading(true);
            const response = post(
                support_add, formData,
                true
            );
            SetLoading(false);
            toast.success('Request submit successfully');
            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: '',
                message: ''
            });
        } catch (error) {
            console.error("Error adding data:", error);
        }
    };

    return (
      <>
        <div className="contact-us p-60">
          <div className="container">
            <div className="row">
              <div className="col-lg-8 offset-lg-2">
                <form onSubmit={handleSubmit} className="contact-form">
                  <div className="row">
                    <div className="col-sm-6 mb-24">
                      <input
                        type="text"
                        name="name"
                        className="form-control"
                        id="f-name"
                        placeholder="Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-sm-6 mb-24">
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        id="mail"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-sm-6 mb-24">
                      <input
                        type="tel"
                        name="phone"
                        className="form-control"
                        id="p_number"
                        placeholder="Mobile Number"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-sm-6 mb-24">
                      <input
                        type="text"
                        name="subject"
                        className="form-control"
                        id="subj"
                        placeholder="Subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-sm-12 mb-24">
                      <textarea
                        name="message"
                        className="form-control"
                        id="comment"
                        cols="30"
                        rows="10"
                        placeholder="Message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                      ></textarea>
                    </div>
                  </div>
                  <div className="d-flex justify-content-end">
                    {loading ? (
                      <CircularProgressBar />
                    ) : (
                      <button type="submit" className="cus-btn">
                        Send Message
                      </button>
                    )}

                    <div id="message" className="alert-msg"></div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <section className="contact-us mb-5">
          <div className="container-fluid">
            {/* <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3572.052133952777!2d74.6319895!3d26.454048399999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396be795602114b1%3A0x3f81a4f2c8d66db9!2sVivan%20Travels%20%26%20Tourism!5e0!3m2!1sen!2sin!4v1734945521472!5m2!1sen!2sin"
              width="600"
              height="450"
              style="border:0;"
              allowfullscreen=""
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            ></iframe> */}
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3572.052133952777!2d74.6319895!3d26.454048399999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396be795602114b1%3A0x3f81a4f2c8d66db9!2sVivan%20Travels%20%26%20Tourism!5e0!3m2!1sen!2sin!4v1734945521472!5m2!1sen!2sin"
              allowfullscreen
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </section>
      </>
    );
};

export default ContactUs;
