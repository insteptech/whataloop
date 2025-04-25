import { useField, useFormikContext } from "formik";
import Image from "next/image";
import { useState } from "react";

const countries = [
  { code: "+1", name: "US" },
  { code: "+91", name: "IN" },
  { code: "+44", name: "UK" },
  { code: "+61", name: "AU" },
  { code: "+81", name: "JP" },
];

const InputFieldWithCountryCode = ({
  label,
  disabled,
  required,
  className,
  ...props
}: any) => {
  const [field, meta, helpers] = useField(props);
  const { submitCount } = useFormikContext();
  const isError = (meta.touched || submitCount > 0) && Boolean(meta.error);

  const [countryCode, setCountryCode] = useState("+1");

  // Update phone number with country code prefix
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    helpers.setValue(`${countryCode}${newValue.replace(/^\+?\d*/, "")}`);
  };

  return (
    <div className="common-input-group">
      {label && (
        <label className="common-form-label">
          {label} {required && <span>*</span>}
        </label>
      )}

      <div className={`form-group-inner ${className ? className : ""}`}>
        <select
          className="country-code-select"
          value={countryCode}
          onChange={(e) => setCountryCode(e.target.value)}
          disabled={disabled}
        >
          {countries.map((country) => (
            <option key={country.code} value={country.code}>
              {country.name} {country.code}
            </option>
          ))}
        </select>

        <input
          {...field}
          {...props}
          className={` ${disabled ? "input-disabled" : ""}`}
          disabled={disabled}
        />
      </div>

      {isError && <div className="common-error-msg">{meta.error}</div>}
    </div>
  );
};

export default InputFieldWithCountryCode;
