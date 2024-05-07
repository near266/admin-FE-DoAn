import { createContext } from 'react';

import { MessageType } from './types';

const SnackbarContext = createContext({
  showMessage: (message: string, type: MessageType) => {},
});

export default SnackbarContext;
