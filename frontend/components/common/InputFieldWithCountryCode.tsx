import { useField, useFormikContext } from "formik";
import { useState, useEffect } from "react";

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
  const [displayNumber, setDisplayNumber] = useState("");

  useEffect(() => {
    const currentValue = field.value || "";

    // Escape special characters in country code
    const escapedCountryCode = countryCode.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // Remove country code from the start of the phone number
    const cleanedValue = currentValue.replace(new RegExp(`^${escapedCountryCode}`), "");

    setDisplayNumber(cleanedValue);
  }, [field.value, countryCode]);

  // Handle input change (user types the number)
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace(/\D/g, ""); // Remove non-digits
    setDisplayNumber(inputValue);
    helpers.setValue(`${countryCode}${inputValue}`);
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
          onChange={(e) => {
            const newCode = e.target.value;
            setCountryCode(newCode);
            helpers.setValue(`${newCode}${displayNumber}`);
          }}
          disabled={disabled}
        >
          {countries.map((country) => (
            <option key={country.code} value={country.code}>
              {country.name} {country.code}
            </option>
          ))}
        </select>

        <input
          type="text"
          {...field}
          value={displayNumber}
          onChange={handlePhoneChange}
          placeholder={props.placeholder}
          disabled={disabled}
        />
      </div>

      {isError && <div className="common-error-msg">{meta.error}</div>}
    </div>
  );
};

export default InputFieldWithCountryCode;