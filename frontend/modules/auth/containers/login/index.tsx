import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../redux/actions/authAction";
import InputField from "@/components/common/InputField";
import { EmailIcon, LockIcon } from "@/components/common/Icon";
import CheckBoxField from "@/components/common/CheckBoxField";
import { Router } from "next/router";
import { useRouter } from "next/router";
import Loader from "@/components/common/loader";
// import SelectField from "@/components/common/SelectField";
// import TextAreaField from "@/components/common/TextareaField";

const LoginWithOTP = () => {
  const router = useRouter();
  const isloding = useSelector((state: any) => state?.authReducer?.loading);
  // const isloding = true

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

  const handleSubmit = async (values: { email: string; password: string }) => {
    const payload = {
      email: values.email,
      password: values.password,
    };

    try {
      await dispatch(login(payload)).then((response) => {
        if (response.payload.status === 200) {

          window.location.href = "/dashboard/containers";
        } else {
          alert(
            response.payload.data?.message ||
            "Invalid credentials, please try again."
          );
        }
      });
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  // const handleCheckboxClick = () => {
  //   setRememberMe(!rememberMe);
  // };

  return (

    <div className="card-bg-container">
      {isloding && <Loader />}
      <div className="card-inner-content">
        <div className="module-card-header">
          <h2>Welcome</h2>
          <p>Please enter your credentials to login</p>
        </div>
        {/* {!isOTPSent ? ( */}
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={loginValidationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="login-form">
              <InputField
                label="Email Address"
                StartIcon={EmailIcon}
                placeholder="Enter your email"
                id="email"
                type="email"
                name="email"
                required={true}
              />
              <InputField
                label="Password"
                StartIcon={LockIcon}
                placeholder="Enter your password"
                id="password"
                type="password"
                name="password"
                required
              />

              {/* <CheckBoxField
                label="Remember me"
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={handleCheckboxClick}
              /> */}

              <button type="submit" className="login-button">
                Login
              </button>

              <div className="divider">
                <span>or</span>
              </div>

              {/* <div className="social-login">
                <button type="button" className="social-button google">
                  <i className="fab fa-google"></i> Continue with Google
                </button>
              </div> */}

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
