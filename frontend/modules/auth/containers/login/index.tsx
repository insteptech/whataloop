import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { login, verifyOtpAndRegisterAndLogin } from "../../redux/actions/authAction";
import InputFieldWithCountryCode from "@/components/common/InputFieldWithCountryCode";
import { useRouter } from "next/router";
import Loader from "@/components/common/loader";
import { Modal, Button } from "react-bootstrap"; // Make sure react-bootstrap is installed
import { toast } from "react-toastify";

const LoginWithOTP = () => {
  const router = useRouter();
  const isLoading = useSelector((state: any) => state?.authReducer?.loading);
  const dispatch = useDispatch();
  const [isOTPSent, setIsOTPSent] = useState(false);
  const [phone, setPhone] = useState("");
  const [otpError, setOtpError] = useState("");

  // Schema for phone form
  const loginValidationSchema = Yup.object().shape({
    phone: Yup.string()
      .required("WhatsApp number is required")
      .matches(/^\+?[0-9]{10,}$/, "WhatsApp number is not valid")
      .min(12, "WhatsApp number too short")
      .max(15, "WhatsApp number is too long!"),
  });

  // Schema for OTP form
  const otpValidationSchema = Yup.object().shape({
    otp: Yup.string()
      .length(6, "OTP must be 6 digits")
      .required("OTP is required"),
  });

  const handleSendOtp = async (values: { phone: string }) => {
    try {
      const response = await dispatch(login(values) as any).unwrap();
      console.log("Response from login:dd", response);

      if (response.status === 200) {
        setPhone(values.phone);
        setIsOTPSent(true); // Show OTP modal
        toast.success("OTP has been sent to your WhatsApp!");
      }
    } catch (error: any) {
      console.error("Login Error:", error);
      toast.error(error.message || "Failed to send OTP. Please try again.");
    }
  };

  const handleVerifyOtp = async (values: { otp: string }) => {
    try {
      const payload = {
        phone,
        otp: values.otp,
        mode: "login" as "login",
      };
      const response = await dispatch(verifyOtpAndRegisterAndLogin(payload) as any).unwrap();
      console.log("Response from verifyOtpAndRegister from login:", response);
      if (response.status === 200) {
        toast.success("Login successful!");
        router.push("/dashboard/containers");
      }
    } catch (error: any) {
      console.error("OTP Verification Error:", error);
      setOtpError("Invalid or expired OTP. Please try again.");
    }
  };

  return (
    <div className="card-bg-container">
      {isLoading && <Loader />}
      <div className="card-inner-content">
        <div className="module-card-header">
          <h2>Welcome</h2>
          <p>Please enter your credentials to login</p>
        </div>

        {!isOTPSent ? (
          <Formik
            initialValues={{ phone: "" }}
            validationSchema={loginValidationSchema}
            onSubmit={handleSendOtp}
          >
            {({ isSubmitting, handleChange }) => (
              <Form className="login-form">
                <InputFieldWithCountryCode
                  label="WhatsApp Number"
                  placeholder="Enter WhatsApp Phone number"
                  id="phone"
                  type="text"
                  name="phone"
                  onChange={handleChange}
                  className="country-code-select-with-number"
                  required
                />

                <button
                  type="submit"
                  className="send-otp-button"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending OTP..." : "Send OTP"}
                </button>

                <div className="divider">
                  <span>or</span>
                </div>

                <div className="signup-link">
                  Don't have an account?{" "}
                  <a href="/auth/register">Sign up</a>
                </div>
              </Form>
            )}
          </Formik>
        ) : (
          <OtpModal
            phone={phone}
            onVerify={handleVerifyOtp}
            onCancel={() => setIsOTPSent(false)}
            otpError={otpError}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
};

// OTP Modal Component
const OtpModal = ({ phone, onVerify, onCancel, otpError, isLoading }) => {
  const [otp, setOtp] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setOtp(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (otp.length === 6) {
      onVerify({ otp });
    }
  };

  return (
    <Modal show={true} onHide={onCancel} centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Enter OTP</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit}>
          <p className="text-center">
            We've sent an OTP to: <strong>{phone}</strong>
          </p>
          <input
            type="text"
            maxLength={6}
            value={otp}
            onChange={handleChange}
            placeholder="Enter 6-digit OTP"
            className="form-control text-center"
            style={{ fontSize: "1.2rem", padding: "10px" }}
            disabled={isLoading}
          />
          {otpError && <div className="text-danger mt-2 text-center">{otpError}</div>}
          <div className="d-flex justify-content-between mt-4">
            <Button variant="secondary" onClick={onCancel} disabled={isLoading}>
              Back
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={otp.length !== 6 || isLoading}
            >
              {isLoading ? "Verifying..." : "Verify OTP"}
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default LoginWithOTP;