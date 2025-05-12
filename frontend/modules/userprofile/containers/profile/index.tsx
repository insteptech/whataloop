import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { fetchProfile, updateProfile } from '@/modules/userprofile/redux/actions/profileAction';
import Loader from '@/components/common/loader';
import Notification from '@/components/common/Notification';

const validationSchema = Yup.object({
  fullName: Yup.string().trim().required('Full name is required'),
});

const UserProfilePage = () => {
  const dispatch = useDispatch<any>();
  const { data: user, loading } = useSelector(
    (state: { profileReducer: { data: any; loading: boolean } }) => state.profileReducer
  );

  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const token = useMemo(() => localStorage.getItem('auth_token'), []);

  const formik = useFormik({
    initialValues: {
      fullName: user?.fullName || '',
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setShowSuccess(false);
      setShowError(false);
      const confirmUpdate = window.confirm('Are you sure you want to update your profile?');

      if (token) {
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
    <div style={styles.container}>
      <h1 style={styles.header}>Edit Your Profile</h1>

      <form onSubmit={formik.handleSubmit} style={styles.form}>
        <ProfileInput
          label="Full Name"
          name="fullName"
          value={formik.values.fullName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.fullName && formik.errors.fullName}
        />

        <ProfileInput label="Account Type" value={user.account_type} disabled />
        <ProfileInput label="Email" value={user.email} disabled />
        <ProfileInput label="Phone" value={user.phone} disabled />

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={styles.label}>Profile Photo:</label>
          {user.photo_url ? (
            <img src={user.photo_url} alt="Profile" style={styles.profileImage} />
          ) : (
            <span style={styles.noPhotoText}>No photo uploaded</span>
          )}
        </div>

        <button type="submit" style={styles.submitButton}>Update</button>
      </form>

      {showSuccess && (
        <Notification
          title="Update"
          message="Profile updated successfully"
          type="success"
          position="bottom-center"
        />
      )}

      {showError && (
        <Notification
          title="Error"
          message="Failed to update profile. Please try again."
          type="error"
          position="bottom-center"
        />
      )}
    </div>
  );
};

const ProfileInput = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  disabled = false,
  error,
}: {
  label: string;
  name?: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  error?: string | false;
}) => (
  <div style={{ marginBottom: '1.5rem' }}>
    <label style={styles.label}>{label}:</label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      disabled={disabled}
      style={{
        ...styles.input,
        border: error ? '1px solid red' : styles.input.border,
        backgroundColor: disabled ? '#e9ecef' : '#fff',
        color: disabled ? '#495057' : '#000',
        cursor: disabled ? 'not-allowed' : 'text',
      }}
    />
    {error && <div style={styles.errorText}>{error}</div>}
  </div>
);

const styles = {
  container: {
    padding: '2rem',
    fontFamily: 'Arial, sans-serif',
    maxWidth: '600px',
    margin: 'auto',
  },
  header: {
    textAlign: 'center',
    color: '#333',
    marginBottom: '2rem',
  },
  form: {
    backgroundColor: '#f9f9f9',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 0 8px rgba(0,0,0,0.1)',
    position: 'relative',
  },
  label: {
    display: 'block',
    fontWeight: 'bold',
    marginBottom: '0.5rem',
    color: '#555',
  },
  input: {
    width: '100%',
    padding: '0.5rem',
    fontSize: '1rem',
    border: '1px solid #ccc',
    borderRadius: '6px',
  },
  errorText: {
    color: 'red',
    fontSize: '0.875rem',
    marginTop: '0.25rem',
  },
  profileImage: {
    width: '100px',
    height: '100px',
    objectFit: 'cover',
    borderRadius: '50%',
    border: '2px solid #ccc',
  },
  noPhotoText: {
    fontSize: '1rem',
    color: '#333',
  },
  submitButton: {
    position: 'absolute',
    bottom: '1rem',
    right: '1rem',
    padding: '0.8rem 1.5rem',
    backgroundColor: '#007BFF',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
};

export default UserProfilePage;
