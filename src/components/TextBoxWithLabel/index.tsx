import clsx from 'clsx';
import React, { memo, useMemo } from 'react';

type Props = {
  name: string;
  textarea?: boolean;
  value?: string | number | readonly string[];
  label?: string;
  labelStyle?: string;
  inputStyle?: string;
  inputType?: React.HTMLInputTypeAttribute;
  onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onFocus?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
};

const TextBoxWithLabel = (props: Props) => {
  const {
    name,
    value,
    label,
    labelStyle,
    inputStyle,
    textarea,
    inputType,
    onChange,
    onFocus,
  } = props;
  const randomId = useMemo(() => Math.random().toFixed(2), []);
  return (
    <>
      <div className="form-input transition-all duration-200 ease-linear">
        <div className="relative">
          {textarea ? (
            <textarea
              name={`${name + randomId}`}
              value={value}
              id={`${name + randomId}`}
              onChange={onChange}
              onFocus={onFocus}
              className={clsx(
                'border-[2px] border-solid border-gray-300   py-4 text-[16px] tracking-[0.1px] leading-[18px]  focus:border-[#22216D] focus:border-[1.8px]  block px-[14px] pb-2.5 pt-4 w-full text-sm text-[#44444F] bg-transparent rounded-lg border-1 appearance-none focus:outline-none focus:ring-0  peer',
                inputStyle
              )}
              placeholder=" "
            />
          ) : (
            <input
              type={inputType}
              name={`${name + randomId}`}
              value={value}
              id={`${name + randomId}`}
              onChange={onChange}
              onFocus={onFocus}
              className={clsx(
                'border-[2px] border-solid border-gray-300   py-4 text-[16px] tracking-[0.1px] leading-[18px]  focus:border-[#22216D] focus:border-[1.8px]  block px-[14px] pb-2.5 pt-4 w-full text-sm text-[#44444F] bg-transparent rounded-lg border-1 appearance-none focus:outline-none focus:ring-0  peer',
                inputStyle
              )}
              placeholder=" "
            />
          )}
          <label
            htmlFor={`${name + randomId}`}
            className={clsx(
              'absolute duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1 label mx-1 px-[9px] !text-[16px] text-gray-400 cursor-text',
              labelStyle
            )}
          >
            {label}
          </label>
        </div>
      </div>
    </>
  );
};

export default memo(TextBoxWithLabel);
