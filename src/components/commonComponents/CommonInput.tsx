import { InputBoxType } from "@/types/CommonComponents";
import React, { FC } from "react";

const CommonInput: FC<InputBoxType> = ({
  inputType,
  label,
  placeholder,
  mainClass,
  ColClass,
  inputClass,
  name,
  id,
  value,
  defaultValue,
  onChange,
  autoComplete,
  required,
  disabled,
}) => {
  return (
    <div className={ColClass}>
      <div className={`${mainClass ? mainClass : ""}form-input`}>
        {label &&<label>{label}</label>}
        <div className={`select-button arrow-none`}>
          <input
            id={id}
            name={name}
            type={inputType}
            className={`form-control ${inputClass ?? ""}`}
            placeholder={placeholder}
            value={value}
            defaultValue={defaultValue}
            onChange={onChange}
            autoComplete={autoComplete}
            required={required}
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  );
};

export default CommonInput;
