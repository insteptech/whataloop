import { useField, useFormikContext } from "formik";
import Image from "next/image";

const InputField = ({ label, EndIcon, disabled, required, ...props }: any) => {
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

      {EndIcon ? (
        <div className="form-group-inner">
          <input
            {...field}
            {...props}
            className={` ${disabled ? "input-disabled" : ""} ${
              EndIcon ? "end-icon-padding" : ""
            }`}
            disabled={disabled}
          />
          <span className="input-icon">
            <EndIcon fill="#6c757d" />
          </span>
        </div>
      ) : (
        <input
          {...field}
          {...props}
          className={` ${disabled ? "input-disabled" : ""}`}
          disabled={disabled}
        />
      )}

      {isError && <div className="common-error-msg">{meta.error}</div>}
    </div>
  );
};

export default InputField;
