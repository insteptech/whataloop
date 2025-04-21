import React, { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { sendOtp, verifyOtp } from "../../redux/actions/authAction";

const LoginWithOTP = () => {
  const dispatch = useDispatch<any>();
  const [isOTPSent, setIsOTPSent] = useState(false);

  const handleMobileSubmit = async (values: { mobile: string }) => {
      dispatch(sendOtp(values)).then(res => {
        if (res.payload.statusCode == 200) {
          setIsOTPSent(true);
        } else {
          alert(res.payload.message)
        }
    })
  };

  const handleOTPSubmit = async (values: { otp: string }) => {
    dispatch(verifyOtp(values)).then(res => {
        if (res.payload.statusCode == 200) {
          window.location.href = "/dashboard";
        } else {
          alert(res.payload.message)
        }
        //  
    })
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "20px" }}>
      <h2>{isOTPSent ? "Enter OTP" : "Login with Mobile"}</h2>
      {!isOTPSent ? (
        <Formik
          initialValues={{ mobile: "" }}
          validationSchema={Yup.object({
            mobile: Yup.string()
              // .matches(/^\d{10}$/, "Enter a valid 10-digit mobile number")
              .required("Mobile number is required"),
          })}
          onSubmit={handleMobileSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div style={{ marginBottom: "16px" }}>
                <label htmlFor="mobile" style={{ display: "block", marginBottom: "4px" }}>
                  Mobile Number
                </label>
                <Field
                  type="text"
                  id="mobile"
                  name="mobile"
                  placeholder="Enter your mobile number"
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                  }}
                />
                  <ErrorMessage name="otp">
                    {(msg) => <div style={{ color: "red", marginTop: "5px" }}>{msg}</div>}
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
                {isSubmitting ? "Sending OTP..." : "Send OTP"}
              </button>
            </Form>
          )}
        </Formik>
      ) : (
        <Formik
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
                <label htmlFor="otp" style={{ display: "block", marginBottom: "4px" }}>
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
                    {(msg) => <div style={{ color: "red", marginTop: "5px" }}>{msg}</div>}
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
        </Formik>
      )}
    </div>
  );
};

export default LoginWithOTP;
