import { useField, useFormikContext } from "formik";

const TextAreaField = ({ label, required, ...props }: any) => {
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
        <textarea
          {...field}
          {...props}
          className={`common-textarea ${isError ? "error" : ""}`}
        />
      </div>

      {isError && <div className="common-error-msg">{meta.error}</div>}
    </div>
  );
};

export default TextAreaField;
