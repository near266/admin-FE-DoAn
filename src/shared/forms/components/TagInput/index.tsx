import { FC, useContext } from 'react';
import { TextField, Chip, TextFieldProps, Autocomplete } from '@mui/material';
import PropTypes from 'prop-types';

import { defaultFieldConfig, SIZE } from '../../config';
import FormContext from '../../contexts/FormContext';
import styles from './styles.module.scss';

interface IProps {
  name: string;
  label?: string;
  placeholder?: string;
  textFieldProps?: TextFieldProps;
  [x: string]: any;
}

const TagInput: FC<IProps> = ({ name, label, placeholder, textFieldProps, ...rest }) => {
  const { form } = useContext(FormContext);

  const onInputChange = (value: any) => {
    form.setFieldValue(name, value);
  };

  return (
    <>
      <Autocomplete
        {...rest}
        multiple
        freeSolo
        value={form.values[name]}
        onChange={(e, value: any) => onInputChange(value)}
        options={[]}
        renderTags={(tagValues, getTagProps) =>
          tagValues.map((option, index) => (
            <Chip key={index} label={option} size={SIZE} {...getTagProps({ index })} />
          ))
        }
        renderInput={(params) => (
          <>
            <TextField
              {...textFieldProps}
              {...params}
              {...defaultFieldConfig}
              label={label}
              placeholder={placeholder}
              error={form.touched[name] && Boolean(form.errors[name])}
              helperText={<>{form.touched[name] && form.errors[name]}</>}
            />
            <div className={styles.tip}>
              <strong>Pro tip:</strong> Nhấn&nbsp;
              <span className={styles.tip__key}>Enter</span> để thêm tag
            </div>
          </>
        )}
      />
    </>
  );
};

TagInput.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  textFieldProps: PropTypes.object,
};

export default TagInput;
