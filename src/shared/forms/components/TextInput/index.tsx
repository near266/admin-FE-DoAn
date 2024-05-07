import { FC, useContext } from 'react';
import { TextField } from '@mui/material';
import PropTypes from 'prop-types';

import FormContext from '../../contexts/FormContext';
import { defaultFieldConfig } from '../../config';

interface IProps {
  name: string;
  [x: string]: any;
}

const TextInput: FC<IProps> = ({ name, ...rest }) => {
  const { form } = useContext(FormContext);

  return (
    <TextField
      {...rest}
      {...defaultFieldConfig}
      name={name}
      value={form.values[name]}
      onChange={form.handleChange}
      error={form.touched[name] && Boolean(form.errors[name])}
      helperText={<>{form.touched[name] && form.errors[name]}</>}
    />
  );
};

TextInput.propTypes = {
  name: PropTypes.string.isRequired,
};

export default TextInput;
