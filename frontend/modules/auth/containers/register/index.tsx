import React, { useRef } from "react";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import InputField from "@/components/common/InputField";
import FileInput from "@/components/common/FileInput";
import { Col, Row } from "react-bootstrap";
import ProfileIcon from "../../../../public/user.png";
import Image from "next/image";
import ImageUpload from "@/components/common/ImageUpload";

const SignUp = () => {
  const fileInputRef = useRef(null);
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

  const handleSubmit = (values, { resetForm }) => {
    const formData = new FormData();
    // formData.append("profileImage", values.profileImage);

    for (const key in values) {
      formData.append(key, values[key]);
    }

    // Example log - replace this with an API call
    for (let pair of formData.entries()) {
      console.log(pair[0] + ": ", pair[1]);
    }

    resetForm();

    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  return (
    <div className="login-container registration-container">
      <div className="login-card registration-form-card">
        {/* <div className="login-header">
          <h2>Registration Form</h2>
        </div> */}
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, values }) => (
            <Form>
              {/* <div className="profile-icon row align-content-center justify-content-center">
                <div className="col-md-4">
                  <Image src={ProfileIcon} alt="" />
                </div>
              </div> */}
              <ImageUpload name="photo" label="Click to upload" />
              <Row>
                <Col md={6}>
                  <InputField
                    label="First Name"
                    placeholder="Enter First name"
                    id="firstName"
                    type="text"
                    name="firstName"
                  />
                </Col>
                <Col md={6}>
                  <InputField
                    label="Email"
                    placeholder="Enter Email"
                    id="email"
                    type="email"
                    name="email"
                  />
                </Col>
                <Col md={6}>
                  <InputField
                    label="Phone number"
                    placeholder="Enter Phone number"
                    id="mobile"
                    type="text"
                    name="mobile"
                  />
                </Col>
                <Col md={6}>
                  <InputField
                    label="Password"
                    placeholder="Enter Password"
                    id="password"
                    type="password"
                    name="password"
                  />
                </Col>
                <Col md={6}>
                  <InputField
                    label="Confirm Password"
                    placeholder="Enter Confirm Password"
                    id="confirmPassword"
                    type="password"
                    name="confirmPassword"
                  />
                </Col>

                {/* Custom File Input for Photo */}
                {/* <div>
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
                  <ErrorMessage
                    name="photo"
                    component="div"
                    className="text-red-600 text-sm"
                  />
                </div> */}
                <button type="submit" className="login-button mt-4">
                  Sign up
                </button>
              </Row>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default SignUp;
