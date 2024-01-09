import { Button, Form, message, UploadProps } from 'antd';
import type { UploadChangeParam } from 'antd/es/upload';
import type { RcFile, UploadFile } from 'antd/es/upload/interface';
import { useState } from 'react';

import FileUploader from '@/components/FileUpload';
import { Input } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { useEffect, useRef } from 'react';
import { FieldResponse, PayloadCreateField } from '../../shared/utils';
import { fieldService } from '../../shared/api';
import { debounce } from '@mui/material';

export interface IProps {
  field: FieldResponse;
}

export function EditFieldModule(props: IProps) {
  const { field } = props;
  const [editField, seteditField] = useState<FieldResponse>(field);
  const ref = useRef<HTMLDivElement>(null);
  const [form] = useForm();
  useEffect(() => {
    form.setFieldsValue({
      name: field.name,
      avatar: field.avatar,
    });
  }, [field]);

  const handleChange: UploadProps['onChange'] = (
    info: UploadChangeParam<UploadFile>
  ) => {};
  const handleSubmit = debounce(async (values: PayloadCreateField) => {
    for (const key in values) {
      if (Object.prototype.hasOwnProperty.call(values, key)) {
        const element = values[key];
        if (key === 'avatar' && !element)
          return message.error('Hãy thêm ảnh thubnail cho ngành!');
        if (key === 'name' && !element) return message.error('Hãy nhập tên cho ngành!');
      }
    }
    try {
      const formData = new FormData();
      formData.append('avatar', values.avatar.file?.originFileObj ?? values.avatar);
      formData.append('active', '0');
      formData.append('name', values.name);
      const res = await fieldService.updateField(editField.id, formData);
      if (res.name === values.name.trim()) {
        message.success('Đã sửa thành công');
      }
    } catch (error) {
      message.error('Đã có lỗi xảy ra!');
    }
  }, 500);
  const onFinish = async (values: PayloadCreateField) => {
    if (values.name === '') return message.error('Hãy nhập tên lĩnh vực!');
    handleSubmit(values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <>
      <div className="create-assessment">
        <div className="title text-title font-title tw-text-[20px]">
          Chỉnh sủa lĩnh vực
        </div>
        <Form
          form={form}
          autoComplete="off"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <div className="flex flex-col gap-[1rem] justify-between mt-5">
            <div className="flex gap-3 w-full flex-col ">
              <p className="block_title !text-[#171725] !text-[20px] leading-[30px] tracking-[0.1px] !font-[400]">
                Lĩnh vực
              </p>
              <Form.Item className="mb-0" name="name" initialValue={editField?.name}>
                <Input
                  size="large"
                  bordered={false}
                  defaultValue={editField?.name}
                  onChange={(e) => {
                    seteditField({ ...editField, name: e.target.value });
                  }}
                  placeholder="Nhập tên lĩnh vực"
                  className="rounded-[10px] !bg-white"
                  allowClear
                />
              </Form.Item>
            </div>
          </div>
          <div className="h-[1px] w-full bg-[#E2E2EA] rounded-[23px] "></div>
          <div className="flex mb-[1rem] gap-3 flex-col w-fit flex-nowrap mt-5">
            <p className="block_title !text-[#171725] !text-[20px] leading-[30px] tracking-[0.1px] !font-[400]">
              *Ảnh thumbnail
            </p>
            <Form.Item className="mb-0" name="avatar">
              <FileUploader onChange={handleChange} defaultImage={field.avatar} />
            </Form.Item>
          </div>
          <div className="container !my-10 ">
            <Button className="custom-button" htmlType="submit">
              Lưu
            </Button>
          </div>
        </Form>
      </div>
    </>
  );
}
