import { FC } from 'react';
import { Paper, Button } from '@mui/material';
import { useFormik } from 'formik';
import { useSelector, useDispatch } from 'react-redux';

import { appLibrary, authService } from '@/shared';
import { Form, TextInput, FileUpload, FormHelper } from '@/shared/forms';
import { useSnackbar } from '@/shared/snackbar';
import { IRootState, setAuthUser } from '@/store';
import { validationSchema } from './validationSchema';
import { SettingForm } from '../../models';
import styles from './styles.module.scss';

const UserInfo: FC<any> = () => {
  const me = useSelector((state: IRootState) => state.auth.me);
  const dispatch = useDispatch();
  const snackbar = useSnackbar();

  const settingForm = useFormik<SettingForm>({
    initialValues: new SettingForm(me),
    validationSchema,
    onSubmit: handleSubmit,
  });

  async function handleSubmit(formValues: SettingForm) {
    appLibrary.showloading();
    const res = await authService
      .updateMeInfo(formValues)
      .catch((errors) => {
        FormHelper.handleValidationErrors(settingForm, errors);
        snackbar.showMessage('Có lỗi, vui lòng kiểm tra lại thông tin', 'error');
      })
      .finally(() => appLibrary.hideloading());

    if (res?.code === 'SUCCESS') {
      dispatch(setAuthUser(res.payload));
      snackbar.showMessage('Cập nhật thông tin thành công', 'success');
    }
  }

  return (
    <Paper className={styles.box}>
      <div className={styles.box__title}>Thông tin cá nhân</div>
      <Form initForm={settingForm} onSubmit={settingForm.handleSubmit}>
        <TextInput
          required
          name="name"
          label="Tên đầy đủ"
          className={styles.inputField}
        />

        <TextInput
          required
          name="address"
          label="Địa chỉ"
          className={styles.inputField}
        />

        <TextInput
          required
          disabled
          name="email"
          label="Email"
          className={styles.inputField}
        />

        <TextInput
          required
          name="telephone"
          label="Số điện thoại"
          className={styles.inputField}
        />

        <TextInput
          multiline
          rows={4}
          name="information"
          label="Giới thiệu bản thân"
          className={styles.inputField}
        />

        <FileUpload
          uploadFolder="userAvatar"
          name="avatar"
          accept="image/*"
          placeholder="Chọn ảnh đại diện"
          className={styles.inputField}
        />

        <div className={styles.submitArea}>
          <Button
            type="submit"
            className={styles.submitArea__button}
            color="primary"
            variant="contained"
          >
            Cập nhật
          </Button>
        </div>
      </Form>
    </Paper>
  );
};

export default UserInfo;
