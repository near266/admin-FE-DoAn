import { LoadingOutlined } from '@ant-design/icons';
import { Select } from 'antd';
import type { SelectProps } from 'antd/es/select';
import { debounce } from 'lodash';
import React, { useMemo, useRef, useState } from 'react';

export interface DebounceSelectProps<ValueType = any>
  extends Omit<SelectProps<ValueType | ValueType[]>, 'options' | 'children'> {
  fetcherOptions: (search: string) => Promise<ValueType[]>;
  debounceTimeout?: number;
  mutilSelect?: boolean;
  onChange?: (value: ValueType | ValueType[]) => void;
  placeholder?: string;
}

function DebounceSelect<
  ValueType extends { key?: string; label: React.ReactNode; value: string | number } = any
>({ fetcherOptions, debounceTimeout = 800, ...props }: DebounceSelectProps<ValueType>) {
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState<ValueType[]>([]);
  const fetchRef = useRef(0);

  const debounceFetcher = useMemo(() => {
    const loadOptions = (value: string) => {
      fetchRef.current += 1;
      const fetchId = fetchRef.current;
      setOptions([]);
      setFetching(true);

      fetcherOptions(value).then((newOptions) => {
        console.log(newOptions);
        if (fetchId !== fetchRef.current) {
          // for fetch callback order
          return;
        }

        setOptions(newOptions);
        setFetching(false);
      });
    };

    return debounce(loadOptions, debounceTimeout);
  }, [fetcherOptions, debounceTimeout]);

  return (
    <Select
      labelInValue
      filterOption={false}
      onSearch={debounceFetcher}
      notFoundContent={
        fetching ? <LoadingOutlined style={{ fontSize: 24 }} spin /> : null
      }
      {...props}
      options={options}
    />
  );
}

interface OptionsValue {
  key: any;
  label: string;
  value: string;
}

const SelectSearch: React.FC<DebounceSelectProps> = ({
  mutilSelect,
  placeholder,
  fetcherOptions,
}: DebounceSelectProps) => {
  const [value, setValue] = useState<OptionsValue[]>([]);

  return (
    <DebounceSelect
      mode="multiple"
      size="large"
      value={value}
      placeholder={placeholder ?? 'Tìm kiếm'}
      fetcherOptions={fetcherOptions}
      onChange={(newValue) => {
        setValue(newValue as OptionsValue[]);
      }}
    />
  );
};

export default SelectSearch;
