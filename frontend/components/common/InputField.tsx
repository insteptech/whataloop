import { useField, useFormikContext } from "formik";
import Image from "next/image";

const InputField = ({
  label,
  StartIcon,
  EndIcon,
  disabled,
  required,
  EndImage,
  className,
  ...props
}: any) => {
  const [field, meta] = useField(props);
  const { submitCount } = useFormikContext(); // get form submit count
  const isError = (meta.touched || submitCount > 0) && Boolean(meta.error);
  const isRequiredError = required && !field.value;

  return (
    <div className="common-input-group">
      {label && (
        <label className="common-form-label">
          {label} {isRequiredError && <span>*</span>}
        </label>
      )}

      <div className={`form-group-inner ${className ? className : ""}`}>
        <input
          {...field}
          {...props}
          className={` ${disabled ? "input-disabled" : ""} ${
            StartIcon ? "end-icon-padding" : ""
          }  `}
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
            <Image src={EndImage} alt="" />
          </span>
        )}
        {EndImage && (
          <span className="input-icon end-icon-position">
            <Image src={EndImage} alt="" width={30} height={30} />
          </span>
        )}
      </div>

      {isError && <div className="common-error-msg">{meta.error}</div>}
    </div>
  );
};

export default InputField;
