import React, { useState, useEffect } from "react";
import { post } from "../../API/apiHelper";
import { toast, ToastContainer } from "react-toastify";
import { send_notification } from "../../API/endpoints";
import CircularProgressBar from "../Component/Loading";
import { Form, FormGroup, FormControl, FormLabel, Button } from 'react-bootstrap';
import notification from "../../Assets/Images/notification.png";
import Select from 'react-select';
import { user_list_other } from "../../API/endpoints";

function SendNotificationPage() {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        message: "",
        sendToType: "multiple", // Set default to multiple users
        userId: "",
    });

    const [userOptions, setUserOptions] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await post(send_notification, formData, true);
            if (response.ok) {
                toast.success("Notification sent successfully");
            } else {
                toast.error("Failed to send notification");
            }
        } catch (error) {
            console.error('Error sending notification:', error);
            toast.error("Failed to send notification");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setLoading(true);
        const fetchUsers = async () => {
            try {
                const res = await post(user_list_other, true);
                const response = await res.json();
                const options = response.data.map(user => ({
                    value: user.id,
                    label: user.name // Adjust based on your API response
                }));
                setUserOptions(options);
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
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
                <div className="mb-4 pb-2">
                    <h6 className="h1 mb-0 text-capitalize d-flex align-items-center gap-2">
                        <img src={notification} alt="" width="30" />
                        Send Notifications
                    </h6>
                </div>

                <div className="row">
                    <div className="col-12 mr-5 mb-5">
                        <div className="card">
                            <div className="border-bottom px-4 py-3">
                                <h5 className="mb-0 text-capitalize d-flex align-items-center gap-2">
                                    Send Notification
                                </h5>
                            </div>
                            <div className="card-body">
                                {loading ? (
                                    <CircularProgressBar />
                                ) : (
                                    <Form onSubmit={handleSubmit}>

                                        <FormGroup>
                                            <FormLabel>Send To</FormLabel>
                                            <FormControl
                                                as="select"
                                                name="sendToType"
                                                value={formData.sendToType}
                                                onChange={handleChange}
                                            >
                                                <option value="single">By User</option>
                                                <option value="multiple">All Users</option>
                                            </FormControl>
                                        </FormGroup>

                                        {formData.sendToType === 'single' && (
                                            <FormGroup>
                                                <FormLabel>User ID</FormLabel>
                                                <Select
                                                    options={userOptions}
                                                    value={userOptions.find(option => option.value === formData.userId)}
                                                    onChange={selectedOption =>
                                                        handleChange({ target: { name: 'userId', value: selectedOption.value } })
                                                    }
                                                    placeholder="Select a User ID"
                                                    isSearchable
                                                />
                                            </FormGroup>
                                        )}

                                        <FormGroup>
                                            <FormLabel>Message</FormLabel>
                                            <FormControl
                                                as="textarea"
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                placeholder="Enter notification message"
                                                rows={4}
                                            />
                                        </FormGroup>



                                        

                                        <Button type="submit" className="mt-3">Send Notification</Button>
                                    </Form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default SendNotificationPage;
