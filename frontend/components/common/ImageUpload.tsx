import React, { useRef, useState, useEffect } from "react";
import { ErrorMessage, useField } from "formik";
import Image from "next/image";
import defaultProfile from "../../public/user.png";
import UploadIcon from "../../public/camera.png";

const ImageUpload = ({ name, label }) => {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(UploadIcon.src);
  const [isUploaded, setIsUploaded] = useState(false);

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setPreview(URL.createObjectURL(event.target.files[0]));
      setIsUploaded(true);
    }
  };

  const overlayClass = isUploaded ? "" : "with-overlay";

  return (
    <div className="profile-icon row justify-content-center mb-4">
      <div className="col-md-4 text-center">
        <label htmlFor={name} style={{ cursor: "pointer" }}>
          <div className={`image-container ${overlayClass}`}>
            <Image
              src={preview}
              alt="Profile"
              width={70}
              height={70}
              className=""
              style={{
                width: overlayClass ? "70px" : "100%",
                height: overlayClass ? "70px" : "100%",
                borderRadius: overlayClass ? "0px" : "100%",
              }}
              priority
            />
          </div>
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
