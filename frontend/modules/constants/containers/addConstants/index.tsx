import React from "react";
import { useDispatch } from "react-redux";
import { postConstant } from "../../redux/action/constantAction";
import { useFormik } from "formik";
import * as Yup from "yup";

const AddConstants = () => {
  const dispatch = useDispatch<any>();

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
          alert("Constant added successfully!");
          resetForm();
        })
        .catch((err) => {
          alert("Failed to add constant: " + err);
        });
    },
  });

  return (
    <div className="container mt-4">
      <h1>Add Constants</h1>
      <form onSubmit={formik.handleSubmit}>
        <div className="form-group mb-3">
          <label htmlFor="type">Type</label>
          <select
            id="type"
            name="type"
            className={`form-control ${formik.touched.type && formik.errors.type ? "is-invalid" : ""}`}
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

        {/* Label Field */}
        <div className="form-group mb-3">
          <label htmlFor="label">Label</label>
          <input
            type="text"
            id="label"
            name="label"
            className={`form-control ${formik.touched.label && formik.errors.label ? "is-invalid" : ""}`}
            value={formik.values.label}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.label && formik.errors.label && (
            <div className="invalid-feedback">{formik.errors.label}</div>
          )}
        </div>

        {/* Value Field */}
        <div className="form-group mb-4">
          <label htmlFor="value">Value</label>
          <input
            type="text"
            id="value"
            name="value"
            className={`form-control ${formik.touched.value && formik.errors.value ? "is-invalid" : ""}`}
            value={formik.values.value}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.value && formik.errors.value && (
            <div className="invalid-feedback">{formik.errors.value}</div>
          )}
        </div>

        <button type="submit" className="btn btn-primary me-2">
          Add Constant
        </button>
      </form>
    </div>
  );
};

export default AddConstants;
