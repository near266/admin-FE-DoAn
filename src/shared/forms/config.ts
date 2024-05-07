import { TextFieldProps } from '@mui/material';

export const VARIANT = 'outlined';
export const SIZE = 'small';
export const FULL_WIDTH = true;

export const defaultFieldConfig: TextFieldProps = {
  variant: VARIANT,
  fullWidth: FULL_WIDTH,
  size: SIZE,
  // InputLabelProps: {
  //   shrink: true,
  // },
};
