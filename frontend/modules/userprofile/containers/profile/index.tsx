import React, { useEffect, useState, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  fetchProfile,
  updateProfile,
} from "@/modules/userprofile/redux/actions/profileAction";
import Loader from "@/components/common/loader";
import Notification from "@/components/common/Notification";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiEdit,
  FiCamera,
  FiLock,
  FiGlobe,
} from "react-icons/fi";

const validationSchema = Yup.object({
  fullName: Yup.string().trim().required("Full name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone: Yup.string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .required("Phone is required"),
  password: Yup.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: Yup.string().oneOf(
    [Yup.ref("password"), null],
    "Passwords must match"
  ),
  bio: Yup.string().max(200, "Bio must be less than 200 characters"),
  website: Yup.string().url("Must be a valid URL"),
});

const UserProfilePage = () => {
  const dispatch = useDispatch<any>();
  const { data: user, loading } = useSelector(
    (state: { profileReducer: { data: any; loading: boolean } }) =>
      state.profileReducer
  );

  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const token = useMemo(() => localStorage.getItem("auth_token"), []);

  const formik = useFormik({
    initialValues: {
      fullName: user?.fullName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      password: "",
      confirmPassword: "",
      bio: user?.bio || "",
      website: user?.website || "",
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setShowSuccess(false);
      setShowError(false);

      try {
        // Prepare form data (including file if avatar was changed)
        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => {
          if (value) formData.append(key, value);
        });

        if (fileInputRef.current?.files?.[0]) {
          formData.append("avatar", fileInputRef.current.files[0]);
        }

        const result = await dispatch(
          updateProfile({
            data: formData,
            token,
            isMultipart: true,
          })
        );

        if (updateProfile.fulfilled.match(result)) {
          dispatch(fetchProfile(token));
          setShowSuccess(true);
          setIsEditing(false);
          setAvatarPreview(null);
        } else {
          setShowError(true);
        }
      } catch (error) {
        setShowError(true);
      }
    },
  });

  useEffect(() => {
    if (token && !user?.fullName) {
      dispatch(fetchProfile(token));
    }
  }, [dispatch, token, user?.fullName]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleEditing = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      // Reset password fields when exiting edit mode
      formik.setFieldValue("password", "");
      formik.setFieldValue("confirmPassword", "");
    }
  };

  if (loading) return <Loader />;
  if (!user) return null;

  return (
    <div className="profile-editor">
      <div className="profile-editor__container">
        <div className="profile-editor__header">
          <button
            className="edit-toggle"
            onClick={toggleEditing}
            aria-label={isEditing ? "Cancel editing" : "Edit profile"}
          >
            <FiEdit />
          </button>
          <h1>My Profile</h1>
          <p>Manage your personal information and settings</p>
        </div>

        <div className="profile-editor__content">
          <div className="profile-editor__sidebar">
            <div
              className="avatar-upload"
              onClick={() => fileInputRef.current?.click()}
            >
              <img
                src={avatarPreview || user.photo_url || "/default-avatar.jpg"}
                alt="Profile"
                className="avatar-upload__preview"
              />
              <div className="avatar-upload__overlay">
                <FiCamera size={24} />
              </div>
              <input
                type="file"
                ref={fileInputRef}
                className="file-input"
                onChange={handleAvatarChange}
                accept="image/*"
                disabled={!isEditing}
              />
            </div>

            <div className="user-meta">
              <div className="user-meta__name">
                {user.fullName || "User Name"}
              </div>
              <div className="user-meta__role">
                {user.account_type || "Member"}
              </div>
            </div>
          </div>

          <div className="profile-editor__form">
            <form onSubmit={formik.handleSubmit}>
              <div className="form-section">
                <h3 className="form-section__title">
                  <FiUser /> Personal Information
                </h3>
                <div className="form-grid">
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
                      disabled={!isEditing}
                    />
                    {formik.touched.fullName && formik.errors.fullName && (
                      <div className="error-message">
                        {formik.errors.fullName}
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      className="form-control"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      disabled={!isEditing}
                    />
                    {formik.touched.email && formik.errors.email && (
                      <div className="error-message">{formik.errors.email}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">Phone Number</label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      className="form-control"
                      value={formik.values.phone}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      disabled={!isEditing}
                    />
                    {formik.touched.phone && formik.errors.phone && (
                      <div className="error-message">{formik.errors.phone}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="bio">Bio</label>
                    <textarea
                      id="bio"
                      name="bio"
                      className="form-control"
                      value={formik.values.bio}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      disabled={!isEditing}
                      rows={3}
                    />
                    {formik.touched.bio && formik.errors.bio && (
                      <div className="error-message">{formik.errors.bio}</div>
                    )}
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="form-section">
                  <h3 className="form-section__title">
                    <FiLock /> Change Password
                  </h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="password">New Password</label>
                      <input
                        id="password"
                        name="password"
                        type="password"
                        className="form-control"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Leave blank to keep current"
                      />
                      {formik.touched.password && formik.errors.password && (
                        <div className="error-message">
                          {formik.errors.password}
                        </div>
                      )}
                    </div>

                    <div className="form-group">
                      <label htmlFor="confirmPassword">Confirm Password</label>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        className="form-control"
                        value={formik.values.confirmPassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.confirmPassword &&
                        formik.errors.confirmPassword && (
                          <div className="error-message">
                            {formik.errors.confirmPassword}
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              )}

              {isEditing && (
                <div className="form-actions">
                  <button
                    type="button"
                    className="btn btn--secondary"
                    onClick={() => {
                      setIsEditing(false);
                      formik.resetForm();
                      setAvatarPreview(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn--primary"
                    disabled={formik.isSubmitting || !formik.dirty}
                  >
                    {formik.isSubmitting ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              )}
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
