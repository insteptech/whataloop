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
import { FiUser, FiMail, FiPhone, FiAward } from "react-icons/fi";

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
        <div className="profile-sidebar">
          {user.photo_url ? (
            <img src={user.photo_url} alt="Profile" className="profile-photo" />
          ) : (
            <div className="profile-photo-placeholder">
              <FiUser size={40} />
            </div>
          )}
          <h2 className="user-name">{user.fullName || "User Name"}</h2>
          <span className="user-role">
            {user.account_type || "Account Type"}
          </span>

          <div className="account-info">
            <div className="info-item">
              <FiMail className="info-icon" />
              <span>{user.email || "user@example.com"}</span>
            </div>
            <div className="info-item">
              <FiPhone className="info-icon" />
              <span>{user.phone || "+1234567890"}</span>
            </div>
          </div>
        </div>

        <div className="profile-content">
          <div className="profile-header">
            <h1>Edit Profile</h1>
            <p>Update your personal information and preferences</p>
          </div>

          <form className="profile-form" onSubmit={formik.handleSubmit}>
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
                <span className="error-message">{formik.errors.fullName}</span>
              )}
            </div>

            <button
              type="submit"
              className="submit-btn"
              disabled={formik.isSubmitting || !formik.dirty}
            >
              {formik.isSubmitting ? (
                <>
                  <span className="spinner"></span>
                  Updating...
                </>
              ) : (
                "Update Profile"
              )}
            </button>
          </form>
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
