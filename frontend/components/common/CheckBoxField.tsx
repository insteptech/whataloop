import { useField, useFormikContext } from "formik";

const CheckBoxField = ({
  label,
  disabled,
  required,
  checked,
  ...props
}: any) => {
  const [field, meta] = useField(props);
  const { submitCount } = useFormikContext(); // get form submit count
  const isError = (meta.touched || submitCount > 0) && Boolean(meta.error);

  return (
    <div className="common-checkbox">
      <div className="checkbox-inner">
        <input
          {...field}
          {...props}
          checked={checked}
          className={` ${disabled ? "checkbox-disabled" : ""} `}
          disabled={disabled}
        />
        {label && (
          <label className="checkbox-label" htmlFor="rememberMe">
            {label}
          </label>
        )}
      </div>
      {isError && typeof meta.error === "string" && (
        <div className="common-error-msg">{meta.error}</div>
      )}
    </div>
  );
};

export default CheckBoxField;
