'use client';
import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Col, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { FiUserPlus, FiInfo, FiTag, FiFileText, FiSend } from "react-icons/fi";
import InputField from "@/components/common/InputField";
import SelectField from "@/components/common/SelectField";
import TextAreaField from "@/components/common/TextareaField";
import Notification from "@/components/common/Notification";
import { getConstantType, postLeads } from "../../redux/action/leadAction";
import InputFieldWithCountryCode from "@/components/common/InputFieldWithCountryCode";
import { useRouter } from "next/router";

const LeadsForm = () => {
  const [tagOptions, setTagOptions] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [sourceOptions, setSourceOptions] = useState([]);
  const [notification, setNotification] = useState<{
    title: string;
    message: string;
    type: "success" | "error";
  } | null>(null);

  const dispatch = useDispatch();
  const router = useRouter();

  // Get query parameters
  const searchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const preFilledStatus = searchParams.get("status");
  const [isStatusDisabled, setIsStatusDisabled] = useState(!!preFilledStatus);

  useEffect(() => {
    const fetchConstants = async () => {
      try {
        const response = await dispatch(getConstantType() as any).unwrap();
        const constants = response?.data?.constantType?.rows || [];
        setTagOptions(
          constants
            .filter((item) => item.type === "tag")
            .map(({ label, id }) => ({ label, value: id }))
        );
        setStatusOptions(
          constants
            .filter((item) => item.type === "status")
            .map(({ label, id }) => ({ label, value: id }))
        );
        setSourceOptions(
          constants
            .filter((item) => item.type === "source")
            .map(({ label, id }) => ({ label, value: id }))
        );
      } catch (err) {
        console.error("Failed to load constants", err);
        toast.error("Failed to load select field data");
      }
    };
    fetchConstants();
  }, [dispatch]);

  // Set initial form values
  const initialValues = {
    name: "",
    phone: "",
    email: "",
    tag: "",
    status: preFilledStatus || "",
    source: "",
    notes: "",
    last_contacted: "",
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    phone: Yup.string()
      .required("Phone is required")
      .matches(/^\+?[0-9]{10,}$/, "Phone number is not valid")
      .min(12, "Phone number too short")
      .max(15, "Phone number is too long"),
    email: Yup.string()
      .required("Email is required")
      .email("Invalid email format")
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Invalid email format"
      ),
    tag: Yup.string().required("Tag is required"),
    status: Yup.string().required("Status is required"),
    source: Yup.string().required("Source is required"),
    notes: Yup.string(),
    last_contacted: Yup.date().nullable(),
  });

  const handleSubmit = async (values, { resetForm }) => {
    const tagLabel = tagOptions.find((opt) => opt.value === values.tag)?.label || "";
    const statusLabel = statusOptions.find((opt) => opt.value === values.status)?.label || "";
    const sourceLabel = sourceOptions.find((opt) => opt.value === values.source)?.label || "";

    const payload = {
      ...values,
      tag_label: tagLabel,
      status_label: statusLabel,
      source_label: sourceLabel,
      last_contacted: values.last_contacted || null,
    };

    try {
      const response = await dispatch(postLeads(payload) as any).unwrap();
      console.log("Lead created successfully:", response);
      resetForm();
      setNotification({
        title: "Success",
        message: "Lead created successfully.",
        type: "success"
      });
      router.push("/leads/leadsList");
    } catch (error: any) {
      const errorMessage = error?.message || "Failed to create lead. Please try again.";
      console.error("Submission error:", error);
      toast.error(errorMessage); // Show error via toast
    }
  };

  return (
    <div className="leads-form-container">
      <div className="leads-form-card">
        <div className="module-card-header">
          <div className="header-icon">
            <FiUserPlus size={24} />
          </div>
          <h2>Leads Form</h2>
        </div>

        {/* Notification Component */}
        {notification && (
          <Notification
            title={notification.title}
            message={notification.message}
            type={notification.type}
            position="top-right"
            onClose={() => setNotification(null)}
          />
        )}

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, handleChange, setFieldValue }) => (
            <Form>
              <div className="form-section">
                <div className="section-title">
                  <FiInfo size={18} />
                  <span>Basic Information</span>
                </div>
                <Row>
                  <Col md={6}>
                    <InputField
                      label="Name"
                      name="name"
                      id="name"
                      placeholder="Enter Name"
                      value={values.name}
                      onChange={handleChange}
                    />
                  </Col>
                  <Col md={6}>
                    <InputFieldWithCountryCode
                      label="Phone number"
                      placeholder="Enter Phone number"
                      id="phone"
                      type="text"
                      name="phone"
                      value={values.phone}
                      onChange={handleChange}
                      className="country-code-select-with-number leads-country-code"
                      required
                    />
                  </Col>
                  <Col md={6}>
                    <InputField
                      label="Email"
                      name="email"
                      id="email"
                      type="email"
                      placeholder="Enter Email"
                      value={values.email}
                      onChange={handleChange}
                    />
                  </Col>
                </Row>
              </div>

              {/* Classification */}
              <div className="form-section">
                <div className="section-title">
                  <FiTag size={18} />
                  <span>Classification</span>
                </div>
                <Row>
                  <Col md={6}>
                    <SelectField
                      name="tag"
                      label="Tag"
                      required
                      options={tagOptions}
                      value={values.tag}
                      onChange={(e) => setFieldValue("tag", e.target.value)}
                    />
                  </Col>
                  <Col md={6}>
                    <SelectField
                      name="status"
                      label="Status"
                      required
                      options={statusOptions}
                      value={values.status}
                      onChange={(e) => setFieldValue("status", e.target.value)}
                      disabled={isStatusDisabled}
                    />
                  </Col>
                  <Col md={6}>
                    <SelectField
                      name="source"
                      label="Source"
                      required
                      options={sourceOptions}
                      value={values.source}
                      onChange={(e) => setFieldValue("source", e.target.value)}
                    />
                  </Col>
                </Row>
              </div>

              {/* Additional Info */}
              <div className="form-section">
                <div className="section-title">
                  <FiFileText size={18} />
                  <span>Additional Information</span>
                </div>
                <Row>
                  <Col md={12}>
                    <TextAreaField
                      label="Notes"
                      id="notes"
                      name="notes"
                      value={values.notes}
                      onChange={handleChange}
                    />
                  </Col>
                  <Col md={12}>
                    <InputField
                      label="Last Contacted"
                      name="last_contacted"
                      id="last_contacted"
                      type="datetime-local"
                      value={values.last_contacted}
                      onChange={handleChange}
                    />
                  </Col>
                </Row>
              </div>

              <div className="form-footer">
                <button type="submit" className="login-button">
                  <FiSend size={18} />
                  <span>Submit Lead</span>
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default LeadsForm;