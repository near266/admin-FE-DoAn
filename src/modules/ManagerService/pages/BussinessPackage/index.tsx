import SrcIcons from '@/assets/icons';
import { EditorBlock } from '@/modules/ManageAssessments/components/EditorBlock';
import { RECRUITMENT_DATA_FIELD } from '@/modules/ManageJobs/shared/enum';
import { Form, Input, InputNumber, Select, message } from 'antd';
import { UploadFile } from 'antd/es/upload';
import FormItem from 'antd/lib/form/FormItem';
import { UploadChangeParam } from 'antd/lib/upload';
import Dragger from 'antd/lib/upload/Dragger';
import Image from 'next/image';
import {
  LICENSE_DATA_FIELD,
  listCareer,
  listPeriod,
  listStatus,
} from '../../shared/enum';
import { appLibrary } from '@/shared/utils/loading';
import { managerServiceService } from '../../shared/api';
import {
  showResponseError,
  showResponseError2,
  showResponseError3,
  showSuccessMessage,
} from '@/shared/utils/common';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { IGetListLicenseRes } from '../../shared/interface';
import Link from 'next/link';

const BussinessPackage = (props: any) => {
  const { type } = props;
  const router = useRouter();
  const id = router.query.id;
  const [form] = Form.useForm();
  const avatarFile = Form.useWatch<UploadChangeParam<UploadFile<any>>>(
    LICENSE_DATA_FIELD.images,
    form
  );
  const [descriptionEdit, setDescriptionEdit] = useState<string>('');
  const [listImgEdit, setListImgEdit] = useState<string[]>([]);

  useEffect(() => {
    if (type === 'edit') {
      getLicense();
    }
  }, []);

  const getLicense = async () => {
    try {
      appLibrary.showloading();
      const res: IGetListLicenseRes = await managerServiceService.getLicenseDetail(
        id as string
      );
      console.log('ID', id);
      console.log('bbb', res);
      form.setFieldsValue(res);
      setDescriptionEdit(res?.description);
      // setListImgEdit(res?.images)
      appLibrary.hideloading();
    } catch (error) {
      appLibrary.hideloading();
      showResponseError(error);
      console.log(error);
    }
  };

  const handleFormSubmit = () => {
    console.log('aaa', form.getFieldsValue());
    form.setFieldValue([LICENSE_DATA_FIELD.images], ['aaa']);
    if (type === 'edit') {
      updateLicense(form.getFieldsValue());
    } else {
      addLicense(form.getFieldsValue());
    }
  };

  const addLicense = async (data) => {
    try {
      appLibrary.showloading();
      const res = await managerServiceService.addLicense(data);
      if (res) {
        message.success('Thêm mới thành công');
        router.push(`/quan-ly-viec-lam/goi-doanh-nghiep`);
      }
      appLibrary.hideloading();
    } catch (error) {
      appLibrary.hideloading();
      // showResponseError(error);
      showResponseError3(error?.response?.data);
      console.log(error);
    }
  };

  const updateLicense = async (data) => {
    try {
      appLibrary.showloading();
      data.id = id;
      const res = await managerServiceService.updateLicense(data);
      if (res) {
        message.success('Cập nhật thành công');
        router.push(`/quan-ly-viec-lam/goi-doanh-nghiep`);
      }
      appLibrary.hideloading();
    } catch (error) {
      appLibrary.hideloading();
      showResponseError3(error?.response?.data);
      console.log(error);
    }
  };

  return (
    <div className="min-width-[900px] customNewsDetail card !px-9 ! className='w-full'py-7">
      <Form
        form={form}
        name="basic"
        initialValues={{ remember: true }}
        onFinish={handleFormSubmit}
        autoComplete="off"
        className="flex flex-col gap-[8px]"
      >
        <p className="text-[var(--primary-color)] font-bold text-xl mb-3">
          {type === 'edit' ? 'Chỉnh sửa gói doanh nghiệp' : 'Thêm mới gói doanh nghiệp'}
        </p>
        <div className="flex gap-8 mb-2">
          <div className="w-full">
            <p className="font-[400] text-[16px] leading-[24px] text-[#44444F] mb-1">
              Lĩnh vực <span className="text-[#EB4C4C]">*</span>
            </p>
            <FormItem
              name={LICENSE_DATA_FIELD.career_field_id}
              className="w-full"
              rules={[{ required: true, message: 'Vui lòng chọn lĩnh vực' }]}
            >
              <Select
                size="large"
                placeholder="Chọn lĩnh vực"
                className="!rounded-[10px] bg-white w-full"
                allowClear
              >
                {listCareer.map((item: any) => {
                  return (
                    <Select.Option key={item.value} value={item.value}>
                      {item.label}
                    </Select.Option>
                  );
                })}
              </Select>
            </FormItem>
          </div>
          <div className="w-full">
            <p className="font-[400] text-[16px] leading-[24px] text-[#44444F] mb-1">
              Mã gói <span className="text-[#EB4C4C]">*</span>
            </p>
            <FormItem
              name={LICENSE_DATA_FIELD.license_code}
              className="w-full"
              rules={[
                {required: true, message: 'Trường này là bắt buộc' },
              ]}
            >
              <Input
                size="large"
                placeholder="Nhập mã gói"
                className="rounded-[10px] bg-white w-full"
                allowClear
              ></Input>
            </FormItem>
          </div>
          <div className="w-full">
            <p className="font-[400] text-[16px] leading-[24px] text-[#44444F] mb-1">
              Tên gói <span className="text-[#EB4C4C]">*</span>
            </p>
            <FormItem
              name={LICENSE_DATA_FIELD.license_name}
              className="w-full"
              rules={[{ required: true, message: 'Trường này là bắt buộc' }]}
            >
              <Input
                size="large"
                placeholder="Nhập tên gói"
                className="rounded-[10px] bg-white w-full"
                allowClear
              ></Input>
            </FormItem>
          </div>
        </div>
        <div className="flex gap-8 mb-2">
          <div className="w-full">
            <p className="font-[400] text-[16px] leading-[24px] text-[#44444F] mb-1">
              Giá bán (VND) <span className="text-[#EB4C4C]">*</span>
            </p>
            <FormItem
              name={LICENSE_DATA_FIELD.selling_price}
              className="w-full"
              rules={[
                { required: true, message: 'Trường này là bắt buộc' },
              ]}
            >
              <InputNumber
                size="large"
                placeholder="Nhập giá bán"
                className="rounded-[10px] bg-white w-full"
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
                }
                parser={(value) => value!.replace(/\$\s?|(\.*)/g, '')}
              ></InputNumber>
            </FormItem>
          </div>
          <div className="w-full">
            <p className="font-[400] text-[16px] leading-[24px] text-[#44444F] mb-1">
              Giá niêm yết (VND) <span className="text-[#EB4C4C]">*</span>
            </p>
            <FormItem
              name={LICENSE_DATA_FIELD.listed_price}
              className="w-full"
              rules={[{ required: true, message: 'Trường này là bắt buộc' }]}
            >
              <InputNumber
                size="large"
                placeholder="Nhập mã gói"
                className="rounded-[10px] bg-white w-full"
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
                }
                parser={(value) => value!.replace(/\$\s?|(\.*)/g, '')}
              ></InputNumber>
            </FormItem>
          </div>
          <div className="w-full">
            <p className="font-[400] text-[16px] leading-[24px] text-[#44444F] mb-1">
              Thời gian sử dụng <span className="text-[#EB4C4C]">*</span>
            </p>
            <FormItem
              name={LICENSE_DATA_FIELD.period}
              className="w-full"
              rules={[{ required: true, message: 'Trường này là bắt buộc' }]}
            >
              <Select
                size="large"
                placeholder="Chọn thời gian bắt buộc"
                className="!rounded-[10px] bg-white w-full"
                allowClear
              >
                {listPeriod.map((item: any) => {
                  return (
                    <Select.Option key={item.value} value={item.value}>
                      {item.label}
                    </Select.Option>
                  );
                })}
              </Select>
            </FormItem>
          </div>
        </div>
        <div className="flex gap-8 mb-2">
          <div className="w-full">
            <p className="font-[400] text-[16px] leading-[24px] text-[#44444F] mb-1">
              Số hồ sơ có thể xem <span className="text-[#EB4C4C]">*</span>
            </p>
            <FormItem
              name={LICENSE_DATA_FIELD.quantity_record_view}
              className="w-full"
              rules={[
              { required: true, message: 'Trường này là bắt buộc' },
              {
                pattern: /^([-]?[1-9][0-9]*|0)$/,
                message: 'Định dạng số không hợp lệ',
              },
            ]}
            >
              <Input
                size="large"
                placeholder="Nhập số hồ sơ có thể xem"
                className="rounded-[10px] bg-white w-full"
                allowClear
              ></Input>
            </FormItem>
          </div>
          <div className="w-full">
            <p className="font-[400] text-[16px] leading-[24px] text-[#44444F] mb-1">
              Số hồ sơ có thể tiếp nhận <span className="text-[#EB4C4C]">*</span>
            </p>
            <FormItem
              name={LICENSE_DATA_FIELD.quantity_record_take}
              className="w-full"
              rules={[
                { required: true, message: 'Trường này là bắt buộc' },
                {
                  pattern: /^([-]?[1-9][0-9]*|0)$/,
                  message: 'Định dạng số không hợp lệ',
                },
              ]}
            >
              <Input
                size="large"
                placeholder="Nhập số hồ sơ có thể tiếp nhận"
                className="rounded-[10px] bg-white w-full"
                allowClear
              ></Input>
            </FormItem>
          </div>
          <div className="w-full">
            <p className="font-[400] text-[16px] leading-[24px] text-[#44444F] mb-1">
              Trạng thái <span className="text-[#EB4C4C]">*</span>
            </p>
            <FormItem
              name={LICENSE_DATA_FIELD.status}
              className="w-full"
              rules={[{ required: true, message: 'Trường này là bắt buộc' }]}
            >
              <Select
                size="large"
                placeholder="Chọn trạng thái"
                className="!rounded-[10px] bg-white w-full"
                allowClear
              >
                {listStatus.map((item: any) => {
                  return (
                    <Select.Option key={item.value} value={item.value}>
                      {item.label}
                    </Select.Option>
                  );
                })}
              </Select>
            </FormItem>
          </div>
        </div>
        <div className="my-3">
          <Form.Item name={LICENSE_DATA_FIELD.description}>
            <EditorBlock
              onChange={(data) => {}}
              defaultValue={descriptionEdit}
              title="Mô tả"
              required
            />
          </Form.Item>
        </div>
        <div className="flex flex-col w-full gap-[10px]">
          <p className="font-[400] text-xl ">Ảnh</p>
          <p className="font-[400] mb-1 text-[14px] text-[#696974] ">
            Dung lượng file không được quá 5mb, kích thước 1200x300 px
          </p>
          <FormItem name={LICENSE_DATA_FIELD.images || ''} className="w-full h-full">
            <Dragger
              className="h-full bg-[#F1F1F5] !rounded-[10px] !border-[3px] !border-dashed border-[#D5D5DC] !overflow-hidden"
              maxCount={1}
              onChange={(info) => {}}
              // showUploadList={false}
              fileList={avatarFile?.fileList}
            >
              {listImgEdit.length > 0 ? (
                <div className="relative w-full min-h-[52px]">
                  <Image src={listImgEdit[0]} alt="Youth+ Doanh nghiệp" layout="fill" />
                </div>
              ) : (
                <div className="ant-upload-drag-icon flex justify-center">
                  <Image
                    src={SrcIcons.file_plus}
                    width={42}
                    height={52}
                    alt="Youth+ Doanh nghiệp"
                  />
                </div>
              )}
              <p className="ant-upload-text">
                Kéo thả file vào đây hoặc chọn file từ máy tính
              </p>
              <p className="ant-upload-hint">
                Kích thước: {Number(avatarFile?.file?.size / 1048576).toFixed(3)} MB
              </p>
              {avatarFile?.file?.name && (
                <p className="ant-upload-hint">Tên file: {avatarFile?.file?.name}</p>
              )}
            </Dragger>
          </FormItem>
          <div className="card my-3">
            <h3 className="font-[500] text-[22px] leading-[32px] text-[#171725]">
              Video
            </h3>
            <div className="flex flex-col gap-4 mt-5">
              <div className="flex flex-col w-full gap-[10px]">
                <p className="font-[400] text-[16px] leading-[24px] text-[#44444F]">
                  Tiêu đề video
                </p>
                <FormItem name={LICENSE_DATA_FIELD.title_video}>
                  <Input
                    size="large"
                    placeholder="Tiêu đề video"
                    className="rounded-[10px] bg-white w-full"
                    allowClear
                  ></Input>
                </FormItem>
              </div>
              <div className="flex flex-col w-full gap-[10px]">
                <p className="font-[400] text-[16px] leading-[24px] text-[#44444F]">
                  Đường dẫn video
                </p>
                <FormItem name={LICENSE_DATA_FIELD.link_video} className="w-full">
                  <Input
                    size="large"
                    placeholder="Đường dẫn video"
                    className="rounded-[10px] bg-white w-full"
                    allowClear
                  ></Input>
                </FormItem>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-2">
          <div className="flex items-center">
            <Link href={'/quan-ly-viec-lam/goi-doanh-nghiep'}>
              <div className="custom-button !bg-[#EB4C4C] mr-2">Hủy bỏ</div>
            </Link>
            <button className="custom-button">{type === 'edit' ? 'Lưu thay đổi' : 'Thêm mới'}</button>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default BussinessPackage;
