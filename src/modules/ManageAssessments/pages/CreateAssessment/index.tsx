import { Button, Form, InputNumber, message, UploadProps } from 'antd';
import type { UploadChangeParam } from 'antd/es/upload';
import type { RcFile, UploadFile } from 'antd/es/upload/interface';
import { useState } from 'react';

import { CustomSelector } from '@/components/CustomSelector';
import FileUploader from '@/components/FileUpload';
import {
  AssessmentSaleCode,
  AssessmentStatusCode,
  SV_RES_STATUS_CODE,
} from '@/shared/enums/enums';
import { appLibrary } from '@/shared/utils/loading';
import { debounce } from '@mui/material';
import { Input } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { useRef } from 'react';
import { EditorBlock } from '../../components/EditorBlock';
import { assessmentService } from '../../shared/api';
import {
  goi_test,
  PayloadAssessment,
  phan_loai,
  validateAssessmentPayload,
} from '../../shared/utils';

export function CreateAssessmentModule() {
  const [form] = useForm();
  const [saleCode, setSaleCode] = useState<AssessmentSaleCode>(goi_test[0].value);
  const handleSelect = (value: number) => {
    setSaleCode(value);
    if (value === goi_test[0].value) {
      form.setFieldsValue({
        sale_price: 0,
        original_price: 0,
      });
    }
  };

  const handleChange: UploadProps['onChange'] = (
    info: UploadChangeParam<UploadFile>
  ) => {};

  const onFinish = async (values: PayloadAssessment) => {
    const formData = new FormData();

    if (validateAssessmentPayload(values)) {
      try {
        formData.append('name', values.name);
        formData.append('content', values.content);
        formData.append('description', values.description);
        formData.append('avatar', values.avatar.file?.originFileObj ?? values.avatar);
        formData.append('assessment_type', values.assessment_type?.toString());
        formData.append('test_tutorial', values.test_tutorial);
        formData.append('sale_code', values.sale_code.toString());
        formData.append('status', AssessmentStatusCode.DRAFT.toString());
        formData.append('test_time', values.test_time.toString());
        formData.append(
          'original_price',
          saleCode === AssessmentSaleCode.FREE ? '0' : values.original_price?.toString()
        );
        formData.append(
          'sale_price',
          saleCode === AssessmentSaleCode.FREE ? '0' : values.sale_price?.toString()
        );
        appLibrary.showloading();
        const res = await assessmentService.createNewAssessment(formData);
        if (res.code === SV_RES_STATUS_CODE.success) {
          const {
            payload: { name },
          } = res;
          appLibrary.hideloading();
          message.success(`Tạo thành công bài test ${name}`);
        }
      } catch (error) {
        appLibrary.hideloading();
        message.error('Tạo bài test thất bại');
        console.log(error);
      }
    }
  };

  const onFinishFailed = (errorInfo: any) => {};
  return (
    <>
      <div className="create-assessment">
        <Form
          form={form}
          autoComplete="off"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <div className="title text-title font-title tw-text-[20px]">
            Thêm mới bài đánh giá năng lực
          </div>
          <div className="flex flex-row gap-[1rem] justify-between">
            <div className="flex mb-[1rem] gap-3 w-full flex-col ">
              <p className="block_title">*Tên</p>
              <Form.Item name="name">
                <Input
                  size="large"
                  bordered={false}
                  placeholder="Nhập tên bài đánh giá"
                  className="rounded-[10px] !bg-white"
                  allowClear
                />
              </Form.Item>
            </div>
            <div className="min-w-[230px]">
              <Form.Item name="assessment_type" initialValue={phan_loai[0].value}>
                <CustomSelector
                  options={phan_loai}
                  title="Phân loại"
                  required
                  initialValue={phan_loai[0].value}
                  onChange={(value) => {
                    form.setFieldsValue({ assessment_type: value });
                  }}
                />
              </Form.Item>
            </div>
          </div>
          <div className="mt-3">
            <Form.Item name="content">
              <EditorBlock onChange={(data) => {}} title="Mô tả" required />
            </Form.Item>
          </div>
          <div className="mt-3">
            <Form.Item name="description">
              <EditorBlock onChange={() => {}} title="Mô tả chi tiết" required />
            </Form.Item>
          </div>
          <div className="mt-3">
            <Form.Item name="test_tutorial">
              <EditorBlock onChange={() => {}} title="Hướng dẫn làm bài test" required />
            </Form.Item>
          </div>
          <div className="w-full flex gap-[1rem] flex-wrap mt-[1.5rem] justify-between">
            <div className="min-w-[230px]">
              <Form.Item name="sale_code" initialValue={saleCode}>
                <CustomSelector
                  options={goi_test}
                  title="Gói test"
                  required
                  initialValue={saleCode}
                  onChange={handleSelect}
                />
              </Form.Item>
            </div>

            <div className="flex mb-[1rem] gap-3 flex-col w-fit flex-nowrap">
              <p className="whitespace-nowrap block_title">
                *Thời gian ước tính làm test
              </p>
              <Form.Item name="test_time">
                <InputNumber
                  bordered={false}
                  size="large"
                  placeholder="phút"
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                  className="rounded-[10px] w-full !bg-white drop-shadow-[0_0px_7px_rgba(41,41,50,0.1)]"
                />
              </Form.Item>
            </div>
            <div className="flex mb-[1rem] gap-3 flex-col w-fit flex-nowrap">
              <p className="block_title">*Giá tiền (VND)</p>
              <Form.Item
                name="original_price"
                initialValue={saleCode === AssessmentSaleCode.FREE ? 0 : saleCode}
              >
                <InputNumber
                  size="large"
                  disabled={saleCode === AssessmentSaleCode.FREE}
                  bordered={false}
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                  placeholder="VND"
                  className="w-full overflow-hidden rounded-[10px] !bg-white drop-shadow-[0_0px_7px_rgba(41,41,50,0.1)]"
                />
              </Form.Item>
            </div>
            <div className="flex mb-[1rem] gap-3 flex-col w-fit flex-nowrap">
              <p className="block_title">Giá bán</p>
              <Form.Item
                name="sale_price"
                initialValue={saleCode === AssessmentSaleCode.FREE ? 0 : saleCode}
              >
                <InputNumber
                  size="large"
                  disabled={saleCode === AssessmentSaleCode.FREE}
                  bordered={false}
                  placeholder="VND"
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                  className="w-full overflow-hidden rounded-[10px] !bg-white drop-shadow-[0_0px_7px_rgba(41,41,50,0.1)]"
                />
              </Form.Item>
            </div>
            <div className="flex mb-[1rem] gap-3 flex-col w-fit flex-nowrap">
              <p className="block_title">*Ảnh thumbnail</p>

              <Form.Item name="avatar">
                <FileUploader onChange={handleChange} />
              </Form.Item>
            </div>
          </div>
          <div className="container !my-10 ">
            <Button
              className="custom-button"
              onClick={debounce(() => {
                form.submit();
              }, 500)}
            >
              Lưu
            </Button>
          </div>
        </Form>
      </div>
    </>
  );
}
