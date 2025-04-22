import { useField, useFormikContext } from "formik";

const SelectField = ({
  label,
  EndIcon,
  disabled,
  required,
  options = [],
  ...props
}: any) => {
  const [field, meta] = useField(props);
  const { submitCount } = useFormikContext();
  const isError = (meta.touched || submitCount > 0) && Boolean(meta.error);

  return (
    <div className="common-input-group">
      {label && (
        <label className="common-form-label">
          {label} {required && <span>*</span>}
        </label>
      )}

      <div className="form-group-inner">
        <select
          {...field}
          {...props}
          className={` ${disabled ? "input-disabled" : ""} ${
            EndIcon ? "end-icon-padding" : ""
          }`}
          disabled={disabled}
        >
          <option value="">Select {label?.toLowerCase()}</option>
          {options.map((option: any, index: number) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {EndIcon && (
          <span className="input-icon">
            <EndIcon fill="#6c757d" />
          </span>
        )}
      </div>

      {isError && <div className="common-error-msg">{meta.error}</div>}
    </div>
  );
};

export default SelectField;
