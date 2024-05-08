import { FC, useState } from 'react';
import { Paper, Button } from '@mui/material';
import { useFormik } from 'formik';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Input, message, Select } from 'antd';
import { redirect } from 'next/navigation';
import { appLibrary } from '@/shared/utils/loading';

import { useSnackbar } from '@/hooks/snackbar';
import { IRootState, setAuthUser, asyncLogoutAuth } from '@/store';
import { validationSchema } from './validationSchema';
import { SettingForm } from '@/modules/User/Setting/models';
import styles from './styles.module.scss';
import { authService } from '@/shared/services';
import InputStickLabel from '@/components/InputStickLabel';
import { RESETPASSWORD } from '@/shared/enums/enums';
import { useRouter } from 'next/router';
import { AdminApi } from '@/shared/api';

const UserInfo: FC<any> = () => {
  const me = useSelector((state: IRootState) => state.auth.me);
  const dispatch = useDispatch();
  const logout = () => {
    dispatch(asyncLogoutAuth());
  };
  const { loading, data, succeeded } = useSelector((state: any) => state.login);

  const [form] = Form.useForm<RESETPASSWORD>();

  async function handleUpdate() {
    const formData = form.getFieldsValue();
    form.setFieldValue(RESETPASSWORD.UserName, data.userName);
    const payload = {
      UserName: data.userName,
      Password: formData[RESETPASSWORD.Password],
      oldPass: formData[RESETPASSWORD.oldPass],
      ConfirmPassword: formData[RESETPASSWORD.ConfirmPassword],
    };
    try {
      appLibrary.showloading();
      const res = await AdminApi.updateAccountAdmin(payload);
      if (res?.succeeded) {
        message.success('Cập nhật tài khoản thành công');
        localStorage.removeItem('jwtToken');
        logout();
      }
      appLibrary.hideloading();
    } catch (error) {
      appLibrary.hideloading();
      message.error('Mật khẩu cũ không trùng khớp');
      return;
    }

    //appLibrary.showloading();
  }
  return (
    <Paper className={styles.box}>
      <div className={styles.box__title}>Thông tin cá nhân</div>
      <Form
        form={form}
        name="basic"
        autoComplete="off"
        className="flex flex-col gap-[8px]"
      >
        <div className="form-input w-full flex flex-col gap-4 mb-[100px] mt-5">
          <div className="flex flex-col gap-4">
            <h3 className="font-[500] text-[#171725] text-[24px] leading-[32px]">
              Thay đổi gmail
            </h3>
            <div>
              <Form.Item>
                <InputStickLabel
                  name={RESETPASSWORD.UserName}
                  label={
                    <p className="font-[400] text-[16px] leading-[24px] text-[#44444F]">
                      Email
                    </p>
                  }
                  placeholder={data?.email}
                  inputType="email"
                  disabled
                />
              </Form.Item>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div>
              <p className="font-[400] text-[16px] leading-[24px] text-[#44444F]">
                Mật khẩu hiện tại
              </p>
              <Form.Item
                name={RESETPASSWORD.oldPass}
                rules={[
                  {
                    required: true,
                    message: 'Mật khẩu không được bỏ trống!',
                  },
                  {
                    min: 8,
                    message: 'Mật khẩu phải có ít nhất 8 ký tự!',
                  },
                ]}
              >
                <Input.Password
                  size="large"
                  className="py-[9px]"
                  placeholder="Mật khẩu"
                  onChange={(e) => {
                    form.setFields([
                      { name: RESETPASSWORD.oldPass, value: e.target.value },
                      { name: RESETPASSWORD.UserName, value: data?.userName },
                    ]);
                  }}
                />
              </Form.Item>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div>
              <p className="font-[400] text-[16px] leading-[24px] text-[#44444F]">
                Mật khẩu mới
              </p>
              <Form.Item
                name={RESETPASSWORD.Password}
                rules={[
                  {
                    required: true,
                    message: 'Mật khẩu không được bỏ trống!',
                  },
                  {
                    min: 8,
                    message: 'Mật khẩu phải có ít nhất 8 ký tự!',
                  },
                ]}
              >
                <Input.Password
                  size="large"
                  className="py-[9px]"
                  placeholder="Mật khẩu"
                />
              </Form.Item>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div>
              <p className="font-[400] text-[16px] leading-[24px] text-[#44444F]">
                Xác nhận lại mật khẩu
              </p>
              <Form.Item
                name={RESETPASSWORD.ConfirmPassword}
                rules={[
                  {
                    required: true,
                    message: 'Mật khẩu không được bỏ trống!',
                  },
                  {
                    min: 8,
                    message: 'Mật khẩu phải có ít nhất 8 ký tự!',
                  },
                ]}
              >
                <Input.Password
                  size="large"
                  className="py-[9px]"
                  placeholder="Mật khẩu"
                />
              </Form.Item>
            </div>
          </div>
          <button
            type="button"
            className=" bg-primary hover:bg-primary text-white hover:text-white rounded-[10px] font-[600] leading-[21px] flex px-[17px] py-[10px] justify-center items-center drop-shadow-[0_0px_7px_rgba(41,41,50,0.1)] focus:bg-primary focus:text-white focus:outline-none border-primary"
            onClick={handleUpdate}
          >
            Lưu thay đổi
          </button>
        </div>
      </Form>
    </Paper>
  );
};

export default UserInfo;
