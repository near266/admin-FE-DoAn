import { FC, useContext, useState } from 'react';
import { TextField, InputAdornment, IconButton, InputProps } from '@mui/material';
import PropTypes from 'prop-types';

import FormContext from '../../contexts/FormContext';
import { defaultFieldConfig, SIZE } from '../../config';

interface IProps {
  name: string;
  InputProps?: InputProps;
  [x: string]: any;
}

const PasswordInput: FC<IProps> = ({ name, InputProps, ...rest }) => {
  const { form } = useContext(FormContext);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <TextField
      {...rest}
      {...defaultFieldConfig}
      name={name}
      value={form.values[name]}
      onChange={form.handleChange}
      type={showPassword ? 'text' : 'password'}
      InputProps={{
        ...InputProps,
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={() => setShowPassword(!showPassword)}
              size={SIZE}
            >
              {showPassword ? (
                <i className="bi bi-eye" />
              ) : (
                <i className="bi bi-eye-slash" />
              )}
            </IconButton>
          </InputAdornment>
        ),
      }}
      error={form.touched[name] && Boolean(form.errors[name])}
      helperText={<>{form.touched[name] && form.errors[name]}</>}
    />
  );
};

PasswordInput.propTypes = {
  name: PropTypes.string.isRequired,
  InputProps: PropTypes.object,
};

export default PasswordInput;
