import SrcIcons from '@/assets/icons';
import { Select } from 'antd';
import clsx from 'clsx';
import Image from 'next/legacy/image';
import { useCallback } from 'react';

export interface IProps {
  title?: string;
  required?: boolean;
  options: any[];
  initialValue?: any;
  suffixIcon?: React.ReactNode;
  disabled?: boolean;
  showSearch?: boolean;
  dropdownClassName?: string;
  selectClassName?: string;
  placeholder?: string;
  onChange?: (value: any) => void;
  dropdownRender?: (menu: React.ReactNode) => React.ReactNode;
  wrapperClassName?: string;
}
const { Option } = Select;
export function CustomSelector(props: IProps) {
  const {
    title,
    required,
    initialValue,
    showSearch,
    suffixIcon,
    options,
    placeholder,
    wrapperClassName,
    selectClassName,
    disabled,
    onChange,
  } = props;
  const handleSelect = useCallback((value: string) => {
    const data = {
      selectedId: value,
      selected: options.find((item) => item.value === value),
    };

    onChange && onChange(value);
  }, []);
  return (
    <>
      <div
        className={clsx(
          'custom-selector flex w-full mb-[1rem] gap-3 flex-col flex-nowrap',
          wrapperClassName
        )}
      >
        {title && (
          <p className="block_title">
            {require && '*'}&nbsp;{title}
          </p>
        )}
        <Select
          defaultValue={initialValue ?? options[0]?.value}
          className={clsx(
            'rounded-[10px] bg-white w-full flex overflow-hidden z-[1] drop-shadow-[0_0px_7px_rgba(41,41,50,0.1)]',
            selectClassName
          )}
          size="large"
          showSearch={showSearch}
          bordered={false}
          disabled={disabled}
          placement="bottomLeft"
          onChange={handleSelect}
          placeholder={placeholder || 'Chọn'}
          direction="rtl"
          // search by label
          // filterOption={}
          dropdownAlign={{ offset: [0, 0] }}
          // dropdownClassName="pt-[9px]"
          suffixIcon={
            suffixIcon ? (
              suffixIcon
            ) : (
              <div>
                <Image
                  width={20}
                  height={20}
                  objectFit="cover"
                  src={SrcIcons.dropDown}
                  alt=""
                />
              </div>
            )
          }
        >
          {options &&
            options.map((item) => (
              <Option key={item.key} value={item.value}>
                {/* <Tooltip placement="topLeft" title={item.label}> */}
                <span className={clsx('font-[400] text-sm text-[#696974]')}>
                  {item.label}
                </span>
                {/* </Tooltip> */}
              </Option>
            ))}
        </Select>
      </div>
    </>
  );
}
