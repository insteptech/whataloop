import React, { useState } from "react";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import InputField from "@/components/common/InputField";
import { Col, Row } from "react-bootstrap";
import ImageUpload from "@/components/common/ImageUpload";
import verifiedIcon from "../../../../public/verified.png";
import InputFieldWithCountryCode from "@/components/common/InputFieldWithCountryCode";
import { register, sendOtp, verifyOtp } from "../../../auth/redux/actions/authAction";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "@/components/common/loader";

const CreateUser = () => {
  const dispatch = useDispatch();
  const isloading = useSelector((state: any) => state?.authReducer?.loading);
  const [emailVerify, setEmailVerify] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  // Validation Schema
  const validationSchema = Yup.object().shape({
    full_name: Yup.string()
      .required("Full name is required")
      .min(2, "Too short!")
      .max(20, "Too long!"),
    email: Yup.string()
      .required("Email is required")
      .email("Invalid email format")
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Invalid email format"
      ),
    phone: Yup.string()
      .required("Phone is required")
      .matches(/^\+?[0-9]{10,}$/, "Phone number is not valid")
      .min(10, "Phone number too short")
      .max(15, "Phone number is too long"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: Yup.string()
      .required("Confirm password is required")
      .oneOf([Yup.ref("password"), null], "Passwords must match"),
    otp: Yup.string(),
  });

  // Handle Send OTP
  const handleSendOtp = async (values) => {
    const payload = { email: values.email };
    try {
      const response = await dispatch(sendOtp(payload) as any).unwrap();
      if (response.status === 200) {
        setEmailVerify(true);
        toast.success("OTP sent successfully! Please check your email.");
      } else if (response.statusCode === 400) {
        toast.error(response.message);
      } else {
        toast.error(response.message || "Failed to send OTP.");
      }
    } catch (error: any) {
      const errorMessage = error.message || "Submission error. Please try again.";
      if (errorMessage.includes("email")) {
        toast.error(errorMessage);
      } else if (errorMessage.includes("phone")) {
        toast.error(errorMessage);
      } else {
        toast.error(errorMessage);
      }
    }
  };

  // Handle OTP Verify
  const handleOtpVerify = async (values, setTouched) => {
    if (!values.otp) {
      toast.error("OTP cannot be empty.");
      return;
    }
    try {
      const response = await dispatch(
        verifyOtp({ email: values.email, otp: values.otp }) as any
      ).unwrap();
      if (response.statusCode === 200) {
        setOtpVerified(true);
        setEmailVerify(false);
        toast.success("OTP verified successfully!");
      }
    } catch (error: any) {
      toast.error(error?.message || "Invalid OTP. Please try again.");
    }
  };

  const handleSubmit = async (values) => {
    if (!otpVerified) {
      toast.error("Please verify your email before signing up.");
      return;
    }

    const { full_name, email, phone, password, photo } = values;

    const payload = {
      full_name,
      email,
      phone,
      password,
      photo,
    };
    console.log("Register payload:", payload);
    try {
      const response = await dispatch(register(payload) as any).unwrap();
      if (response.statusCode === 200) {
        toast.success("Registration successful!");
        window.location.href = "/users/usersList";
      }
    } catch (error: any) {
      console.error("Register error:", error);
      toast.error(error?.message || "An error occurred during registration.");
    }
  };

  return (
    <div className="card-bg-container-create-user lg-card-bg-container">
      {isloading && <Loader />}
      <div className="card-inner-content registration-form-card">
        <Formik
          initialValues={{
            full_name: "",
            email: "",
            phone: "",
            password: "",
            confirmPassword: "",
            photo: null,
            otp: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, handleChange, setFieldValue, validateForm, setTouched }) => (
            <Form>
              {!emailVerify ? (
                <>
                  <ImageUpload
                    name="photo"
                    label="Click to upload"
                    onChange={(file) => setFieldValue("photo", file)}
                  />
                  <Row>
                    <Col md={6}>
                      <InputField
                        label="Full Name"
                        placeholder="Enter Full Name"
                        id="full_name"
                        type="text"
                        name="full_name"  // <-- changed from fullName to full_name
                        value={values.full_name}  // <-- updated
                        onChange={handleChange}
                        required
                      />
                    </Col>
                    <Col md={6}>
                      <InputField
                        label="Email"
                        placeholder="Enter Email"
                        id="email"
                        type="email"
                        name="email"
                        value={values.email}
                        onChange={(e) => {
                          const newEmail = e.target.value;
                          setFieldValue("email", newEmail);
                          setFieldValue("otp", "");
                          if (otpVerified) setOtpVerified(false);
                          if (emailVerify) setEmailVerify(false);
                        }}
                        EndImage={otpVerified ? verifiedIcon : null}
                        className="email-with-verified-icon"
                        required
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
                        className="country-code-select-with-number"
                        required
                      />
                    </Col>
                    <Col md={6}>
                      <InputField
                        label="Password"
                        placeholder="Enter Password"
                        id="password"
                        type="password"
                        name="password"
                        value={values.password}
                        onChange={handleChange}
                        required
                      />
                    </Col>
                    <Col md={6}>
                      <InputField
                        label="Confirm Password"
                        placeholder="Enter Confirm Password"
                        id="confirmPassword"
                        type="password"
                        name="confirmPassword"
                        value={values.confirmPassword}
                        onChange={handleChange}
                        required
                      />
                    </Col>
                    {!otpVerified ? (
                      <button
                        type="button"
                        className="login-button mt-4"
                        onClick={async () => {
                          const errors = await validateForm();
                          if (Object.keys(errors).length === 0) {
                            await handleSendOtp(values);
                          } else {
                            setTouched({
                              full_name: true,  
                              email: true,
                              phone: true,
                              password: true,
                              confirmPassword: true,
                            });
                          }
                        }}
                      >
                        Create User
                      </button>
                    ) : (
                      <button type="submit" className="login-button mt-4">
                        Create User
                      </button>
                    )}
                  </Row>
                </>
              ) : (
                <div className="email-verify-modal">
                  <div className="login-header">
                    <h2>Confirm your Email</h2>
                  </div>
                  <InputField
                    label="Enter OTP"
                    placeholder="Enter OTP"
                    id="otp"
                    type="text"
                    name="otp"
                    value={values.otp}
                    onChange={(e) => {
                      const onlyNumbers = e.target.value.replace(/\D/g, "");
                      setFieldValue("otp", onlyNumbers);
                    }}
                  />
                  <button
                    type="button"
                    className="login-button mt-4"
                    onClick={() => handleOtpVerify(values, setTouched)}
                  >
                    Verify OTP
                  </button>
                </div>
              )}
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default CreateUser;