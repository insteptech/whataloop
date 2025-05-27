import React, { useRef, useState } from "react";
import { ErrorMessage } from "formik";
import Image from "next/image";
import UploadIcon from "../../public/camera.png";


interface ImageUploadProps {
  name: string;
  label?: string;
  onChange?: (file: File | null) => void;
  file?: File | null; 
}

const ImageUpload: React.FC<ImageUploadProps> = ({ name, label, onChange, file }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string>(
    file instanceof File ? URL.createObjectURL(file) : UploadIcon.src
  );
  const [isUploaded, setIsUploaded] = useState<boolean>(file instanceof File);

  const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      setPreview(URL.createObjectURL(selectedFile));
      setIsUploaded(true);
      if (onChange) {
        onChange(selectedFile);
      }
    }
  };

  const overlayClass = isUploaded ? "" : "with-overlay";

  return (
    <div className="profile-icon row justify-content-center mb-4">
      <div className="col-md-4 text-center">
        <label htmlFor={name} style={{ cursor: "pointer" }}>
          <div className={`image-container ${overlayClass}`}>
            <img
              src={preview}
              alt="Profile"
              width={70}
              height={70}
              style={{
                width: overlayClass ? "70px" : "100%",
                height: overlayClass ? "70px" : "100%",
                borderRadius: overlayClass ? "0px" : "100%",
              }}
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
        <ErrorMessage name={name} component="div" className="text-danger small" />
      </div>
    </div>
  );
};


export default ImageUpload;
