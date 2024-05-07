import { object, string } from 'yup';

export const validationSchema = object({
  name: string()
    .required('Tên không được để trống')
    .max(225, 'Chỉ được phép tối đa 255 kí tự'),
  address: string()
    .required('Địa chỉ không được để trống')
    .max(225, 'Chỉ được phép tối đa 255 kí tự'),
  telephone: string().required('Số điện thoại không được để trống'),
});
