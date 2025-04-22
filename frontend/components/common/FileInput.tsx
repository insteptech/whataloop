import { useField, useFormikContext } from "formik";
import Image from "next/image";

const FileInput = ({
  label,
  StartIcon,
  EndIcon,
  disabled,
  required,
  ...props
}: any) => {
  const [field, meta] = useField(props);
  const { submitCount } = useFormikContext(); // get form submit count
  const isError = (meta.touched || submitCount > 0) && Boolean(meta.error);

  return (
    <div className="common-input-group">
      {label && (
        <label className="common-form-label">
          {label} {required && <span>*</span>}
        </label>
      )}

      <div className="form-group-inner">
        <input
          {...field}
          {...props}
          className={` ${disabled ? "input-disabled" : ""} ${
            StartIcon ? "end-icon-padding" : ""
          }`}
          disabled={disabled}
        />
        {StartIcon && (
          <span className="input-icon">
            <StartIcon fill="#6c757d" />
          </span>
        )}
        {EndIcon && (
          <span className="input-icon end-icon-position">
            <EndIcon fill="#6c757d" />
          </span>
        )}
      </div>

      {isError && <div className="common-error-msg">{meta.error}</div>}
    </div>
  );
};

export default FileInput;
