import { isProduction } from './../shared/helpers/helper';
import { configureStore } from '@reduxjs/toolkit';

import { rootReducer } from './rootReducer';

const store = configureStore({
  reducer: rootReducer,
  devTools: isProduction() ? false : true,
});

export default store;
