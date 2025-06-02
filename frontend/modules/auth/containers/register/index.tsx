import React, { useState, useRef } from "react";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import InputField from "@/components/common/InputField";
import { Col, Row } from "react-bootstrap";
import ImageUpload from "@/components/common/ImageUpload";
import verifiedIcon from "../../../../public/verified.png";
import InputFieldWithCountryCode from "@/components/common/InputFieldWithCountryCode";
import { register, sendOtp, verifyOtp } from "../../redux/actions/authAction";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "@/components/common/loader";
import { log } from "console";

const SignUp = () => {
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
    // businessName: Yup.string()
    //   .required("Business name is required")
    //   .min(2, "Too short!")
    //   .max(20, "Too long!"),
    phone: Yup.string()
      .required("Phone is required")
      .matches(/^\+?[0-9]{10,}$/, "Phone number is not valid")
      .min(12, "Phone number too short")
      .max(15, "Phone number is too long!"),
    email: Yup.string()
      .required("Email is required")
      .email("Invalid email format")
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Invalid email format"
      ),
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
      } else {
        toast.error(response.message || "Failed to send OTP.");
      }
    } catch (error: any) {
      toast.error(error?.message || "Failed to send OTP.");
      if (error?.message?.includes("Email already exists")) {
        toast.error("This email is already registered.");
      } else if (error?.message?.includes("Phone already exists")) {
        toast.error("This phone number is already registered.");
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
      if (response?.statusCode === 200) {
        setOtpVerified(true);
        setEmailVerify(false);
        toast.success("OTP verified successfully!");
      }
    } catch (error: any) {
      toast.error(error?.message || "Invalid OTP. Please try again.");
    }
  };

  // Handle Form Submit
  const handleSubmit = async (values) => {
    if (!otpVerified) {
      toast.error("Please verify your email before signing up.");
      return;
    }

    const { full_name, businessName, email, phone, password, photo } = values;

    const payload = {
      full_name,
      businessName,
      email,
      phone,
      password,
      photo,
    };
    console.log("Payload for registration:", payload);
    try {
      console.log(payload, "Payload for registration");

      const response = await dispatch(register(payload) as any).unwrap();
      if (response?.statusCode === 200) {
        toast.success("Registration successful!");
        window.location.href = "/";
      }
    } catch (error: any) {
      const errorMsg = error?.message || "An error occurred during registration.";
      if (errorMsg.includes("Email already exists")) {
        toast.error("This email is already registered.");
      } else if (errorMsg.includes("Phone already exists")) {
        toast.error("This phone number is already registered.");
      } else {
        toast.error(errorMsg);
      }
    }
  };

  return (
    <div className="card-bg-container lg-card-bg-container">
      {isloading && <Loader />}
      <div className="card-inner-content registration-form-card">
        <Formik
          initialValues={{
            full_name: "",
            businessName: "",
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
                    file={values.photo}
                  />
                  <Row>
                    <Col md={6}>
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
                    {/* <Col md={6}>
                      <InputField
                        label="Business Name"
                        placeholder="Enter Business Name"
                        id="businessName"
                        type="text"
                        name="businessName"
                        value={values.businessName}
                        onChange={handleChange}
                        required
                      />
                    </Col> */}
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
                              fullName: true,
                              email: true,
                              phone: true,
                              password: true,
                              confirmPassword: true,
                            });
                          }
                        }}
                      >
                        Sign up
                      </button>
                    ) : (
                      <button type="submit" className="login-button mt-4">
                        Sign up
                      </button>
                    )}
                  </Row>
                </>
              ) : (
                // OTP Modal
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

export default SignUp;