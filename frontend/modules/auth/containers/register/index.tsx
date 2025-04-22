import React, { useRef } from "react";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import InputField from "@/components/common/InputField";

const SignUp = () => {
  const fileInputRef = useRef(null)
  const validationSchema = Yup.object().shape({
    firstName: Yup.string()
      .required("First name is required")
      .min(2, "Too short!")
      .max(20, "Too long!"),

    email: Yup.string().email("Invalid email").required("Email is required"),

    mobile: Yup.string()
      .required("Mobile number is required")
      .matches(/^[0-9]+$/, "Only numbers allowed")
      .min(10, "Enter valid phone number"),

    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),

    confirmPassword: Yup.string()
      .required("Confirm password is required")
      .oneOf([Yup.ref("password"), null], "Passwords must match"),

    photo: Yup.mixed()
      // .required("Photo is required")
      .test("fileSize", "File too large", (value) =>
        value instanceof File ? value.size <= 2 * 1024 * 1024 : false
      )
      .test("fileType", "Unsupported file format", (value) =>
        value instanceof File
          ? ["image/jpeg", "image/png", "image/jpg"].includes(value.type)
          : false
      ),
    
  });

  const initialValues = {
    firstName: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    photo: null,
  };

  const handleSubmit = (values, {resetForm}) => {
    const formData = new FormData();

    for (const key in values) {
      formData.append(key, values[key]);
    }

    // Example log - replace this with an API call
    for (let pair of formData.entries()) {
      console.log(pair[0] + ": ", pair[1]);
    }

    resetForm()

    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "20px" }}>
      <h2>Registration Form</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue }) => (
          <Form>
            <div style={{ marginBottom: "16px" }}>
              <InputField
                label="First Name"
                placeholder="Enter First name"
                id="firstName"
                type="text"
                name="firstName"
              />

              <InputField
                label="Email"
                placeholder="Enter Email"
                id="email"
                type="email"
                name="email"
              />

              <InputField
                label="Phone number"
                placeholder="Enter Phone number"
                id="mobile"
                type="text"
                name="mobile"
              />

              <InputField
                label="Password"
                placeholder="Enter Password"
                id="password"
                type="password"
                name="password"
              />

              <InputField
                label="Confirm Password"
                placeholder="Enter Confirm Password"
                id="confirmPassword"
                type="password"
                name="confirmPassword"
              />

              {/* Custom File Input for Photo */}
              <div>
                <label htmlFor="photo">Upload Photo</label>
                <input
                  id="photo"
                  name="photo"
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={(event) => {
                    setFieldValue("photo", event.currentTarget.files[0]);
                  }}
                  className="form-input"
                />
                <ErrorMessage name="photo" component="div" className="text-red-600 text-sm" />
              </div>

              <button type="submit" className="login-button mt-4">
                Sign up
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default SignUp;
