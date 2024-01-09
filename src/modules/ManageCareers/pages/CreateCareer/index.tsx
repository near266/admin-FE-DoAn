import { Button, Form, message, UploadProps } from 'antd';
import type { UploadChangeParam } from 'antd/es/upload';
import type { RcFile, UploadFile } from 'antd/es/upload/interface';
import { useState } from 'react';

import FileUploader from '@/components/FileUpload';
import { AssessmentType, SV_RES_STATUS_CODE } from '@/shared/enums/enums';
import { Input } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import TextArea from 'antd/lib/input/TextArea';
import { useEffect, useRef } from 'react';
import { PayloadCreateCareer } from '../../shared/utils';
import { CustomSelector } from '@/components/CustomSelector';
import { fieldService } from '@/modules/ManageFields/shared/api';
import { careerService } from '../../shared/api';

const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

export function CreateCareerModule() {
  const ref = useRef<HTMLDivElement>(null);

  const [fields, setFields] = useState([]);
  const [form] = useForm();
  const getFields = async () => {
    const { data } = await fieldService.getAllFields();
    setFields(
      data.map((field) => ({
        key: field.id,
        value: field.id,
        label: field.name,
      }))
    );
  };
  useEffect(() => {
    getFields();
  }, []);
  const handleSelect = (value: string) => {};
  const handleChange: UploadProps['onChange'] = (
    info: UploadChangeParam<UploadFile>
  ) => {};

  const onFinish = async (values) => {
    for (const key in values) {
      if (Object.prototype.hasOwnProperty.call(values, key)) {
        const element = values[key];
        if (!element) {
          return message.error('Hãy nhập đầy đủ thông tin!');
        }
      }
    }
    console.log('Success:', values);
    try {
      const formData = new FormData();
      formData.append('avatar', values.image_url.file?.originFileObj ?? values.image_url);
      formData.append('name', values.name);
      formData.append('active', '0');
      formData.append('description', values.description);
      formData.append('field_id', values.field_id.toString());
      formData.append('main_tasks', values.main_tasks);
      formData.append('required_competency', values.required_competency);
      formData.append('additional_competency', values.additional_competency);
      formData.append('minimum_education', values.minimum_education);
      formData.append('learning_path', values.learning_path);
      formData.append('area_of_expertise', values.area_of_expertise);
      formData.append('workplace_example', values.workplace_example);
      const { payload, code } = await careerService.createNewCareer(formData);
      if (code === SV_RES_STATUS_CODE.success) {
        message.success('Đã tạo thành công');
      }
    } catch (error) {
      console.log(error);
      message.error('Đã có lỗi xảy ra!');
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <>
      <div className="create-assessment">
        <div className="title text-title font-title tw-text-[20px]">Thêm nghề mới</div>
        <Form
          form={form}
          autoComplete="off"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <div className="flex flex-col gap-[1rem] justify-between mt-5">
            <div className="flex gap-3 w-full flex-col ">
              <p className="block_title !text-[#171725] !text-[20px] leading-[30px] tracking-[0.1px] !font-[400]">
                Tên nghề
              </p>
              <Form.Item className="mb-0" name="name">
                <Input
                  size="large"
                  bordered={false}
                  placeholder="Nhập tên nghề"
                  className="rounded-[10px] !bg-white"
                  allowClear
                />
              </Form.Item>
            </div>
            <div className="flex gap-3 w-full flex-col ">
              <p className="block_title !text-[#171725] !text-[20px] leading-[30px] tracking-[0.1px] !font-[400]">
                Lĩnh vực
              </p>
              <Form.Item name="field_id">
                <CustomSelector
                  placeholder="Chọn lĩnh vực"
                  onChange={handleSelect}
                  options={fields}
                />
              </Form.Item>
            </div>
          </div>
          <div className="h-[1px] w-full bg-[#E2E2EA] rounded-[23px] "></div>
          <div className="flex mb-[1rem] gap-3 flex-col w-fit flex-nowrap mt-5">
            <p className="block_title !text-[#171725] !text-[20px] leading-[30px] tracking-[0.1px] !font-[400]">
              *Ảnh thumbnail
            </p>
            <Form.Item className="mb-0" name="image_url">
              <FileUploader onChange={handleChange} />
            </Form.Item>
          </div>
          <div className="flex flex-col gap-6 !px-0">
            <div>
              <p className="block_title !text-[#171725] !text-[20px] leading-[30px] tracking-[0.1px] !font-[400]">
                Mô tả nghề
              </p>
              <Form.Item className="mb-0" name="description">
                <TextArea
                  rows={3}
                  allowClear
                  placeholder="Mô tả nghề"
                  className="rounded-[10px] resize-none w-full text-[#696974] custom_scrollbar "
                  onResize={() => {}}
                />
              </Form.Item>
            </div>
            <div>
              <p className="block_title !text-[#171725] !text-[20px] leading-[30px] tracking-[0.1px] !font-[400]">
                Nhiệm vụ chủ yếu
              </p>
              <Form.Item className="mb-0" name="main_tasks">
                <TextArea
                  rows={5}
                  allowClear
                  placeholder=" Nhiệm vụ chủ yếu"
                  className="rounded-[10px] resize-none w-full text-[#696974] custom_scrollbar "
                  onResize={() => {}}
                />
              </Form.Item>
            </div>
            <div>
              <p className="block_title !text-[#171725] !text-[20px] leading-[30px] tracking-[0.1px] !font-[400]">
                Năng lực thiết yếu
              </p>
              <Form.Item className="mb-0" name="required_competency">
                <Input
                  size="large"
                  bordered={false}
                  placeholder="Năng lực thiết yếu"
                  className="rounded-[10px] !bg-white"
                  allowClear
                />
              </Form.Item>
            </div>
            <div>
              <p className="block_title !text-[#171725] !text-[20px] leading-[30px] tracking-[0.1px] !font-[400]">
                Năng lực bổ sung
              </p>
              <Form.Item className="mb-0" name="additional_competency">
                <Input
                  size="large"
                  bordered={false}
                  placeholder="Năng lực bổ sung"
                  className="rounded-[10px] !bg-white"
                  allowClear
                />
              </Form.Item>
            </div>
            <div>
              <p className="block_title !text-[#171725] !text-[20px] leading-[30px] tracking-[0.1px] !font-[400]">
                Học vấn tối thiểu
              </p>
              <Form.Item className="mb-0" name="minimum_education">
                <Input
                  size="large"
                  bordered={false}
                  placeholder="Học vấn tối thiểu"
                  className="rounded-[10px] !bg-white"
                  allowClear
                />
              </Form.Item>
            </div>
            <div>
              <p className="block_title !text-[#171725] !text-[20px] leading-[30px] tracking-[0.1px] !font-[400]">
                Con đường học tập
              </p>
              <Form.Item className="mb-0" name="learning_path">
                <TextArea
                  rows={7}
                  allowClear
                  placeholder="Con đường học tập"
                  className="rounded-[10px] resize-none w-full text-[#696974] custom_scrollbar "
                  onResize={() => {}}
                />
              </Form.Item>
            </div>
            <div>
              <p className="block_title !text-[#171725] !text-[20px] leading-[30px] tracking-[0.1px] !font-[400]">
                Lĩnh vực chuyên sâu
              </p>
              <Form.Item className="mb-0" name="area_of_expertise">
                <TextArea
                  rows={7}
                  allowClear
                  placeholder="Lĩnh vực chuyên sâu"
                  className="rounded-[10px] resize-none w-full text-[#696974] custom_scrollbar "
                  onResize={() => {}}
                />
              </Form.Item>
            </div>
            <div>
              <p className="block_title !text-[#171725] !text-[20px] leading-[30px] tracking-[0.1px] !font-[400]">
                Ví dụ về nơi làm việc
              </p>
              <Form.Item className="mb-0" name="workplace_example">
                <TextArea
                  rows={5}
                  allowClear
                  placeholder="Ví dụ về nơi làm việc"
                  className="rounded-[10px] resize-none w-full text-[#696974] custom_scrollbar "
                  onResize={() => {}}
                />
              </Form.Item>
            </div>
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
