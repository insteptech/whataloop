import React, { useRef, useState } from "react";
import { ErrorMessage } from "formik";
import Image from "next/image";
import UploadIcon from "../../public/camera.png";

interface ImageUploadProps {
  name: string;
  label?: string;
  onChange?: (file: File) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ name, label, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState(UploadIcon.src);
  const [isUploaded, setIsUploaded] = useState(false);

  const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      console.log(file, "file file");

      setPreview(URL.createObjectURL(file));
      setIsUploaded(true);
      if (onChange) {
        onChange(file); // Pass file to parent
      }
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
        <ErrorMessage name={name} component="div" className="text-danger small" />
      </div>
    </div>
  );
};

export default ImageUpload;
