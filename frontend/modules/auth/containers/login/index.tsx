import React, { useState, useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { login, verifyOtpAndRegisterAndLogin } from "../../redux/actions/authAction";
import InputFieldWithCountryCode from "@/components/common/InputFieldWithCountryCode";
import { useRouter } from "next/router";
import Loader from "@/components/common/loader";
import { Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";

const LoginWithOTP = () => {
  const router = useRouter();
  const isLoading = useSelector((state: any) => state?.authReducer?.loading);
  const dispatch = useDispatch();
  const [isOTPSent, setIsOTPSent] = useState(false);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");

  const inputsRef = useRef([]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const loginValidationSchema = Yup.object().shape({
    phone: Yup.string()
      .required("Number is required")
      .matches(/^\+?[0-9]{10,}$/, "Number is not valid")
      .min(12, " number too short")
      .max(15, "Number is too long!"),
  });

  const handleSendOtp = async (values) => {
    try {
      const response = await dispatch(login(values) as any).unwrap();
      if (response.status === 200) {
        setPhone(values.phone);
        setIsOTPSent(true);
        toast.success("OTP has been sent to your WhatsApp!");
      }
    } catch (error) {
      console.error("Login Error:", error);
      toast.error(error.message || "Failed to send OTP. Please try again.");
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
        phone,
        otp: enteredOtp,
        mode: "login" as "login",
      };
      const response = await dispatch(verifyOtpAndRegisterAndLogin(payload) as any).unwrap();
      if (response.status === 200) {
        toast.success("Login successful!");
        router.push("/dashboard/containers");
      }
    } catch (error) {
      console.error("OTP Verification Error:", error);
      setOtpError("Invalid or expired OTP. Please try again.");
    }
  };

  return (
    <div className="card-bg-container">
      {isLoading && <Loader />}
      <div className="card-inner-content">
        <div className="module-card-header">
          <h2>Log in</h2>
          <h3>Enter your number to log in</h3>
        </div>
        {!isOTPSent ? (
          <Formik initialValues={{ phone: "" }} validationSchema={loginValidationSchema} onSubmit={handleSendOtp}>
            {({ values, handleChange, isSubmitting }) => (
              <Form className="login-form">
                <InputFieldWithCountryCode
                  label="Enter your Phone number"
                  placeholder="Enter your Phone number"
                  id="phone"
                  type="text"
                  name="phone"
                  value={values.phone}
                  onChange={handleChange}
                  className="country-code-select-with-number"
                  required
                />
                <p>you will recieve 6 digit code </p>
                <button type="submit" className="send-otp-button" disabled={isSubmitting}>
                  {isSubmitting ? "Sending OTP..." : "Send OTP"}
                </button>
                <div className="divider">
                  <span>or</span>
                </div>
                <div className="signup-link">
                  Don't have an account? <a href="/auth/register">Create an account</a>
                </div>
              </Form>
            )}
          </Formik>
        ) : (
          <Modal show={true} onHide={() => setIsOTPSent(false)} centered backdrop="static">
            <Modal.Header className="modalHeader" closeButton>
              <h2>Enter OTP</h2>
            </Modal.Header>
            <Modal.Body className="modalBody">
              <div className="otpTitle">
                Enter 6-digit code sent to <strong>{phone}</strong>
              </div>

              <p className="otpDescription">
                Enter OTP Code
              </p>

              <div className="otpInputContainer">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => { inputsRef.current[index] = el; }}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="otpInput"
                  />
                ))}
              </div>

              {otpError && <div className="text-danger mt-2 text-center">{otpError}</div>}

              <div className="resendText">
                Didn't receive the code?{" "}
                <span className="resendLink" onClick={handleSendOtp}>
                  Send again
                </span>
              </div>

              {/* Centered Continue Button */}
             
                <button className="send-otp-button" onClick={handleVerifyOtp} disabled={isLoading}>
                  {isLoading ? "Verifying..." : "Continue"}
                </button>
             
            </Modal.Body>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default LoginWithOTP;