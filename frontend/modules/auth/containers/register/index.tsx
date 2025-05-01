import React, { useRef, useState } from "react";
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

const SignUp = () => {
  const dispatch = useDispatch<any>();

  const [emailVerify, setEmailVerify] = useState(false);
  const isloading = useSelector((state) => state?.authReducer?.loading);
  const [otpVerified, setOtpVerified] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    photo: null,
    otp: "",
  });

  // Validation Schema
  const validationSchema = Yup.object().shape({
    fullName: Yup.string()
      .required("Full name is required")
      .min(2, "Too short!")
      .max(20, "Too long!"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone: Yup.string()
      .required("Mobile number is required")
      .matches(/^[0-9]+$/, "Only numbers allowed")
      .min(10, "Enter valid phone number"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: Yup.string()
      .required("Confirm password is required")
      .oneOf([Yup.ref("password"), null], "Passwords must match"),
  });

  // Handle Form Submit
  const handleSubmit = async () => {
    if (!otpVerified) {
      toast.error("Please verify your email before signing up.");
      return;
    }
  
    const { fullName, email, phone, password } = formData;
    const payload = { fullName, email, phone, password };
  
    try {
      const response = await dispatch(register(payload)).unwrap();
      if (response.statusCode === 200) {
        toast.success("Registration successful!");
        window.location.href = "/";
      }
    } catch (error: any) {
      console.error("Register error:", error);
      toast.error(error?.message || "An error occurred during registration.");
    }
  };
  

  // Handle Send OTP
  const handleSendOtp = async () => {
    const payload = { email: formData.email };
    try {
      const response = await dispatch(
        sendOtp(payload)
      ).unwrap();
      console.log("OTP response:", response);
      
      if (response.status === 200) {
        setEmailVerify(true);
        toast.success("OTP sent successfully! Please check your email.");
      } else if (response.statusCode === 400) {
        toast.error(response.message);
      } else {
        toast.error(response.message || "Failed to send OTP.");
      }
    } catch (error: any) {
      console.error("OTP send error:", error);
      toast.error(error?.message || "Failed to send OTP.");

      if (error?.message?.includes("Email already exists")) {
        toast.error("This email is already registered.");
      } else if (error?.message?.includes("Phone already exists")) {
        toast.error("This phone number is already registered.");
      } else {
        toast.error(error?.message || "Failed to send OTP.");
      }
    }
  };

  // Handle OTP Verify
  const handleOtpVerify = async () => {
    if (!formData.otp) {
      toast.error("OTP cannot be empty.");
      return;
    }

    try {
      const response = await dispatch(
        verifyOtp({ email: formData.email, otp: formData.otp })
      ).unwrap();
      if (response.statusCode === 200) {
        setOtpVerified(true);
        setEmailVerify(false);
        toast.success("OTP verified successfully!");
      }
    } catch (error: any) {
      console.error("OTP verify error:", error);
      toast.error(error?.message || "Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="card-bg-container lg-card-bg-container">
      {isloading && <Loader />}
      <div className="card-inner-content registration-form-card">
        <Formik
          initialValues={formData}
          enableReinitialize
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ validateForm, setTouched }) => (
            <Form>
              {!emailVerify && (
                <>
                  <ImageUpload
                    name="photo"
                    label="Click to upload"
                    //   onChange={(file) => setFormData({ ...formData, photo: file })
                    // }
                  />

                  <Row>
                    <Col md={6}>
                      <InputField
                        label="Full Name"
                        placeholder="Enter Full Name"
                        id="fullName"
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={(e) =>
                          setFormData({ ...formData, fullName: e.target.value })
                        }
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
                        value={formData.email}
                        onChange={(e) => {
                          const newEmail = e.target.value;
                          setFormData((prevFormData) => ({
                            ...prevFormData,
                            email: newEmail,
                            otp: "", // Clear OTP as well
                          }));

                          // If email changes after OTP verified, reset verification
                          if (otpVerified) {
                            setOtpVerified(false);
                          }
                          if (emailVerify) {
                            setEmailVerify(false);
                          }
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
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
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
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
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
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            confirmPassword: e.target.value,
                          })
                        }
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
                            await handleSendOtp();
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
              )}

              {/* OTP Modal */}
              {emailVerify && (
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
                    value={formData.otp}
                    onChange={(e) => {
                      const onlyNumbers = e.target.value.replace(/\D/g, "");
                      setFormData({ ...formData, otp: onlyNumbers });
                    }}
                  />

                  <button
                    type="button"
                    className="login-button mt-4"
                    onClick={handleOtpVerify}
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
