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
import Link from 'next/link';
import locale from 'antd/lib/date-picker/locale/vi_VN';
import TextArea from 'antd/lib/input/TextArea';
import { IGetListLicenseRes } from '../../shared/interface';
import moment from 'moment';

const BussinessPackageOrder = (props: any) => {
  const { type } = props;
  const isDisabled = type === 'edit';
  const router = useRouter();
  const id = router.query.id;
  const [form] = Form.useForm();
  const avatarFile = Form.useWatch<UploadChangeParam<UploadFile<any>>>(
    LICENSE_DATA_FIELD.images,
    form
  );
  const [descriptionEdit, setDescriptionEdit] = useState<string>('');
  const [listImgEdit, setListImgEdit] = useState<string[]>([]);
  const [activationDate, setActivationDate] = useState<Date | null>(null);

  const handleActivationDateChange = (date: moment.Moment | null) => {
    setActivationDate(date ? date.toDate() : null);
  };
  

  useEffect(() => {
    if (type === 'edit') {
      getLicense();
    }
  }, []);

  const getLicense = async () => {
    try {
      const res: IGetListLicenseRes = await managerServiceService.getLicenseOrderDetail(
        id as string
      );
      console.log('ID', id);
      console.log('bbb', res);
      form.setFieldsValue({
        [LICENSE_DATA_FIELD.career_field_id]: res.career_field_id,
        [LICENSE_DATA_FIELD.license_code]: res.license_code,
        [LICENSE_DATA_FIELD.license_name]: res.license_name,
        [LICENSE_DATA_FIELD.activation_date]: moment(res.activation_date), 
        [LICENSE_DATA_FIELD.selling_price]: res.selling_price,
        [LICENSE_DATA_FIELD.listed_price]: res.listed_price,
        [LICENSE_DATA_FIELD.period]: res.period,
        [LICENSE_DATA_FIELD.quantity_record_view]: res.quantity_record_view,
        [LICENSE_DATA_FIELD.quantity_record_take]: res.quantity_record_take,
        [LICENSE_DATA_FIELD.expiration_date]: moment(res.expiration_date), 
        [LICENSE_DATA_FIELD.status]: res.status,
        [LICENSE_DATA_FIELD.description]: res.description,
        [LICENSE_DATA_FIELD.discount]: res.discount,
        [LICENSE_DATA_FIELD.total_amount]: res.total_amount,
      });
    } catch (error) {
      showResponseError(error);
      console.log(error);
    }
  };

  console.log("ID Cập nhật: ", id)

  const handleFormSubmit = async () => {
    try {
      const formData = form.getFieldsValue();
      const periodMonths = formData[LICENSE_DATA_FIELD.period];
      const expirationDate = moment(activationDate).add(periodMonths, 'months').toISOString();
      const params = {
        career_field_id: formData[LICENSE_DATA_FIELD.career_field_id],
        license_id: 0,
        enterpise_id: localStorage.getItem('enterprise_id'),
        license_code: formData[LICENSE_DATA_FIELD.license_code],
        license_name: formData[LICENSE_DATA_FIELD.license_name],
        activation_date: formData[LICENSE_DATA_FIELD.activation_date],
        selling_price: formData[LICENSE_DATA_FIELD.selling_price],
        listed_price: formData[LICENSE_DATA_FIELD.listed_price],
        period: formData[LICENSE_DATA_FIELD.period],
        quantity_record_view: formData[LICENSE_DATA_FIELD.quantity_record_view],
        quantity_record_take: formData[LICENSE_DATA_FIELD.quantity_record_take],
        expiration_date: expirationDate,
        status: formData[LICENSE_DATA_FIELD.status],
        discount: formData[LICENSE_DATA_FIELD.discount],
        total_amount: formData[LICENSE_DATA_FIELD.total_amount],
        description: formData[LICENSE_DATA_FIELD.description],
        id: type === 'edit' ? id : undefined,
      };
      if(type === 'edit'){
        params.quantity_record_view = formData[LICENSE_DATA_FIELD.quantity_record_view],
        params.quantity_record_take = formData[LICENSE_DATA_FIELD.quantity_record_take],
        params.expiration_date = expirationDate,
        params.status = formData[LICENSE_DATA_FIELD.status];
        params.description = formData[LICENSE_DATA_FIELD.description],
        await managerServiceService.updateLicenseOrder(params);
        message.success('Cập nhật thành công');
      } else {
        await managerServiceService.getLicenseOrder(params);
        appLibrary.hideloading();
        message.success('Thêm mới thành công');
      }
    } catch (error) {
      showResponseError(error);
      console.log(error);
    }
  };
  
  const [packageOptions, setPackageOptions] = useState([]);
  const fetchPackageOptions = async (careerId: number) => {
    try {
      const response = await managerServiceService.getLicenseCode(careerId); 
      setPackageOptions(response);
    } catch (error) {
      console.error('Lỗi fetchPackageOptions: ', error);
    }
  };

  const handleCareerChange = (careerId: number) => {
    fetchPackageOptions(careerId);
    form.setFieldsValue({
      [LICENSE_DATA_FIELD.license_code]: null, 
      [LICENSE_DATA_FIELD.license_name]: null,
      [LICENSE_DATA_FIELD.selling_price]: null,
      [LICENSE_DATA_FIELD.listed_price]: null,
      [LICENSE_DATA_FIELD.period]: null,
      [LICENSE_DATA_FIELD.quantity_record_view]: null,
      [LICENSE_DATA_FIELD.discount]: null,
      [LICENSE_DATA_FIELD.total_amount]: null,
      [LICENSE_DATA_FIELD.description]: null,
    });
  };

  const [totalPrice, setTotalPrice] = useState<number>(0);
  const handleDiscountChange = (discount: number) => {
    const sellingPrice = form.getFieldValue(LICENSE_DATA_FIELD.selling_price);
    const newTotalPrice = sellingPrice - discount;
    setTotalPrice(newTotalPrice);
    form.setFieldsValue({ [LICENSE_DATA_FIELD.total_amount]: newTotalPrice });
  };

  const handleCodePackageChange = async (code: string) => {
    try {
      const response = await managerServiceService.getLicenseCodeDetail(code);

      form.setFieldsValue({
        [LICENSE_DATA_FIELD.license_name]: response.license_name,
        [LICENSE_DATA_FIELD.selling_price]: response.selling_price,
        [LICENSE_DATA_FIELD.listed_price]: response.listed_price,
        [LICENSE_DATA_FIELD.period]: response.period,
        [LICENSE_DATA_FIELD.quantity_record_view]: response.quantity_record_view,
        [LICENSE_DATA_FIELD.quantity_record_take]: response.quantity_record_take,
      });
    } catch (error) {
      showResponseError(error);
      console.error('Lỗi handleCodePackageChange: ', error);
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
                onChange={handleCareerChange}
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
                onChange={handleCodePackageChange}
              >
                {packageOptions.map((packageOption, index) => {
                  return (
                    <Select.Option key={index} value={packageOption}>
                      {packageOption.value}
                    </Select.Option>
                  );
                })}
              </Select>
            </FormItem>
          </div>
          <div className="w-full">
            <p className="font-[400] text-[16px] leading-[24px] text-[#44444F] mb-1">
              Ngày kích hoạt <span className="text-[#EB4C4C]">*</span>
            </p>
            <FormItem
              name={LICENSE_DATA_FIELD.activation_date}
              className="w-full"
              rules={[{ required: true, message: 'Trường này là bắt buộc' }]}
            >
              <DatePicker
                locale={locale}
                placeholder="12/03/2002"
                className="rounded-[10px] p-2 w-full"
                format="DD/MM/YYYY"
                onChange={handleActivationDateChange}
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
                className="rounded-[10px] bg-white w-full"
                allowClear
                disabled
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
                className="rounded-[10px] bg-white w-full"
                allowClear
                disabled
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
                className="rounded-[10px] bg-white w-full"
                allowClear
                disabled
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
                className="!rounded-[10px] bg-white w-full"
                allowClear
                disabled
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
                className="rounded-[10px] bg-white w-full"
                allowClear
                disabled={!isDisabled}
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
                className="rounded-[10px] bg-white w-full"
                allowClear
                disabled={!isDisabled}
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
                name={LICENSE_DATA_FIELD.expiration_date}
                className="w-full"
              >
                <DatePicker
                  locale={locale}
                  placeholder="12/03/2002"
                  className="rounded-[10px] p-2 w-full"
                  format="DD/MM/YYYY"
                />
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
                name={LICENSE_DATA_FIELD.discount}
                className="w-full"
              >
                <Input
                  size="large"
                  placeholder="0"
                  className="rounded-[10px] bg-white w-full"
                  allowClear
                  onChange={(e) => handleDiscountChange(parseFloat(e.target.value))}
                ></Input>
              </FormItem>
            </div>
            <div className="w-full">
              <p className="font-[400] text-[16px] leading-[24px] text-[#44444F] mb-1">
                Tổng tiền (VND)
              </p>
              <FormItem
                name={LICENSE_DATA_FIELD.total_amount}
                className="w-full"
              >
                <Input
                  size="large"
                  className="rounded-[10px] bg-white w-full"
                  placeholder='0'
                  allowClear
                  disabled
                ></Input>
              </FormItem>
            </div>
            <div className="w-full"></div>
          </div>
          <div className="w-full">
            <p className="font-[400] text-[16px] leading-[24px] text-[#44444F] mb-1">
              Ghi chú
            </p>
            <FormItem name={LICENSE_DATA_FIELD.description} className="w-full">
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
