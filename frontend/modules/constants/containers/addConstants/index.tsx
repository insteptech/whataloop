import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { postConstant } from "../../redux/action/constantAction";
import Notification from "@/components/common/Notification";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/router";


const AddConstants = () => {
  const dispatch = useDispatch<any>();
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      type: "",
      label: "",
      value: "",
    },
    validationSchema: Yup.object({
      type: Yup.string().required("Type is required"),
      label: Yup.string().required("Label is required"),
      value: Yup.string().required("Value is required"),
    }),
    onSubmit: (values, { resetForm }) => {
      dispatch(postConstant(values))
        .unwrap()
        .then(() => {
          setShowSuccess(true);
          resetForm();
          router.push('/constants/constantsList')
        })
        .catch((err) => {
          alert("Failed to add constant: " + err);
        });
    },
  });

  const getInputClass = (field: keyof typeof formik.values) =>
    `form-control ${formik.touched[field] && formik.errors[field] ? "is-invalid" : ""}`;

  return (
    <div className="container mt-4">
      <h1>Add Constants</h1>
      <form onSubmit={formik.handleSubmit}>
        <div className="form-group mb-3">
          <label htmlFor="type">Type</label>
          <select
            id="type"
            name="type"
            className={getInputClass("type")}
            value={formik.values.type}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <option value="">Select Type</option>
            <option value="tag">Tag</option>
            <option value="status">Status</option>
            <option value="source">Source</option>
          </select>
          {formik.touched.type && formik.errors.type && (
            <div className="invalid-feedback">{formik.errors.type}</div>
          )}
        </div>

        <div className="form-group mb-3">
          <label htmlFor="label">Label</label>
          <input
            type="text"
            id="label"
            name="label"
            className={getInputClass("label")}
            value={formik.values.label}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.label && formik.errors.label && (
            <div className="invalid-feedback">{formik.errors.label}</div>
          )}
        </div>

        <div className="form-group mb-4">
          <label htmlFor="value">Value</label>
          <input
            type="text"
            id="value"
            name="value"
            className={getInputClass("value")}
            value={formik.values.value}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.value && formik.errors.value && (
            <div className="invalid-feedback">{formik.errors.value}</div>
          )}
        </div>

        <button type="submit" className="btn btn-primary">
          Add Constant
        </button>
      </form>

      {showSuccess && (
        <Notification
          title="Success"
          message="Constant added successfully!"
          type="success"
          position="bottom-center"
        />
      )}
    </div>
  );
};

export default AddConstants;
