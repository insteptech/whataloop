import React, { useState, useRef } from "react";
import { Formik, Form, ErrorMessage, Field } from "formik";
import * as Yup from "yup";
import InputField from "@/components/common/InputField";
import { Col, Row, Modal, Button } from "react-bootstrap";
import InputFieldWithCountryCode from "@/components/common/InputFieldWithCountryCode";
import { resendOtp, sendOtp, verifyOtpAndRegisterAndLogin } from "../../redux/actions/authAction";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

const SignUp = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector((state: any) => state?.authReducer?.loading);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");

  const inputsRef = useRef([]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const validationSchema = Yup.object().shape({
    full_name: Yup.string()
      .required("Full name is required")
      .min(2, "Too short!")
      .max(20, "Too long!"),
    phone: Yup.string()
      .required("Phone is required")
      .matches(/^\+?[0-9]{10,}$/, "Phone number is not valid")
      .min(12, "Phone number too short")
      .max(15, "Phone number is too long!"),
  });

  const handleSendOtp = async (values) => {
    try {
      const payload = {
        full_name: values.full_name,
        phone: values.phone,
      };
      const response = await dispatch(sendOtp(payload) as any);

      if (response.error) {
        toast.error(response.payload.message || "Failed to send OTP");
        return;
      }

      if (response.payload.status === 200) {
        setPhoneNumber(values.phone);
        setShowOtpModal(true);
        toast.success("OTP has been sent to your WhatsApp!");
      } else {
        toast.error(response.payload.message || "Failed to send OTP");
      }
    } catch (error) {
      console.error("OTP Sending Error:", error);
      toast.error(error.message || "An error occurred while sending OTP");
    }
  };

  const handleResendOtp = async (values) => {
    try {
      const payload = {
        phone: values.phone,
      };
      const response = await dispatch(resendOtp(payload) as any);

      if (response.error) {
        toast.error(response.error.message || "Failed to send OTP");
        return;
      }

      if (response.payload.status === 200) {
        setPhoneNumber(values.phone);
        setShowOtpModal(true);
        toast.success("OTP has been sent to your WhatsApp!");
      } else {
        toast.error(response.payload.message || "Failed to send OTP");
      }
    } catch (error) {
      console.error("OTP Sending Error:", error);
      toast.error(error.message || "An error occurred while sending OTP");
    }
  };
  const handleVerifyOtp = async () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length !== 6) {
      setOtpError("Please enter a valid 6-digit OTP.");
      return;
    }

    try {
      const payload = {
        phone: phoneNumber,
        otp: enteredOtp,
        mode: "register" as "register",
      };
      const response = await dispatch(verifyOtpAndRegisterAndLogin(payload) as any);

      if (response.error) {
        toast.error(response.error.message || "Failed to verify OTP");
        return;
      }

      if (response.payload.status === 200) {
        toast.success("Registration successful!");
        setShowOtpModal(false);
        window.location.href = "/auth/login";
      } else {
        toast.error(response.payload.message || "Failed to verify OTP");
      }
    } catch (error) {
      console.error("OTP Verification Error:", error);
      toast.error(error.message || "Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="card-bg-container lg-card-bg-container">
      <div className="card-inner-content registration-form-card">
        {/* Only show the form if OTP modal is NOT open */}
        {!showOtpModal ? (
          <>
            <div className="module-card-header">
              <h2>Let's get your account set up</h2>
              <p>Enter your number to sign in or create a new account</p>
            </div>

            <Formik
              initialValues={{ full_name: "", phone: "" }}
              validationSchema={validationSchema}
              onSubmit={handleSendOtp}
            >
              {({ values, handleChange, isSubmitting }) => (
                <Form>
                  <Row>
                    <Col md={12}>
                      <InputField
                        label="Full Name"
                        placeholder="Enter Full Name"
                        id="full_name"
                        type="text"
                        name="full_name"
                        value={values.full_name}
                        onChange={handleChange}
                        required
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col md={12}>
                      <InputFieldWithCountryCode
                        label="WhatsApp Number"
                        placeholder="Enter WhatsApp Phone number"
                        id="phone"
                        type="text"
                        name="phone"
                        value={values.phone}
                        onChange={handleChange}
                        className="country-code-select-with-number"
                        required
                      />
                    </Col>
                  </Row>
                  <p className="otp-message">You will receive a 6-digit code</p>
                  <button type="submit" className="send-otp-button" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <span className="spin"></span>
                    ) : "Send OTP"}
                  </button>
                  <div className="divider mt-4">
                    <span>or</span>
                  </div>
                  <div className="signup-link text-start">
                    Have an account? <a href="/auth/login">Login</a>
                  </div>
                </Form>
              )}
            </Formik>
          </>
        ) : null}

        {/* OTP Modal */}
        <Modal show={showOtpModal} onHide={() => setShowOtpModal(false)} centered backdrop="static">
          <Modal.Header className="modalHeader" closeButton>
            <Modal.Title>Verify OTP</Modal.Title>
          </Modal.Header>
          <Modal.Body className="modalBody">
            <div className="otpTitle">
              Enter the 6-digit OTP sent to: <strong>{phoneNumber}</strong>
            </div>

            <p className="otpDescription">Enter OTP Code</p>

            <div className="otpInputContainer">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputsRef.current[index] = el;
                  }}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="otpInput"
                />
              ))}
            </div>

            <div className="resendText">
              Didn't receive the code?{" "}
              <span className="resendLink" onClick={handleResendOtp}>
                Send again
              </span>
            </div>

            {otpError && <div className="text-danger mt-2 text-center">{otpError}</div>}

            <button className="send-otp-button" onClick={handleVerifyOtp} disabled={isLoading}>
              {isLoading ? "Verifying..." : "Verify OTP"}
            </button>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

export default SignUp;