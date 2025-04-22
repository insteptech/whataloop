import React, { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { sendOtp, verifyOtp } from "../../redux/actions/authAction";
import InputField from "@/components/common/InputField";
import { EmailIcon, LockIcon } from "@/components/common/Icon";
import CheckBoxField from "@/components/common/CheckBoxField";

const LoginWithOTP = () => {
  const dispatch = useDispatch<any>();
  const [isOTPSent, setIsOTPSent] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const loginValidationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email Address is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    rememberMe: Yup.boolean(),
  });

  const handleMobileSubmit = async (values: { mobile: string }) => {
    dispatch(sendOtp(values)).then((res) => {
      if (res.payload.statusCode == 200) {
        setIsOTPSent(true);
      } else {
        alert(res.payload.message);
      }
    });
  };

  const handleOTPSubmit = async (values: { otp: string }) => {
    dispatch(verifyOtp(values)).then((res) => {
      if (res.payload.statusCode == 200) {
        window.location.href = "/dashboard";
      } else {
        alert(res.payload.message);
      }
      //
    });
  };
  const handleCheckboxClick = () => {
    setRememberMe(!rememberMe);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Welcome</h2>
          <p>Please enter your credentials to login</p>
        </div>
        {/* {!isOTPSent ? ( */}
        <Formik
          initialValues={{ mobile: "", password: "" }}
          validationSchema={loginValidationSchema}
          onSubmit={handleMobileSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="login-form">
              <InputField
                label="Email Address"
                EndIcon={EmailIcon}
                placeholder="Enter your email"
                id="email"
                type="email"
                name="email"
              />
              <InputField
                label="Password"
                EndIcon={LockIcon}
                placeholder="Enter your password"
                id="password"
                type="password"
                name="password"
              />

              <CheckBoxField
                label="Remember me"
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={handleCheckboxClick}
              />

              <button type="submit" className="login-button">
                Login
              </button>

              <div className="divider">
                <span>or</span>
              </div>

              <div className="social-login">
                <button type="button" className="social-button google">
                  <i className="fab fa-google"></i> Continue with Google
                </button>
              </div>

              <div className="signup-link">
                Don't have an account? <a href="/auth/register">Sign up</a>
              </div>
            </Form>
          )}
        </Formik>
        {/* ) : ( */}
        {/* <Formik
          initialValues={{ otp: "" }}
          validationSchema={Yup.object({
            otp: Yup.string()
              // .length(6, "OTP must be 6 digits")
              .required("OTP is required"),
          })}
          onSubmit={handleOTPSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div style={{ marginBottom: "16px" }}>
                <label
                  htmlFor="otp"
                  style={{ display: "block", marginBottom: "4px" }}
                >
                  OTP
                </label>
                <Field
                  type="text"
                  id="otp"
                  name="otp"
                  placeholder="Enter OTP"
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                  }}
                />

                <ErrorMessage name="otp">
                  {(msg) => (
                    <div style={{ color: "red", marginTop: "5px" }}>{msg}</div>
                  )}
                </ErrorMessage>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  width: "100%",
                  padding: "10px",
                  backgroundColor: "#0070f3",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                {isSubmitting ? "Verifying..." : "Verify OTP"}
              </button>
            </Form>
          )}
        </Formik> */}
        {/* )} */}
      </div>
    </div>
  );
};

export default LoginWithOTP;
