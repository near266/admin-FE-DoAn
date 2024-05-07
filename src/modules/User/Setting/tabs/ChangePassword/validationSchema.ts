import { object, string, ref } from 'yup';

export const validationSchema = object({
  password: string().required('Mật khẩu hiện tại không được để trống'),
  new_password: string()
    .required('Mật khẩu mới không được để trống')
    .min(6, 'Mật khẩu phải có ít nhất 6 kí tự'),
  new_password_confirmation: string()
    .required('Vui lòng nhập lại mật khẩu mới')
    .oneOf([ref('new_password'), null], 'Mật khẩu nhập lại không khớp'),
});
