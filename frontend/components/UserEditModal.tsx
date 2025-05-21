import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { updateProfileByAdmin } from "@/modules/users/redux/action/usersAction";

interface UserEditModalProps {
    show: boolean;
    onClose: () => void;
    user: any;
    onSave: () => void;
    setNotification: (notification: {
        show: boolean;
        title: string;
        message: string;
        type: "success" | "error";
    }) => void;
}

const UserEditModal: React.FC<UserEditModalProps> = ({
    show,
    onClose,
    user,
    onSave,
    setNotification
}) => {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const role = useSelector((state: any) => state.authReducer.role);

    useEffect(() => {
        if (user) {
            setFormData({
                fullName: user.fullName || "",
                email: user.email || "",
                phone: user.phone || "",
            });
        }
    }, [user]);

    const dispatch = useDispatch<any>();

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        if (!user?.id) return;
        setLoading(true);
        setError("");

        try {
            await dispatch(
                updateProfileByAdmin({
                    userId: user.id,
                    updateData: formData,
                    userRole: role,
                })
            ).unwrap();


            setNotification({
                show: true,
                title: "Success",
                message: "User updated successfully",
                type: "success",
            });

            onSave();
            onClose();
        } catch (err: any) {
            setError(err.message || "Failed to update user");

            toast.error(err.message || "Failed to update user", {
                toastId: "user-edit-error",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Edit User</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <div className="alert alert-danger">{error}</div>}
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Full Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Phone</Form.Label>
                        <Form.Control
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose} disabled={loading}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleSave} disabled={loading}>
                    {loading ? "Saving..." : "Save Changes"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default UserEditModal;