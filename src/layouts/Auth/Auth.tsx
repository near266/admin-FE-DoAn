import { Common } from '@/shared/utils';
import { IRootState } from '@/store';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Link from 'next/link';
import SrcImages from '@/assets/images';
import { TextBoxWithLabel } from '@/components';
import Image from 'next/image';
import { Checkbox, Form, message } from 'antd';
import { FORM_DATA_FIELD } from '@/shared/enums/enums';
import { userLogin } from '@/shared/services';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from '@reduxjs/toolkit';
import { appLibrary } from '@/shared/utils/loading';

const Auth = ({ children }) => {
  const onAllStepComplete = () => {};

  const { loading, data, succeeded } = useSelector((state: any) => state.login);

  const dispatch = useDispatch();

  const [form] = Form.useForm();

  const handleLogin = async () => {
    const { email, password, remember_me } = form.getFieldsValue();

    if (!email || !password) {
      message.warning('Vui lòng nhập đầy đủ thông tin');
      return;
    }
    onLogin(email, password, remember_me);
  };
  const onLogin = async (
    email: FORM_DATA_FIELD.emails,
    password: FORM_DATA_FIELD.password,
    remember_me: boolean
  ) => {
    try {
      const thunkDispatch: ThunkDispatch<any, any, AnyAction> = dispatch;

      appLibrary.showloading();

      thunkDispatch(userLogin({ email, password }));

      appLibrary.hideloading();
    } catch (error) {
      message.error(error?.response?.data?.error ?? 'Đăng nhập thất bại');
    }
  };

  if (!succeeded) {
    return (
      <div className=" grid grid-cols-2 h-full m-auto max-w-[1310px] bg-white shadow-[3px_-5px_40px_rgba(205,205,212,0.1)] rounded-[20px] overflow-hidden">
        <div className="relative min-h-[645px] h-full w-full">
          <Image
            src={SrcImages.sideImage}
            alt="Youth"
            layout="fill"
            objectFit="fill"
            priority
          />
        </div>
        <div className="w-full">
          <div className="px-[27px] py-[36px] h-full flex flex-col">
            <Form
              className="w-full flex flex-col"
              onFinish={onAllStepComplete}
              form={form}
              autoComplete="off"
            >
              <div className="form-title mt-6">
                <h1 className="font-semibold text-3xl leading-[39px] text-gray-900">
                  Đăng nhập tài khoản
                </h1>
                <p className="text-[#696974] max-w-[467px] leading-[26px] font-[16px] mt-4">
                  Để tìm kiếm ứng viên phù hợp nhất cho doanh nghiệp, vui lòng điền thông
                  tin dưới đây
                </p>
              </div>
              <div className="steps-content mt-2">
                <div className="flex flex-col gap-4 mt-5">
                  <Form.Item
                    name="email"
                    className="w-full"
                    required
                    rules={[
                      {
                        required: true,
                        message: 'Email không được để trống',
                      },
                    ]}
                  >
                    <TextBoxWithLabel name="email" label="Tên đăng nhập" />
                  </Form.Item>
                  <Form.Item
                    name="password"
                    className="w-full"
                    required
                    rules={[
                      {
                        required: true,
                        message: 'Mật khẩu không được để trống',
                      },
                    ]}
                  >
                    <TextBoxWithLabel
                      name="password"
                      label="Mật khẩu"
                      inputType="password"
                    />
                  </Form.Item>

                  <div className="flex justify-between">
                    <Form.Item
                    //   name={FORM_DATA_FIELD.remember_me}
                    >
                      <Checkbox
                        onChange={(value) => {
                          // form.setFields([
                          //   {
                          //     // name: FORM_DATA_FIELD.remember_me,
                          //     value: value.target.checked,
                          //   },
                          // ]);
                          // console.log(form);
                        }}
                      >
                        <p className="font-light text-[16px] leading-[26px] text-gray-700">
                          Ghi nhớ đăng nhập
                        </p>
                      </Checkbox>
                    </Form.Item>
                    <Link href="/" legacyBehavior>
                      <span className="text-[#403ECC] hover:!text-[#403ECC]">
                        Quên mật khẩu
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </Form>
            <div className="steps-action flex m-auto mt-0">
              <button onClick={handleLogin}>Đăng nhập</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  // if (!isReady)
  //   return (
  //     <span className="text-center" aria-label="Loading ...">
  //       loading...
  //     </span>
  //   );

  return succeeded && data.roles.includes('Admin') ? (
    children
  ) : (
    <span className="text-center">Bạn không được phép truy cập!</span>
  );
};

export default Auth;
