import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { FaCircle } from "react-icons/fa";
import { TbGift, TbMessageCircle, TbSettings } from "react-icons/tb";
import IncomeOverview from "./IncomeOverview";
import UniqueVisitorChart from "./UniqueVisitorChart";
import { useDispatch, useSelector } from "react-redux";
import { getLeads } from "@/modules/leads/redux/action/leadAction";
import { getUsers } from "@/modules/users/redux/action/usersAction";
import Loader from "@/components/common/loader";
import {
  addBusinessInfo,
  createBusiness,
  getUsersBusinessExist,
  verifyOtp
} from "../redux/actions/businessAction";
import {
  Modal,
  Button as BootstrapButton,
} from "react-bootstrap";
import InputFieldWithCountryCode from "@/components/common/InputFieldWithCountryCode";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { toast } from "react-toastify";

function DashboardPage() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [whatsappForOtp, setWhatsappForOtp] = useState("");
  const [isBusinessRegistered, setBusinessRegistered] = useState(false);
  const [businessId, setBusinessId] = useState("");
  const [registrationComplete, setRegistrationComplete] = useState(false);

  const { data: user, loading } = useSelector(
    (state: { profileReducer: { data: any; loading: boolean } }) =>
      state.profileReducer
  );

  const userBusinessExists = useSelector((state: any) => state.businessOnboardingReducer.exists);
  console.log("User Business Exists:", userBusinessExists);
  // Only use Redux value if registration isn't complete yet
  useEffect(() => {
    if (registrationComplete) return;
    if (userBusinessExists !== undefined) {
      setBusinessRegistered(userBusinessExists);
    }
  }, [userBusinessExists, registrationComplete]);

  // Check if user already has a business registered
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        await dispatch(getUsersBusinessExist(user.id) as any);
        // Always fetch leads and users
        await Promise.all([
          dispatch(getLeads({ page: 1, limit: 1, search: "", sort: "", order: "" }) as any),
          dispatch(getUsers({ page: 1, pageSize: 1, search: "", sort: "createdAt", order: "DESC" }) as any),
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) {
      fetchData();
    }
  }, [dispatch, user?.id]);

  const handleFirstModalSubmit = async (values, { setSubmitting }) => {
    try {
      // Clean WhatsApp number: remove all non-digit characters
      const cleanedWhatsappNumber = values.whatsappNumber.replace(/\D/g, "");
      const payload = {
        user_id: user?.id,
        whatsapp_number: cleanedWhatsappNumber,
        business_name: values.businessName,
      };

      const response = await dispatch(createBusiness(payload) as any).unwrap();
      console.log("Business Registration Response:", response, response.data.data.businessId);

      setBusinessId(response.data.data.businessId);
      console.log("Business ID:", response.data.data.businessId);

      if (response.data.status === 200 || response?.statusCode === 200) {
        setWhatsappForOtp(values.whatsappNumber);
        setShowModal(false);
        setShowOtpModal(true);
      } else {
        console.log('response.error:---', response.error);
        return toast.error(response.error?.message || "Failed to send OTP");
      }
    } catch (error) {
      console.error("Error in handleFirstModalSubmit:", error);
      toast.error(error.message || "Failed to register business. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleOtpVerification = async () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length !== 4) {
      toast.error("Please enter a valid 4-digit OTP.");
      return;
    }

    try {
      await dispatch(verifyOtp({ businessId, otp: enteredOtp }) as any).unwrap();
      toast.success("OTP Verified Successfully!");

      // Reset OTP input fields
      setOtp(["", "", "", ""]);

      // Move to next step
      setShowOtpModal(false);
      setShowDetailsModal(true);
    } catch (error: any) {
      console.error("OTP Verification Failed:", error);
      toast.error(error?.message || "Invalid or expired OTP. Please try again.");
    }
  };

  if (loading || isLoading) {
    return <Loader />;
  }

  return (
    <>
      {!isBusinessRegistered ? (
        <>
          {/* Message + Button Section */}
          <div className="dashboard-top-card p-4 bg-light d-flex justify-content-between align-items-center">
            <p className="mb-0">
              <strong>Register your business to get started</strong>
            </p>
            <BootstrapButton variant="success" onClick={() => setShowModal(true)}>
              Add Business
            </BootstrapButton>
          </div>

          {/* Modal 1: Register Business */}
          <Modal show={showModal} onHide={() => setShowModal(false)} centered>
            <Modal.Header closeButton>
              <Modal.Title>Register your Business</Modal.Title>
            </Modal.Header>
            <Formik
              initialValues={{
                businessName: "",
                whatsappNumber: "",
              }}
              validationSchema={Yup.object({
                businessName: Yup.string().required("Business name is required"),
                whatsappNumber: Yup.string()
                  .required("Phone is required")
                  .matches(/^\+?[0-9]{10,}$/, "Phone number is not valid")
                  .min(12, "Phone number too short")
                  .max(15, "Phone number is too long"),
              })}
              onSubmit={handleFirstModalSubmit}
            >
              {({ handleSubmit }) => (
                <Form onSubmit={handleSubmit}>
                  <Modal.Body>
                    <h5>
                      Enter your Business Name and WhatsApp Business number to sign in or create a new account
                    </h5>
                    <div className="mb-3">
                      <label className="form-label">Business Name</label>
                      <Field
                        name="businessName"
                        className="form-control"
                        placeholder="Enter your business name"
                      />
                      <ErrorMessage
                        name="businessName"
                        component="div"
                        className="text-danger"
                      />
                    </div>
                    <InputFieldWithCountryCode
                      label="Enter your WhatsApp Business number"
                      name="whatsappNumber"
                      placeholder="Enter WhatsApp number"
                      className="country-code-select-with-number leads-country-code"
                      required
                    />
                    <i>You’ll receive a 4-digit code on this number</i>
                    <div className="mt-3 d-flex justify-content-center">
                      <BootstrapButton type="submit" variant="outline-success" className="mt-3">
                        Send OTP
                      </BootstrapButton>
                    </div>
                  </Modal.Body>
                </Form>
              )}
            </Formik>
          </Modal>

          {/* Modal 2: OTP Entry */}
          <Modal
            show={showOtpModal}
            onHide={() => setShowOtpModal(false)}
            centered
            onExited={() => setOtp(["", "", "", ""])}
          >
            <Modal.Header closeButton>
              <Modal.Title>Enter OTP</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p className="text-left mb-3">
                Enter the 4-digit OTP sent to <strong>{whatsappForOtp}</strong>
              </p>
              <div className="d-flex justify-content-center gap-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*$/.test(value)) {
                        const newOtp = [...otp];
                        newOtp[index] = value;
                        setOtp(newOtp);
                        // Auto-focus next input
                        if (value && index < otp.length - 1) {
                          document.getElementById(`otp-${index + 1}`)?.focus();
                        }
                      }
                    }}
                    className="form-control text-center"
                    style={{ width: "40px", fontSize: "1.5rem" }}
                  />
                ))}
              </div>
              <div className="mt-4 d-flex justify-content-center">
                <BootstrapButton
                  variant="success"
                  className="px-5"
                  onClick={handleOtpVerification}
                >
                  Continue
                </BootstrapButton>
              </div>
            </Modal.Body>
          </Modal>

          {/* Modal 3: Business Info */}
          <Modal
            show={showDetailsModal}
            onHide={() => setShowDetailsModal(false)}
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>Get Premium</Modal.Title>
            </Modal.Header>
            <Formik
              initialValues={{
                industry: "",
                businessWebsite: "",
              }}
              validationSchema={Yup.object({
                industry: Yup.string().required("Industry is required"),
                businessWebsite: Yup.string()
                  .url("Invalid URL format")
                  .nullable()
                  .notRequired(),
              })}
              onSubmit={async (values, { setSubmitting }) => {
                try {
                  const resultAction = await dispatch(
                    addBusinessInfo({
                      businessId: businessId,
                      industry: values.industry,
                      website: values.businessWebsite || undefined,
                    }) as any
                  );

                  if (addBusinessInfo.fulfilled.match(resultAction)) {
                    toast.success("Business info submitted successfully!");
                    setShowDetailsModal(false);
                    setShowWelcomeModal(true);
                  } else {
                    throw new Error(resultAction?.payload || "Failed to submit business info");
                  }
                } catch (error: any) {
                  toast.error(error.message || "Something went wrong. Please try again.");
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({ handleSubmit }) => (
                <Form onSubmit={handleSubmit}>
                  <Modal.Body>
                    <h5 className="mb-3">Business Info</h5>
                    <div className="mb-3">
                      <label className="form-label">What industry are you in?</label>
                      <Field
                        name="industry"
                        className="form-control"
                        placeholder="e.g., Retail, Technology, Education"
                      />
                      <ErrorMessage
                        name="industry"
                        component="div"
                        className="text-danger"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Business Website URL (Optional)</label>
                      <Field
                        name="businessWebsite"
                        type="text"
                        className="form-control"
                        placeholder="https://example.com"
                      />
                      <ErrorMessage
                        name="businessWebsite"
                        component="div"
                        className="text-danger"
                      />
                    </div>
                  </Modal.Body>
                  <Modal.Footer>
                    <BootstrapButton type="submit" variant="success">
                      Submit
                    </BootstrapButton>
                  </Modal.Footer>
                </Form>
              )}
            </Formik>
          </Modal>

          {/* Modal 4: Welcome Message */}
          <Modal
            show={showWelcomeModal}
            onHide={() => setShowWelcomeModal(false)}
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>Welcome Message</Modal.Title>
            </Modal.Header>
            <Formik
              initialValues={{
                welcomeMessage: "👋 Welcome to Pixalane! How can we help you today?",
              }}
              validationSchema={Yup.object({
                welcomeMessage: Yup.string().required("Welcome message is required"),
              })}
              onSubmit={async (values, { setSubmitting }) => {
                try {
                  const resultAction = await dispatch(
                    addBusinessInfo({
                      businessId: businessId,
                      welcome_message: values.welcomeMessage,
                    }) as any
                  );

                  if (addBusinessInfo.fulfilled.match(resultAction)) {
                    toast.success("Welcome message saved successfully!");
                    setShowWelcomeModal(false);

                    // Now mark business as fully registered
                    setBusinessRegistered(true);
                    setRegistrationComplete(true);
                  } else {
                    throw new Error(resultAction.payload || "Failed to save welcome message");
                  }
                } catch (error: any) {
                  toast.error(error.message || "Something went wrong. Please try again.");
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({ handleSubmit }) => (
                <Form onSubmit={handleSubmit}>
                  <Modal.Body>
                    <div className="mb-3">
                      <label className="form-label">Type your welcome message</label>
                      <Field
                        as="textarea"
                        name="welcomeMessage"
                        className="form-control"
                        rows={3}
                        placeholder="👋 Welcome to Pixalane! How can we help you today?"
                      />
                      <ErrorMessage name="welcomeMessage" component="div" className="text-danger" />
                    </div>
                  </Modal.Body>
                  <Modal.Footer>
                    <BootstrapButton type="submit" variant="primary">
                      Save & Continue
                    </BootstrapButton>
                  </Modal.Footer>
                </Form>
              )}
            </Formik>
          </Modal>
        </>
      ) : (
        <>
          {/* Dashboard Cards */}
          <div className="homepage">
            <div className="dashboard-top-card">
              <div className="row">
                <div className="col-md-6 col-xl-3">
                  <div className="card">
                    <div className="card-body">
                      <h6 className="mb-2 f-w-400 text-muted">Total Leads Generated</h6>
                      <h4 className="mb-3">0</h4>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-xl-3">
                  <div className="card">
                    <div className="card-body">
                      <h6 className="mb-2 f-w-400 text-muted">Total Users</h6>
                      <h4 className="mb-3">0</h4>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-xl-3">
                  <div className="card">
                    <div className="card-body">
                      <h6 className="mb-2 f-w-400 text-muted">Total Order</h6>
                      <h4 className="mb-3">0</h4>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-xl-3">
                  <div className="card">
                    <div className="card-body">
                      <h6 className="mb-2 f-w-400 text-muted">Total Sales</h6>
                      <h4 className="mb-3">0</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="visitor-graph-container">
              <div className="row">
                <UniqueVisitorChart />
                <IncomeOverview />
              </div>
            </div>
            <div className="salery-report-and-transition-history">
              <div className="row">
                <div className="col-md-12 col-xl-4">
                  <div className="transition-history-sec">
                    <h5 className="mb-3">Transaction History</h5>
                    <div className="card">
                      <div className="list-group list-group-flush">
                        <a href="#" className="list-group-item list-group-item-action">
                          <div className="d-flex">
                            <div className="flex-shrink-0">
                              <div className="avtar avtar-s rounded-circle text-success bg-light-success">
                                <TbGift className="f-18" />
                              </div>
                            </div>
                            <div className="flex-grow-1 ms-3">
                              <h6 className="mb-1">Lorem ipsum dolor sit.</h6>
                              <p className="mb-0 text-muted">Lorem ipsum dolor sit.</p>
                            </div>
                            <div className="flex-shrink-0 text-end">
                              <h6 className="mb-1">000</h6>
                              <p className="mb-0 text-muted">0%</p>
                            </div>
                          </div>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default DashboardPage;