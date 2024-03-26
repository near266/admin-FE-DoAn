import SrcIcons from '@/assets/icons';
import { EditorBlock } from '@/modules/ManageAssessments/components/EditorBlock';
import { RECRUITMENT_DATA_FIELD } from '@/modules/ManageJobs/shared/enum';
import { DatePicker, Form, Input, Select, message } from 'antd';
import { UploadFile } from 'antd/es/upload';
import FormItem from 'antd/lib/form/FormItem';
import { UploadChangeParam } from 'antd/lib/upload';
import Dragger from 'antd/lib/upload/Dragger';
import Image from 'next/image';
import {
  LICENSE_DATA_FIELD,
  listCareer,
  listPackage,
  listPeriod,
  listStatus,
} from '../../shared/enum';
import { appLibrary } from '@/shared/utils/loading';
import { managerServiceService } from '../../shared/api';
import {
  showResponseError,
  showResponseError2,
  showSuccessMessage,
} from '@/shared/utils/common';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { IGetListLicenseRes } from '../../shared/interface';
import Link from 'next/link';
import locale from 'antd/lib/date-picker/locale/vi_VN';
import TextArea from 'antd/lib/input/TextArea';

const BussinessPackageOrder = (props: any) => {
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
    getLicense()
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
      }
      appLibrary.hideloading();
    } catch (error) {
      appLibrary.hideloading();
      showResponseError(error);
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
      }
      appLibrary.hideloading();
    } catch (error) {
      appLibrary.hideloading();
      showResponseError2(error?.response?.data);
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
          Thông tin gói
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
              rules={[{ required: true, message: 'Trường này là bắt buộc' }]}
            >
              <Select
                size="large"
                placeholder="Nhập mã gói"
                className="!rounded-[10px] bg-white w-full"
                allowClear
              >
                {listPackage.map((item: any) => {
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
              Ngày tháng năm sinh <span className="text-[#EB4C4C]">*</span>
            </p>
            <FormItem
              // name={LICENSE_DATA_FIELD.birthday}
              className="w-full"
              rules={[{ required: true, message: 'Trường này là bắt buộc' }]}
            >
              <DatePicker
                locale={locale}
                placeholder="12/03/2002"
                className="rounded-[10px] p-2 w-full"
                // onChange={onChange}
                format="DD/MM/YYYY"
                // defaultValue={birhdayDefault}
              />
            </FormItem>
          </div>
        </div>
        <div className="flex gap-8 mb-2">
          <div className="w-full">
            <p className="font-[400] text-[16px] leading-[24px] text-[#44444F] mb-1">
              Tên gói
            </p>
            <FormItem
              name={LICENSE_DATA_FIELD.license_name}
              className="w-full"
            >
              <Input
                size="large"
                placeholder="Nhập tên gói"
                className="rounded-[10px] bg-white w-full"
                allowClear
              ></Input>
            </FormItem>
          </div>
          <div className="w-full">
            <p className="font-[400] text-[16px] leading-[24px] text-[#44444F] mb-1">
              Giá bán (VND)
            </p>
            <FormItem
              name={LICENSE_DATA_FIELD.selling_price}
              className="w-full"
            >
              <Input
                size="large"
                placeholder="Nhập giá bán"
                className="rounded-[10px] bg-white w-full"
                allowClear
              ></Input>
            </FormItem>
          </div>
          <div className="w-full">
            <p className="font-[400] text-[16px] leading-[24px] text-[#44444F] mb-1">
              Giá niêm yết (VND)
            </p>
            <FormItem
              name={LICENSE_DATA_FIELD.listed_price}
              className="w-full"
            >
              <Input
                size="large"
                placeholder="Nhập mã gói"
                className="rounded-[10px] bg-white w-full"
                allowClear
              ></Input>
            </FormItem>
          </div>
        </div>
        <div className="flex gap-8 mb-2">
        <div className="w-full">
            <p className="font-[400] text-[16px] leading-[24px] text-[#44444F] mb-1">
              Thời gian sử dụng
            </p>
            <FormItem
              name={LICENSE_DATA_FIELD.period}
              className="w-full"
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
          <div className="w-full">
            <p className="font-[400] text-[16px] leading-[24px] text-[#44444F] mb-1">
              Số hồ sơ có thể xem
            </p>
            <FormItem
              name={LICENSE_DATA_FIELD.quantity_record_view}
              className="w-full"
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
              Số hồ sơ có thể tiếp nhận
            </p>
            <FormItem
              name={LICENSE_DATA_FIELD.quantity_record_take}
              className="w-full"
            >
              <Input
                size="large"
                placeholder="Nhập số hồ sơ có thể tiếp nhận"
                className="rounded-[10px] bg-white w-full"
                allowClear
              ></Input>
            </FormItem>
          </div>
        </div>
        { type === 'edit' && 
          <div className="flex gap-8 mb-2">
            <div className="w-full">
              <p className="font-[400] text-[16px] leading-[24px] text-[#44444F] mb-1">
                Ngày hết hạn
              </p>
              <FormItem
                name={LICENSE_DATA_FIELD.period}
                className="w-full"
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
            <div className="w-full">
              <p className="font-[400] text-[16px] leading-[24px] text-[#44444F] mb-1">
                Trạng thái
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
          <div className="w-full"></div>
        </div>
        }
        <div className="my-3 w-full border-solid border-t-[1px] border-[#ccc]">
          <p className="text-[var(--primary-color)] font-bold text-xl mb-3 my-4">
            Thông tin thanh toán
          </p>
          <div className="flex gap-8 mb-2">
            <div className="w-full">
              <p className="font-[400] text-[16px] leading-[24px] text-[#44444F] mb-1">
                Chiết khấu (VND)
              </p>
              <FormItem
                name={LICENSE_DATA_FIELD.selling_price}
                className="w-full"
              >
                <Input
                  size="large"
                  placeholder="0"
                  className="rounded-[10px] bg-white w-full"
                  allowClear
                ></Input>
              </FormItem>
            </div>
            <div className="w-full">
              <p className="font-[400] text-[16px] leading-[24px] text-[#44444F] mb-1">
                Tổng tiền (VND)
              </p>
              <FormItem
                name={LICENSE_DATA_FIELD.selling_price}
                className="w-full"
              >
                <Input
                  size="large"
                  className="rounded-[10px] bg-white w-full"
                  allowClear
                ></Input>
              </FormItem>
            </div>
            <div className="w-full"></div>
          </div>
          <div className="w-full">
            <p className="font-[400] text-[16px] leading-[24px] text-[#44444F] mb-1">
              Ghi chú
            </p>
            <FormItem name={LICENSE_DATA_FIELD.note} className="w-full">
              <TextArea
                rows={6}
                className="rounded-[10px]"
                placeholder="Nhập lời nhắn"
              ></TextArea>
            </FormItem>
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

export default BussinessPackageOrder;
