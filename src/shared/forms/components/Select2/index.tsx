import { FC, useContext, useMemo } from 'react';
import { TextField, TextFieldProps, Autocomplete } from '@mui/material';
import PropTypes from 'prop-types';

import { defaultFieldConfig } from '../../config';
import FormContext from '../../contexts/FormContext';

interface IProps {
  name: string;
  label: string;
  options?: any[];
  identifyName?: string;
  identifyValue?: string;
  textFieldProps?: TextFieldProps;
  [x: string]: any;
}

const Select2: FC<IProps> = ({
  name,
  label,
  options,
  identifyName,
  identifyValue,
  textFieldProps,
  ...rest
}) => {
  const { form } = useContext(FormContext);
  const formValue = form.values[name];

  const defaultOptionValue = useMemo(() => {
    return {
      [identifyName]: '',
      [identifyValue]: '',
    };
  }, [identifyName, identifyValue]);

  const onSelectChange = (value: any) => {
    const item = value ? value[identifyValue] : null;
    form.setFieldValue(name, item);
  };

  const getValueOfAutocomplete = useMemo(() => {
    for (const option of options) {
      if (option[identifyValue] === formValue) {
        return option;
      }
    }

    return defaultOptionValue;
  }, [formValue, options, defaultOptionValue, identifyValue]);

  return (
    <Autocomplete
      {...rest}
      autoComplete
      value={getValueOfAutocomplete}
      isOptionEqualToValue={(option, value) =>
        option[identifyValue] === value[identifyValue]
      }
      getOptionLabel={(option) => option[identifyName]}
      options={formValue ? options : [defaultOptionValue, ...options]}
      filterSelectedOptions
      noOptionsText="Không tìm thấy kết quả"
      onChange={(e, value: any) => onSelectChange(value)}
      renderInput={(params) => (
        <TextField
          {...textFieldProps}
          {...params}
          {...defaultFieldConfig}
          label={label}
          error={form.touched[name] && Boolean(form.errors[name])}
          helperText={<>{form.touched[name] && form.errors[name]}</>}
        />
      )}
    />
  );
};

Select2.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  options: PropTypes.array,
  identifyName: PropTypes.string,
  identifyValue: PropTypes.string,
  textFieldProps: PropTypes.object,
};

Select2.defaultProps = {
  identifyName: 'name',
  identifyValue: 'id',
};

export default Select2;
