import { FC } from 'react';
import { Paper, Button } from '@mui/material';
import { useFormik } from 'formik';
import { useRouter } from 'next/router';

//import { appLibrary, authService } from '@/shared';
import { Form, PasswordInput, FormHelper } from '@/shared/forms';
//import { useSnackbar } from '@/shared/snackbar';

import { appLibrary } from '@/shared/utils/loading';
import { validationSchema } from './validationSchema';
import { ChangePasswordForm } from '../../models';
import styles from './styles.module.scss';

const ChangePassword: FC<any> = () => {
  //const snackbar = useSnackbar();
  const router = useRouter();

  const myForm = useFormik<ChangePasswordForm>({
    initialValues: new ChangePasswordForm(),
    validationSchema,
    onSubmit: handleSubmit,
  });

  async function handleSubmit(formValues: ChangePasswordForm) {
    appLibrary.showloading();
    // const res = await authService
    //   .changePassword(formValues)
    //   .catch((errors) => {
    //     FormHelper.handleValidationErrors(myForm, errors);
    //     snackbar.showMessage('Có lỗi, vui lòng kiểm tra lại thông tin', 'error');
    //   })
    //   .finally(() => appLibrary.hideloading());

    // if (res?.code === 'SUCCESS') {
    //   // snackbar.showMessage('Thay đổi mật khẩu thành công', 'success');
    //   router.push('/');
    // }
  }

  return (
    <Paper className={styles.box}>
      <div className={styles.box__title}>Thay đổi mật khẩu</div>
      <Form initForm={myForm} onSubmit={myForm.handleSubmit}>
        <div className={styles.inputField}>
          <PasswordInput required name="password" label="Mật khẩu hiện tại" />
        </div>

        <div className={styles.inputField}>
          <PasswordInput required name="new_password" label="Mật khẩu mới" />
        </div>

        <div className={styles.inputField}>
          <PasswordInput
            required
            name="new_password_confirmation"
            label="Nhập lại mật khẩu mới"
          />
        </div>

        <div className={styles.submitArea}>
          <Button
            type="submit"
            className={styles.submitArea__button}
            color="primary"
            variant="contained"
          >
            Thay đổi
          </Button>
        </div>
      </Form>
    </Paper>
  );
};

export default ChangePassword;
