import clsx from 'clsx';
import React from 'react';

type Props = {
  name: string;
  value?: string | number | readonly string[];
  label?: any;
  labelStyle?: string;
  inputStyle?: string;
  placeholder?: string;
  disabled?: boolean;
  inputType?: React.HTMLInputTypeAttribute;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
};

const InputStickLabel = (props: Props) => {
  const {
    name,
    value,
    label,
    placeholder,
    labelStyle,
    inputStyle,
    disabled,
    inputType,
    onChange,
    onFocus,
  } = props;
  return (
    <>
      <div className="form-input transition-all duration-200 ease-linear">
        <div className="relative">
          <label
            htmlFor={name}
            className={clsx(
              'block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300',
              labelStyle
            )}
          >
            {label}
          </label>
          <input
            type={inputType}
            name={name}
            disabled={disabled}
            value={value}
            id={name}
            onChange={onChange}
            onFocus={onFocus}
            className={clsx(
              'border-[2px] border-solid  border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-[#2422be] block w-full p-2.5',
              inputStyle
            )}
            placeholder={placeholder}
          />
        </div>
      </div>
    </>
  );
};

export default InputStickLabel;
