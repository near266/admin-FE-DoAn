import { useState, memo } from 'react';
import PropTypes from 'prop-types';
import { Snackbar } from '@mui/material';
import { Alert } from '@mui/material';

import SnackbarContext from './SnackbarContext';
import { MessageType, Notify } from './types';

const SnackbarProvider = ({ children }) => {
  const [notify, setNotify] = useState<Notify>({
    type: 'success',
    message: '',
  });
  const [open, setOpen] = useState<boolean>(false);

  const showMessage = (message: string, type: MessageType) => {
    setNotify((data) => {
      return {
        ...data,
        message,
        type,
      };
    });

    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <SnackbarContext.Provider value={{ showMessage }}>
        {children}
      </SnackbarContext.Provider>
      <Snackbar
        className="tw-z-[999999999999]"
        open={open}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        autoHideDuration={5000}
        onClose={handleClose}
      >
        <Alert
          elevation={6}
          variant="filled"
          onClose={handleClose}
          severity={notify.type}
        >
          {notify.message}
        </Alert>
      </Snackbar>
    </>
  );
};

SnackbarProvider.displayName = 'SnackbarProvider';

SnackbarProvider.propTypes = {
  children: PropTypes.node,
};

export default memo(SnackbarProvider);
