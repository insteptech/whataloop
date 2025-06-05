import React, { useState } from "react";
import { Formik, Form, ErrorMessage, Field } from "formik";
import * as Yup from "yup";
import InputField from "@/components/common/InputField";
import { Col, Row, Modal, Button } from "react-bootstrap";
import InputFieldWithCountryCode from "@/components/common/InputFieldWithCountryCode";
import { sendOtp, verifyOtpAndRegisterAndLogin } from "../../redux/actions/authAction";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "@/components/common/loader";

const SignUp = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector((state: any) => state?.authReducer?.loading);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");

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

  const otpValidationSchema = Yup.object().shape({
    otp: Yup.string()
      .length(6, "OTP must be 6 digits")
      .required("OTP is required"),
  });

  const handleSendOtp = async (values: { full_name: string; phone: string }) => {
    try {
      const payload = {
        full_name: values.full_name,
        phone: values.phone,
      };

      const response = await dispatch(sendOtp(payload) as any);
      console.log("OTP Response:", response, response.payload.status);

      if (response.error) {
        console.log('response.error:---', response.error);
        return toast.error(response.error.message || "Failed to send OTP");

        // throw new Error(response.error.message || "Failed to send OTP");
      }

      const responseData = response.payload || response;
      console.log("Response Data:", responseData.status);


      if (responseData.status === 200 || responseData.statusCode === 200) {
        setPhoneNumber(values.phone);
        setShowOtpModal(true);
        toast.success("OTP has been sent to your WhatsApp!");
      } else {
        toast.error(responseData.message || "Failed to send OTP");
      }
    } catch (error: any) {
      console.error("OTP Sending Error:", error);
      const errorMsg = error?.message || "An error occurred while sending OTP";
      if (errorMsg.includes("Phone already exists")) {
        toast.error("This phone number is already registered.");
      } else {
        toast.error(errorMsg);
      }
    }
  };

  const handleVerifyOtp = async (otp: string) => {
    try {
      const payload = {
        phone: phoneNumber,
        otp,
        mode: "register" as "register", // Specify the mode as 'register'
      };

      const response = await dispatch(verifyOtpAndRegisterAndLogin(payload) as any);
      console.log("OTP Verification Response:", response);


      if (response.error) {
        throw new Error(response.error.message || "Failed to verify OTP");
      }

      const responseData = response.payload || response;
      console.log("Response Data from OTP Verification:", responseData);

      if (responseData.status === 200 || responseData.statusCode === 200) {
        toast.success("Registration successful!");
        setShowOtpModal(false);
        window.location.href = "/auth/login"; // Redirect to login page
      } else {
        toast.error(responseData.message || "Failed to verify OTP");
      }
    } catch (error: any) {
      console.error("OTP Verification Error:", error);
      toast.error(error?.message || "Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="card-bg-container lg-card-bg-container">
      {isLoading && <Loader />}
      <div className="card-inner-content registration-form-card">
        <div className="module-card-header">
          <h2>Sign Up</h2>
          <p>Please enter your credentials to Sign-Up</p>
        </div>

        <Formik
          initialValues={{
            full_name: "",
            phone: "",
          }}
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

              <button
                type="submit"
                className="login-button mt-4 w-100"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending OTP..." : "Send OTP"}
              </button>

              <div className="divider mt-4">
                <span>or</span>
              </div>
              <div className="signup-link text-center">
                Already have an account? <a href="/auth/login">Login</a>
              </div>
            </Form>
          )}
        </Formik>

        {/* OTP Verification Modal */}
        <Modal
          show={showOtpModal}
          onHide={() => setShowOtpModal(false)}
          centered
          backdrop="static"
        >
          <Modal.Header closeButton>
            <Modal.Title>Verify OTP</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Formik
              initialValues={{ otp: "" }}
              validationSchema={otpValidationSchema}
              onSubmit={(values) => handleVerifyOtp(values.otp)}
            >
              {({ isSubmitting }) => (
                <Form>
                  <p className="text-center mb-3">
                    We've sent a 6-digit OTP to: <br />
                    <strong>{phoneNumber}</strong>
                  </p>

                  <div className="mb-3">
                    <Field
                      type="text"
                      name="otp"
                      placeholder="Enter OTP"
                      className="form-control text-center"
                      maxLength={6}
                      style={{ fontSize: "1.2rem", padding: "10px" }}
                    />
                    <ErrorMessage
                      name="otp"
                      component="div"
                      className="text-danger mt-2 text-center"
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    className="w-100"
                    disabled={isSubmitting}
                    size="lg"
                  >
                    {isSubmitting ? "Verifying..." : "Verify OTP"}
                  </Button>
                </Form>
              )}
            </Formik>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

export default SignUp;