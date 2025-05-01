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
import CustomDatePicker from "@/components/common/DatePicker";
import { getConstantType, postLeads } from "../../redux/action/leadAction";

const LeadsForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    tag: "",
    status: "",
    source: "",
    notes: "",
    last_contacted: null,
  });
  const [tagOptions, setTagOptions] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [sourceOptions, setSourceOptions] = useState([]);
  
  const dispatch = useDispatch<any>();

  useEffect(() => {
    const fetchConstants = async () => {
      try {
        const response = await dispatch(getConstantType()).unwrap();
        const data = response?.data || []; 
        

  
        const tags = data.constantType
          .filter((item) => item.type === "tag")
          .map((item) => ({ label: item.label, value: item.id }));
  
        const statuses = data.constantType
          .filter((item) => item.type === "status")
          .map((item) => ({ label: item.label, value: item.id }));
  
        const sources = data.constantType
          .filter((item) => item.type === "source")
          .map((item) => ({ label: item.label, value: item.id }));
  
        setTagOptions(tags);
        setStatusOptions(statuses);
        setSourceOptions(sources);
      } catch (err) {
        console.error("Failed to load constants", err);
        toast.error("Failed to load select field data");
      }
    };
  
    fetchConstants();
  }, [dispatch]);
  

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    phone: Yup.string()
      .matches(/^[0-9]+$/, "Only numbers allowed")
      .min(10, "Phone number too short")
      .required("Phone is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    tag: Yup.string().required("Tag is required"),
    status: Yup.string().required("Status is required"),
    source: Yup.string().required("Source is required"),
    notes: Yup.string(),
    last_contacted: Yup.date().nullable(),
  });

  const handleSubmit = async () => {
    const { name, phone, email, tag, status, source, notes, last_contacted } =
      formData;
    const payload = {
      name,
      phone,
      email,
      tag,
      status,
      source,
      notes,
      last_contacted: last_contacted ? last_contacted : null,
    };

    console.log("object", payload);

    try {
      const response = await dispatch(postLeads(payload)).unwrap();
      console.log("Response:", response);
      if (response.statusCode === 200) {
        toast.success(response.message || "Lead posted successfully");
        setFormData({
          name: "",
          phone: "",
          email: "",
          tag: "",
          status: "",
          source: "",
          notes: "",
          last_contacted: null,
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(error?.message || "Error submitting form. Please try again.");
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

        <Formik
          initialValues={formData}
          enableReinitialize
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {() => (
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
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </Col>
                  <Col md={6}>
                    <InputField
                      label="Phone"
                      name="phone"
                      id="phone"
                      placeholder="Enter Phone"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                  </Col>
                  <Col md={6}>
                    <InputField
                      label="Email"
                      name="email"
                      id="email"
                      type="email"
                      placeholder="Enter Email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </Col>
                </Row>
              </div>

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
                      value={formData.tag}
                      onChange={(e) =>
                        setFormData({ ...formData, tag: e.target.value })
                      }
                    />
                  </Col>
                  <Col md={6}>
                    <SelectField
                      name="status"
                      label="Select Status"
                      required
                      options={statusOptions}
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                    />
                  </Col>
                  <Col md={6}>
                    <SelectField
                      name="source"
                      label="Select Source"
                      required
                      options={sourceOptions}
                      value={formData.source}
                      onChange={(e) =>
                        setFormData({ ...formData, source: e.target.value })
                      }
                    />
                  </Col>
                </Row>
              </div>

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
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData({ ...formData, notes: e.target.value })
                      }
                    />
                  </Col>
                  <Col md={12}>
                    <InputField
                      label="Last Contacted"
                      name="last_contacted"
                      id="last_contacted"
                      type="datetime-local"
                      value={formData.last_contacted}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          last_contacted: e.target.value,
                        })
                      }
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
