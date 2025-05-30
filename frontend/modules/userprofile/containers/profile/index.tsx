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
import ConfirmationPopup from "@/components/common/ConfirmationPopUp";
import Image from "next/image";

// Validation Schema
const validationSchema = Yup.object({
  fullName: Yup.string().trim().required("Full name is required"),
});

const UserProfilePage: React.FC = () => {
  const dispatch = useDispatch<any>();
  const { data: user, loading } = useSelector(
    (state: { profileReducer: { data: any; loading: boolean } }) =>
      state.profileReducer
  );

  const token = useMemo(() => localStorage.getItem("auth_token"), []);
  const BACKEND_URL = 'http://localhost:3000';

  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingValues, setPendingValues] = useState<{ fullName: string } | null>(
    null
  );
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    user?.photo_url ? `${BACKEND_URL}${user.photo_url}` : "/default-avatar.png"
  );

  // Fetch profile if not loaded yet
  useEffect(() => {
    if (token && !user?.fullName) {
      dispatch(fetchProfile(token));
    }
  }, [dispatch, token, user?.fullName]);

  // Update image preview when user changes
  useEffect(() => {
    if (user?.photo_url && !image) {
      setImagePreview(`${BACKEND_URL}${user.photo_url}`);
    }
  }, [user?.photo_url, image]);

  // Cleanup notification flags on unmount
  useEffect(() => {
    return () => {
      setShowSuccess(false);
      setShowError(false);
      setShowConfirm(false);
    };
  }, []);

  // Formik setup
  const formik = useFormik({
    initialValues: {
      fullName: user?.full_name || "",
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: (values) => {
      setPendingValues(values);
      setShowConfirm(true);
    },
  });

  // Handle confirm update
  const handleConfirmUpdate = async () => {
    if (!token || (!pendingValues && !image)) return;

    try {
      setShowSuccess(false);
      setShowError(false);

      const formData = new FormData();

      if (pendingValues) {
        formData.append("full_name", pendingValues.fullName);
      }

      if (image) {
        formData.append("photo", image);
      }

      const result = await dispatch(
        updateProfile({ data: formData, token })
      );

      if (updateProfile.fulfilled.match(result)) {
        dispatch(fetchProfile(token)); // Refetch latest profile
        setShowSuccess(true);
      } else {
        setShowError(true);
      }
    } catch (error) {
      setShowError(true);
    } finally {
      setShowConfirm(false);
      setPendingValues(null);
      setImage(null);
    }
  };

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
            <div className="avatar-wrapper">
              <Image
                src={imagePreview || "/default-avatar.png"}
                alt="Profile"
                width={120}
                height={120}
                className="profile-avatar"
              />
              <label htmlFor="image-upload" className="change-photo-btn">
                Change Photo
              </label>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setImage(file);
                    setImagePreview(URL.createObjectURL(file));
                  }
                }}
                style={{ display: "none" }}
              />
            </div>

            <div className="user-info">
              <div className="user-info__name">
                {user.full_name || "User Name"}
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
                    {typeof formik.errors.fullName === "string"
                      ? formik.errors.fullName
                      : Array.isArray(formik.errors.fullName)
                        ? formik.errors.fullName.join(", ")
                        : null}
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
                <label>Phone</label>
                <input
                  type="text"
                  className="form-control"
                  value={user.phone || "Not provided"}
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
                disabled={formik.isSubmitting && !formik.dirty && !image}
              >
                {formik.isSubmitting ? "Updating..." : "Update Profile"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {showSuccess && (
        <Notification
          title="Success"
          message="Profile updated successfully"
          type="success"
          position="top-right"
          onClose={() => setShowSuccess(false)}
        />
      )}

      {showError && (
        <Notification
          title="Error"
          message="Failed to update profile. Please try again."
          type="error"
          position="top-right"
          onClose={() => setShowError(false)}
        />
      )}

      {/* Confirmation Popup */}
      <ConfirmationPopup
        visible={showConfirm}
        onAccept={handleConfirmUpdate}
        onReject={() => setShowConfirm(false)}
        message="Are you sure you want to update your profile?"
        header="Confirm Profile Update"
        type="alert"
      />
    </div>
  );
};

export default UserProfilePage;