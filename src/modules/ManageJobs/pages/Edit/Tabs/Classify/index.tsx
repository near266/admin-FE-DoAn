import SrcIcons from '@/assets/icons';
import { User } from '@nextui-org/react';
import { Button, Form, Input } from 'antd';
import { Checkbox } from '@nextui-org/react';
import React from 'react';

interface IProps {
  item?: any;
}

export function Classify({ item }: IProps) {
  return (
    <>
      <div className="min-w-[900px]">
        <Form
          autoComplete="off"
          onFinish={() => {}}
          onFinishFailed={() => {}}
          className="flex flex-col gap-[8px]"
        >
          <h3 className="font-[600] text-[28px] leading-title">Phân loại tài khoản</h3>
          <div className="campaign">
            <p className="font-[400] mb-3 text-xl ">Chọn gói</p>
            <Form.Item name="email" className="w-full">
              <Input
                size="large"
                placeholder="Gói đăng tin nâng cao"
                className="rounded-[10px] bg-white w-full"
                allowClear
              />
            </Form.Item>
          </div>

          <div className="flex flex-col w-full gap-[10px]">
            <p className="font-[400] mb-1 text-xl ">Quyền hạn</p>
            <Checkbox
              radioGroup="createCoupon"
              label="Full Time Jobs"
              name="createCoupon"
              onChange={() => {}}
              aria-label="Checkbox"
              color="success"
            />
            <Checkbox
              label="Part Time Jobs"
              radioGroup="createCoupon"
              name="createCoupon"
              onChange={() => {}}
              aria-label="Checkbox"
              color="success"
            />
            <Checkbox
              label="Part Time Jobs"
              radioGroup="createCoupon"
              name="createCoupon"
              onChange={() => {}}
              aria-label="Checkbox"
              color="success"
            />
            <Checkbox
              label="Part Time Jobs"
              radioGroup="createCoupon"
              name="createCoupon"
              onChange={() => {}}
              aria-label="Checkbox"
              color="success"
            />
          </div>

          <div className="flex flex-row ml-auto gap-4">
            <Form.Item>
              <Button
                className="bg-primary hover:bg-primary text-white hover:text-white focus:bg-primary focus:text-white rounded-[10px] font-[600] leading-[21px] flex justify-center items-center w-auto px-[20px] py-[20px] drop-shadow-[0_0px_7px_rgba(41,41,50,0.1)]"
                htmlType="reset"
              >
                Lưu thay đổi
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>
    </>
  );
}
