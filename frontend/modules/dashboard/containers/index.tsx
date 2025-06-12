import React, { useEffect, useMemo, useState } from "react";
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
import PaymentStatusModal from "@/components/common/PaymentStatusModal";
import { getRefreshToken, getToken, setToken, getDecodedToken } from "@/utils/auth";

function DashboardPage() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [showRegisterBusinessModal, setRegisterBusinessShowModal] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [showBusinesssDetailModal, setShowBusinessDetailModal] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [whatsappForOtp, setWhatsappForOtp] = useState("");
  const [isBusinessRegistered, setBusinessRegistered] = useState(false);
  const [businessId, setBusinessId] = useState("");
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [showPaymentStatusModal, setShowPaymentStatusModal] = useState(false);


  const decodedToken = getDecodedToken() as { businessExist?: boolean } | null;
  const businessExist = decodedToken?.businessExist;

  const search = window.location.search || window.location.hash.split('?')[1] || '';

  const normalizedSearch = '?' + search.replace(/\?/g, '&');

  const params = new URLSearchParams(normalizedSearch);

  const session_id = params.get('session_id');
  const ispaymentSuccess = params.get('ispaymentSuccess');
  const ispaymentRejected = params.get('ispaymentRejected')

  const isSetUpReply = params.get('isSetUpReply');
  const isConnectBusiness = params.get('isConnectBusiness');

  const { data: user, loading } = useSelector(
    (state: { profileReducer: { data: any; loading: boolean } }) =>
      state.profileReducer
  );
  const { leads } = useSelector((state: any) => state.leadReducer);
  const userBusinessExists = useSelector((state: any) => state.businessOnboardingReducer.exists);

  useEffect(() => {
    setRegisterBusinessShowModal(!!isConnectBusiness);
    setShowWelcomeModal(!!isSetUpReply);
  }, [isSetUpReply, isConnectBusiness])


  useEffect(() => {
    if (registrationComplete) return;
    if (userBusinessExists !== undefined) {
      setBusinessRegistered(userBusinessExists);
    }
  }, [userBusinessExists, registrationComplete]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        await dispatch(getUsersBusinessExist(user.id) as any);
        await Promise.all([
          dispatch(getLeads({ page: 1, limit: 100, search: "", sort: "", order: "" }) as any),
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

  useEffect(() => {
    if (ispaymentSuccess || ispaymentRejected) {
      setShowPaymentStatusModal(true);
    }
  }, [ispaymentSuccess, ispaymentRejected]);

  const handleFirstModalSubmit = async (values, { setSubmitting }) => {
    try {
      const cleanedWhatsappNumber = values.whatsappNumber.replace(/\D/g, "");
      const payload = {
        user_id: user?.id,
        whatsapp_number: cleanedWhatsappNumber,
        business_name: values.businessName,
      };
      const response = await dispatch(createBusiness(payload) as any).unwrap();
      if (response.data.status === 200 || response?.statusCode === 200) {
        setWhatsappForOtp(values.whatsappNumber);
        setRegisterBusinessShowModal(false);
        setShowOtpModal(true);

        toast.success("OTP sent successfully");
      } else {
        return toast.error(response.error?.message || "Failed to send OTP");
      }
    } catch (error) {
      toast.error(error.message || "Failed to register business. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const isToday = (date: string | Date): boolean => {
    const inputDate = new Date(date);
    const today = new Date();
    return (
      inputDate.getDate() === today.getDate() &&
      inputDate.getMonth() === today.getMonth() &&
      inputDate.getFullYear() === today.getFullYear()
    );
  };

  const todayLeads = useMemo(() => {
    if (!Array.isArray(leads)) return [];
    return leads.filter(lead => isToday(lead.createdAt));
  }, [leads]);

  const handleOtpVerification = async () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length !== 4) {
      toast.error("Please enter a valid 4-digit OTP.");
      return;
    }

    try {
      const response = await dispatch(verifyOtp({ whatsapp_number: whatsappForOtp, otp: enteredOtp }) as any).unwrap();
      console.log('Repsosne for business verify', response)
      if (response?.status == 200) {
        const refreshTokenRepsonse = await dispatch(getRefreshToken() as any)
        console.log('refreshTokenRepsonse:---', refreshTokenRepsonse.payload);

        if (refreshTokenRepsonse.payload) {
          setToken(refreshTokenRepsonse.payload)
          console.log('NEw TOken', getToken())
        }

      }
      setBusinessId(response?.data?.businessId);
      toast.success("OTP Verified Successfully!");
      debugger;
      setOtp(["", "", "", ""]);

      setShowOtpModal(false);
      setShowBusinessDetailModal(true);
    } catch (error: any) {
      toast.error(error?.message || "Invalid or expired OTP. Please try again.");
    }
  };

  if (loading || isLoading) {
    return <Loader />;
  }

  return (
    <>
      <PaymentStatusModal
        isOpen={showPaymentStatusModal}
        sessionId={session_id}
        status={ispaymentSuccess ? "success" : "rejected"}
        onClose={() => {
          setShowPaymentStatusModal(false);

          const url = new URL(window.location.href);
          url.searchParams.delete("ispaymentSuccess");
          url.searchParams.delete("ispaymentRejected");
          url.searchParams.delete("session_id");
          window.history.replaceState(null, "", url.toString());
        }}
      />

      {!businessExist ? (
        <>
          {/* Message + Button Section */}
          <div className="centered-container">
            <div className="dashboard-top-card p-4 bg-light d-flex flex-column align-items-center text-center">
              <p className="mb-0">
                <strong>Register your business to get started</strong>
              </p>
              <button className="send-otp-button" onClick={() => setRegisterBusinessShowModal(true)}>
                Add Business
              </button>
            </div>
          </div>

          {/* Modal 1: Register Business */}
          <Modal show={showRegisterBusinessModal} onHide={() => setRegisterBusinessShowModal(false)} centered className="custom-modal">
            <Modal.Header className="modalHeader" closeButton>
              <h2>Register your Business</h2>
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
              {({ handleSubmit, isSubmitting }) => (
                <Form onSubmit={handleSubmit}>
                  <Modal.Body className="modalBody">
                    <p className="text-left mb-3">
                      Enter your Business Name and WhatsApp Business number to sign in or create a new account
                    </p>

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

                    <button type="submit" className="send-otp-button mt-3" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <span className="spin"></span>
                      ) : " Send OTP"}

                    </button>
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
            backdrop="static"
            onExited={() => setOtp(["", "", "", ""])}
          >
            <Modal.Header className="modalHeader" closeButton>
              <h2>Enter OTP</h2>
            </Modal.Header>
            <Formik
              initialValues={{}}
              onSubmit={(values) => {
                handleOtpVerification(); // Call your existing handler
              }}
            >
              {({ handleSubmit, isSubmitting }) => (
                <Form onSubmit={handleSubmit}>
                  <Modal.Body className="modalBody">
                    <p className="text-left mb-3">
                      Enter the 4-digit OTP sent to <strong>{whatsappForOtp}</strong>
                    </p>

                    <div className="otpInputContainer">
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
                              if (value && index < otp.length - 1) {
                                document.getElementById(`otp-${index + 1}`)?.focus();
                              }
                            }
                          }}
                          className="otpInput"
                        />
                      ))}
                    </div>

                    <div className="resendText mt-3">
                      Didn't receive the code?{" "}
                      <span className="resendLink" >
                        Send again
                      </span>
                    </div>

                    <button
                      type="submit"
                      className="send-otp-button mt-3"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? <span className="spin"></span> : "Continue"}
                    </button>
                  </Modal.Body>
                </Form>
              )}
            </Formik>
          </Modal>

          {/* Modal 3: Business Info */}
          <Modal
            show={showBusinesssDetailModal}
            onHide={() => setShowBusinessDetailModal(false)}
            centered
            className="custom-modal"
          >
            <Modal.Header className="modalHeader" closeButton>
              <h2>Get Premium</h2>
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
              onSubmit={async (values) => {
                try {
                  const resultAction = await dispatch(
                    addBusinessInfo({
                      step: "step3" as 'step3',
                      businessId: businessId,
                      industry: values.industry,
                      website: values.businessWebsite || undefined,
                    }) as any
                  );

                  if (addBusinessInfo.fulfilled.match(resultAction)) {
                    toast.success("Business info submitted successfully!");
                    setShowBusinessDetailModal(false);
                    setShowWelcomeModal(true);
                  } else {
                    throw new Error(resultAction?.payload || "Failed to submit business info");
                  }
                } catch (error: any) {
                  toast.error(error.message || "Something went wrong. Please try again.");
                }
              }}
            >
              {({ handleSubmit, isSubmitting }) => (
                <Form onSubmit={handleSubmit}>
                  <Modal.Body className="modalBody">
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
                    <button type="submit" className="send-otp-button" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <span className="spin"></span>
                      ) : "Submit"}
                    </button>
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
            <Modal.Header className="modalHeader" closeButton>
              <h2>Welcome Message</h2>
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
                      step: "step4" as 'step4',
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
                  <Modal.Body className="modalBody">
                    <p className="text-left mb-3">
                      Type your welcome message that will greet customers when they chat with you.
                    </p>

                    <div className="mb-3">
                      <label className="form-label">Welcome Message</label>
                      <Field
                        as="textarea"
                        name="welcomeMessage"
                        className="form-control"
                        rows={3}
                        placeholder="👋 Welcome to Pixalane! How can we help you today?"
                      />
                      <ErrorMessage
                        name="welcomeMessage"
                        component="div"
                        className="text-danger"
                      />
                    </div>
                  </Modal.Body>

                  <Modal.Footer>
                    <button type="submit" className="send-otp-button">
                      Save & Continue
                    </button>
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
                      <h6 className="mb-2 f-w-400 text-muted">Leads Generated Today</h6>
                      <h4 className="mb-3">{todayLeads.length}</h4>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-xl-3">
                  <div className="card">
                    <div className="card-body">
                      <h6 className="mb-2 f-w-400 text-muted">Total Leads Generated</h6>
                      <h4 className="mb-3">{leads.length}</h4>
                    </div>
                  </div>
                </div>
                {/* <div className="col-md-6 col-xl-3">
                  <div className="card">
                    <div className="card-body">
                      <h6 className="mb-2 f-w-400 text-muted">Total Users</h6>
                      <h4 className="mb-3">0</h4>
                    </div>
                  </div>
                </div> */}
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