import React, { useRef, useState, useEffect } from "react";
import { ErrorMessage, useField } from "formik";
import Image from "next/image";
import defaultProfile from "../../public/user.png";

const ImageUpload = ({ name, label }) => {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(defaultProfile.src);

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setPreview(URL.createObjectURL(event.target.files[0]));
    }
  };

  return (
    <div className="profile-icon row justify-content-center mb-4">
      <div className="col-md-4 text-center">
        <label htmlFor={name} style={{ cursor: "pointer" }}>
          <Image
            src={preview}
            alt="Profile"
            width={100}
            height={100}
            className="rounded-circle object-fit-cover"
            style={{ width: "100px", height: "100px" }}
            priority
          />
        </label>
        <input
          id={name}
          name={name}
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={onImageChange}
          style={{ display: "none" }}
        />
        <ErrorMessage
          name={name}
          component="div"
          className="text-danger small"
        />
      </div>
    </div>
  );
};

export default ImageUpload;
