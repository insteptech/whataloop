import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile, updateProfile } from '@/modules/userprofile/redux/actions/profileAction';
import Loader from '@/components/common/loader';
import Notification from '@/components/common/Notification';

const UserProfilePage = () => {
  const dispatch = useDispatch<any>();
  const { data: user, loading, error } = useSelector(
    (state: { profileReducer: { data: any; loading: boolean; error: string } }) => state.profileReducer
  );

  const [formData, setFormData] = useState({
    fullName: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token && !user?.fullName) {
      dispatch(fetchProfile(token));
    } else if (!token) {
      console.warn('No token found in localStorage');
    }
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      const result = await dispatch(updateProfile({ data: formData, token }));
      if (updateProfile.fulfilled.match(result)) {
        dispatch(fetchProfile(token)); 
      }
    }
  };
  
  if(loading){
      return (
      <Loader/>
      )
    }
   
    if (!user) return null;
  
  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: 'auto' }}>
      <h1 style={{ textAlign: 'center', color: '#333', marginBottom: '2rem' }}>Edit Your Profile</h1>

      <div
        style={{
          backgroundColor: '#f9f9f9',
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0 0 8px rgba(0,0,0,0.1)',
          position: 'relative',
        }}
      >
        <ProfileInput
          label="Full Name"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
        />
       <ProfileInput
  label="Account Type"
  name="account_type"
  value={user.account_type}
  disabled 
/>
        <ProfileInput label="Email" value={user.email} disabled />
        <ProfileInput label="Phone" value={user.phone} disabled />

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: '#555' }}>Profile Photo:</label>
          {user.photo_url ? (
            <img src={user.photo_url} alt="Profile" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '50%', border: '2px solid #ccc' }} />
          ) : (
            <span style={{ display: 'block', fontSize: '1rem', color: '#333' }}>No photo uploaded</span>
          )}
        </div>

        <button
          onClick={handleUpdate}
          style={{
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
          }}
        >
          Update
        </button>
      </div>
    </div>
  );
};

const ProfileInput = ({
  label,
  name,
  value,
  onChange,
  disabled = false,
}: {
  label: string;
  name?: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}) => (
  <div style={{ marginBottom: '1.5rem' }}>
    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: '#555' }}>{label}:</label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      style={{
        width: '100%',
        padding: '0.5rem',
        fontSize: '1rem',
        border: '1px solid #ccc',
        borderRadius: '6px',
        backgroundColor: disabled ? '#e9ecef' : '#fff',
        color: disabled ? '#495057' : '#000',
        cursor: disabled ? 'not-allowed' : 'text',
      }}
    />
  </div>
);

export default UserProfilePage;
