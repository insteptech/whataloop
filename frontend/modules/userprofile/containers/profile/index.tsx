import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  fetchProfile,
  updateProfile,
} from "@/modules/userprofile/redux/actions/profileAction";
import Loader from "@/components/common/loader";
import Notification from "@/components/common/Notification";

const validationSchema = Yup.object({
  fullName: Yup.string().trim().required("Full name is required"),
});

const UserProfilePage = () => {
  const dispatch = useDispatch<any>();
  const { data: user, loading } = useSelector(
    (state: { profileReducer: { data: any; loading: boolean } }) =>
      state.profileReducer
  );

  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const token = useMemo(() => localStorage.getItem("auth_token"), []);

  const formik = useFormik({
    initialValues: {
      fullName: user?.fullName || "",
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setShowSuccess(false);
      setShowError(false);
      const confirmUpdate = window.confirm(
        "Are you sure you want to update your profile?"
      );

      if (token && confirmUpdate) {
        const result = await dispatch(updateProfile({ data: values, token }));
        if (updateProfile.fulfilled.match(result)) {
          dispatch(fetchProfile(token));
          setShowSuccess(true);
        } else {
          setShowError(true);
        }
      }
    },
  });

  useEffect(() => {
    if (token && !user?.fullName) {
      dispatch(fetchProfile(token));
    }
  }, [dispatch, token, user?.fullName]);

  if (loading) return <Loader />;
  if (!user) return null;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-card__header">
          <h1>User Profile</h1>
          <p>Manage your account information</p>
        </div>

        <div className="profile-card__content">
          <div className="profile-card__sidebar">
            <img
              src={user.photo_url || "/default-avatar.png"}
              alt="Profile"
              className="profile-avatar"
            />
            <div className="user-info">
              <div className="user-info__name">
                {user.fullName || "User Name"}
              </div>
              <div className="user-info__role">
                {user.account_type || "Member"}
              </div>
            </div>
          </div>

          <div className="profile-card__form">
            <form onSubmit={formik.handleSubmit}>
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  className="form-control"
                  value={formik.values.fullName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.fullName && formik.errors.fullName && (
                  <div className="error-message">
                    {typeof formik.errors.fullName === "string" && formik.errors.fullName}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="text"
                  className="form-control"
                  value={user.email || "Not provided"}
                  disabled
                />
              </div>

              <div className="form-group">
                <label>Account Type</label>
                <input
                  type="text"
                  className="form-control"
                  value={user.account_type || "Standard"}
                  disabled
                />
              </div>

              <button
                type="submit"
                className="submit-btn"
                disabled={formik.isSubmitting || !formik.dirty}
              >
                {formik.isSubmitting ? "Updating..." : "Update Profile"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {showSuccess && (
        <Notification
          title="Success"
          message="Profile updated successfully"
          type="success"
          position="top-right"
        />
      )}

      {showError && (
        <Notification
          title="Error"
          message="Failed to update profile. Please try again."
          type="error"
          position="top-right"
        />
      )}
    </div>
  );
};

export default UserProfilePage;
