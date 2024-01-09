import { Dayjs } from 'dayjs';
import AlertDialogSlide from '@/components/Modal';
import { Checkbox } from '@nextui-org/react';
import { DatePicker, Button, Form, Input, Select, message } from 'antd';
import 'moment/locale/vi';
import locale from 'antd/lib/date-picker/locale/vi_VN';
import { useForm } from 'antd/lib/form/Form';
import { DUMMY_COURSE } from '@/modules/ManageCoupon/shared/constances';
import { useEffect, useState } from 'react';
import { daysInWeek, format } from 'date-fns';
import { daysInYear } from 'date-fns/constants/index';
import { counponServices } from '@/modules/ManageCoupon/shared/api';
import {
  generateCouponCode,
  PayloadCoupon,
  ResponseCoupon,
} from '@/modules/ManageCoupon/shared/utils';
import { appLibrary } from '@/shared/utils/loading';
import { SV_RES_STATUS_CODE } from '@/shared/enums/enums';
import { Common } from '@/shared/utils';
import moment from 'moment';
import { ICoupon } from '@/interfaces/models/ICoupon';
const { RangePicker } = DatePicker;

type TCouponForm = {
  data?: ResponseCoupon;
  // TODO: sua any thanh ResponseCoupon
  updateUI?: (data: ICoupon) => void;
};
const CouponForm = (props: TCouponForm) => {
  const { data, updateUI } = props;
  const [form] = useForm();
  const [radio, setRadio] = useState({
    createCoupon: true,
    useCount: true,
    applyFor: true,
  });
  useEffect(() => {
    if (data) {
      // data.id
      form.setFieldsValue({
        code: data.code,
        discount: data.discount,
        limit: data.limit,
        time_apply: [moment(data.start_time), moment(data.end_time)],
      });
    } else {
      autoGenerateCode();
    }

    return () => {
      form.resetFields();
    };
  }, [data]);
  const onFinish = (values: any) => {
    const payload: PayloadCoupon = {
      code: values.code,
      discount: values.discount,
      start_time: values.time_apply[0].format('YYYY-MM-DD HH:mm:ss'),
      end_time: values.time_apply[1].format('YYYY-MM-DD HH:mm:ss'),
    };
    createCoupon(payload);
  };

  const createCoupon = async (coupon: PayloadCoupon) => {
    try {
      appLibrary.showloading();
      const { code, payload } = await counponServices.createCoupon(coupon);
      if (code === SV_RES_STATUS_CODE.success) {
        updateUI && updateUI(payload);
        form.resetFields();
        message.success('Tạo COUPON thành công');
      }
      appLibrary.hideloading();
    } catch (error) {
      appLibrary.hideloading();
      message.error(error.response.data.error ?? 'Lỗi không xác định');
      console.log(error.response.data.error);
    }
  };

  const autoGenerateCode = () => {
    form.setFieldsValue({
      code: generateCouponCode(20),
    });
  };
  return (
    <>
      <div className="min-w-[900px] coupon">
        <Form
          form={form}
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={() => {}}
          autoComplete="off"
          className="flex flex-col gap-[8px]"
        >
          <h3 className="font-[600] text-[28px] leading-title">TẠO COUPON</h3>
          {/* Tên chiến dịch */}
          <div className="campaign">
            <p className="font-[400] mb-3 text-xl leading-title">
              Chiến dịch <span className="text-[#EB4C4C]">*</span>
            </p>
            <Form.Item
              name="campaign_name"
              className="w-full"
              rules={[{ required: true, message: 'Nhập tên chiến dịch!' }]}
            >
              <Input
                size="large"
                placeholder="Nhập tên chiến dịch"
                className="rounded-[10px] bg-white w-full"
                allowClear
              />
            </Form.Item>
          </div>
          {/* Tạo mã */}
          <div className="create-counpon flex flex-row gap-4">
            <div className="flex flex-col w-full gap-[10px]">
              <p className="font-[400] mb-1 text-xl leading-title">
                Tạo mã <span className="text-[#EB4C4C]">*</span>
              </p>
              <Checkbox
                isSelected={radio.createCoupon}
                radioGroup="createCoupon"
                label="Tự động"
                name="createCoupon"
                onChange={() => {
                  autoGenerateCode();
                  setRadio({ ...radio, createCoupon: true });
                }}
                aria-label="Checkbox"
                color="success"
              />
              <Checkbox
                isSelected={!radio.createCoupon}
                label="Tuỳ chỉnh"
                radioGroup="createCoupon"
                name="createCoupon"
                onChange={() => {
                  setRadio({ ...radio, createCoupon: false });
                }}
                aria-label="Checkbox"
                color="success"
              />
              <Form.Item
                name="code"
                className="w-full"
                rules={[
                  { required: true, min: 6, max: 20, message: 'Nhập mã COUPON hợp lệ!' },
                ]}
              >
                <Input
                  size="large"
                  placeholder="ABCD-DCBA-ACBD"
                  className="rounded-[10px] bg-white"
                  allowClear
                />
              </Form.Item>
            </div>

            <div className="flex flex-col w-full gap-[10px]">
              <p className="font-[400] mb-1 text-xl leading-title">
                Số lượng <span className="text-[#EB4C4C]">*</span>
              </p>
              <Checkbox
                isSelected={radio.useCount}
                label="Cho 1 học viên sử dụng"
                aria-label="Checkbox"
                name="useCount"
                onChange={() => {
                  setRadio({ ...radio, useCount: true });
                }}
                color="success"
              />
              <Checkbox
                isSelected={!radio.useCount}
                label="Cho nhiều học viên sử dụng"
                aria-label="Checkbox"
                name="useCount"
                onChange={() => {
                  setRadio({ ...radio, useCount: false });
                }}
                color="success"
              />
              <Form.Item
                name="limit"
                className="w-full"
                rules={[{ required: true, message: 'Nhập số lượng COUPON!' }]}
              >
                <Input
                  size="large"
                  type="number"
                  placeholder="100"
                  className="rounded-[10px] bg-white"
                  allowClear
                />
              </Form.Item>
            </div>
          </div>
          {/* áp dụng cho */}
          <div className="flex flex-col w-full gap-[10px]">
            <p className="font-[400] mb-1 text-xl leading-title">
              Áp dụng cho <span className="text-[#EB4C4C]">*</span>
            </p>
            <Checkbox
              isSelected={radio.applyFor}
              label="Tất cả sản phẩm"
              aria-label="Checkbox"
              name="applyFor"
              onChange={() => {
                setRadio({ ...radio, applyFor: true });
              }}
              color="success"
            />
            <Checkbox
              isSelected={!radio.applyFor}
              label="Sản phẩm cụ thể"
              aria-label="Checkbox"
              name="applyFor"
              onChange={() => {
                setRadio({ ...radio, applyFor: false });
              }}
              color="success"
            />
            <Form.Item
              name="course_apply"
              className="w-full"
              rules={[
                {
                  required: false,
                  message: 'Chọn khoá học hoặc bài test áp dụng!',
                },
              ]}
            >
              <Select
                mode="multiple"
                size="large"
                placeholder="Chọn khoá học hoặc bài test"
                className="!rounded-[10px] bg-white"
                allowClear
                onChange={() => {}}
              >
                {DUMMY_COURSE.map((item: any) => (
                  <Select.Option key={item.value} value={item.value}>
                    {item.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          {/* Nhập số tiền  */}
          <div className="flex flex-col w-full gap-[10px]">
            <p className="font-[400] mb-1 text-xl leading-title">
              Nhập % hoặc số tiền <span className="text-[#EB4C4C]">*</span>
            </p>

            <Form.Item
              name="discount"
              className="w-full"
              rules={[
                { required: true, min: 1, message: 'Nhập số tiền giảm của COUPON!' },
              ]}
            >
              <Input
                type="number"
                size="large"
                placeholder="VD: 20% hoặc 20000"
                className="rounded-[10px] bg-white"
                allowClear
              />
            </Form.Item>
          </div>

          {/* Cài đặt thời gian */}
          <div className="flex flex-col w-full gap-[10px]">
            <p className="font-[400] mb-1 text-xl leading-title">
              Cài đặt thời gian <span className="text-[#EB4C4C]">*</span>
            </p>

            <Form.Item
              name="time_apply"
              rules={[{ required: true, message: 'Hãy chọn thời hạn cho COUPON!' }]}
            >
              <RangePicker
                placement="topLeft"
                locale={{
                  ...locale,
                  lang: {
                    ...locale.lang,
                    now: 'Current Time',
                    ok: 'Chọn',
                  },
                }}
                showTime
                size="large"
                placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
                allowClear
                className="rounded-[10px] bg-white w-full"
                // format with time date month year
                format="YYYY-MM-DD HH:mm:ss"
              />
            </Form.Item>
          </div>
          <Form.Item>
            <Button
              className="bg-primary ml-auto hover:bg-primary text-white hover:text-white focus:bg-primary focus:text-white rounded-[10px] font-[600] leading-[21px] flex justify-center items-center w-[100px] px-5 py-[5px] drop-shadow-[0_0px_7px_rgba(41,41,50,0.1)]"
              htmlType="submit"
            >
              {data ? 'CẬP NHẬT' : 'TẠO'}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};
type Props = {
  open: boolean;
  data?: ResponseCoupon;
  update?: (data: any) => void;
  onChange(openState: boolean): void;
};
export default function CouponCreator({ open, data, update, onChange }: Props) {
  const [couponData, setCouponData] = useState(data);
  useEffect(() => {
    if (data) {
      setCouponData(data);
    }
  }, [data]);
  return (
    <>
      <AlertDialogSlide
        isOpen={open}
        size="lg"
        preserveState
        contentChild={<CouponForm data={couponData} updateUI={update} />}
        onCancel={() => {}}
        onChange={(value) => {
          setCouponData(undefined);
          onChange(value);
        }}
        onConfirm={() => {}}
      />
    </>
  );
}
