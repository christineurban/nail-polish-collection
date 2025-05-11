import React from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { StyledDatePickerInput } from './index.styled';

export type DatePickerProps = {
  value: Date | undefined;
  onChange: (date: Date | null) => void;
  required?: boolean;
  placeholder?: string;
  name?: string;
  id?: string;
};

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  required = false,
  placeholder = 'Select date',
  name,
  id,
  ...rest
}) => {
  return (
    <ReactDatePicker
      selected={value}
      onChange={onChange}
      customInput={
        <StyledDatePickerInput
          required={required}
          placeholder={placeholder}
          name={name}
          id={id}
        />
      }
      dateFormat="yyyy-MM-dd"
      placeholderText={placeholder}
      withPortal
      {...rest}
    />
  );
};
