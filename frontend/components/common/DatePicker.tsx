import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";

interface CustomDatePickerProps {
  label?: string;
  value?: Date | null;
  onChange?: (date: Date | null) => void;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  label = "Last Contacted",
  value = null,
  onChange = () => {},
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    value || new Date()
  );

  const handleChange = (date: Date | null) => {
    setSelectedDate(date);
    onChange(date);
  };

  return (
    <div className="date-picker-container">
      {label && <label className="date-picker-label">{label}</label>}
      <div className="date-picker-input-container">
        <FaCalendarAlt className="date-picker-icon" />
        <DatePicker
          selected={selectedDate}
          onChange={handleChange}
          className="date-picker-input"
          dateFormat="MMMM d, yyyy"
          popperPlacement="bottom-start"
          //   popperModifiers={{
          //     offset: {
          //       enabled: true,
          //       offset: "0px, 8px",
          //     },
          //   }}
        />
      </div>
    </div>
  );
};

export default CustomDatePicker;
