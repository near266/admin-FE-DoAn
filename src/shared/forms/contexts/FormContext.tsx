import { createContext } from 'react';
import { FormikProps } from 'formik';

interface ContextType {
  form?: FormikProps<any>;
}

const FormContext = createContext<ContextType>({});

export default FormContext;
