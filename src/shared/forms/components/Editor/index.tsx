import { FC, useContext } from 'react';
import PropTypes from 'prop-types';
import { FormHelperText, FormControl } from '@mui/material';

import FormContext from '../../contexts/FormContext';
import { TextEditor } from '@/components';
import { VARIANT } from '../../config';

interface IProps {
  name: string;
  className?: string;
  placeholder?: string;
  [x: string]: any;
}

const Editor: FC<IProps> = ({ name, placeholder, className, ...rest }) => {
  const { form } = useContext(FormContext);

  const onEditorChange = (value: string) => {
    form.setFieldValue(name, value);
  };

  return (
    <FormControl
      error={form.touched[name] && Boolean(form.errors[name])}
      className={className}
      variant={VARIANT}
      fullWidth
    >
      <TextEditor
        value={form.values[name]}
        placeholder={placeholder}
        onChange={onEditorChange}
        {...rest}
      />
      {form.touched[name] && form.errors[name] && (
        <FormHelperText>{<>{form.touched[name] && form.errors[name]}</>}</FormHelperText>
      )}
    </FormControl>
  );
};

Editor.propTypes = {
  name: PropTypes.string.isRequired,
  className: PropTypes.string,
  placeholder: PropTypes.string,
};

Editor.defaultProps = {};

export default Editor;
