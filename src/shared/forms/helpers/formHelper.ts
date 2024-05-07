import { AxiosError } from 'axios';
import { FormikProps } from 'formik';
import { forOwn } from 'lodash-es';

const injectErrorsIntoFields = (form: FormikProps<any>, errors: AxiosError) => {
  const responseErrors = errors.response;
  if (responseErrors && responseErrors.status === 422) {
    forOwn(responseErrors.data.errors, (message, field) => {
      form.setFieldError(field, message);
    });
  }
};

export const handleValidationErrors = (form: FormikProps<any>, errors: AxiosError) => {
  injectErrorsIntoFields(form, errors);
  return errors.response;
};
