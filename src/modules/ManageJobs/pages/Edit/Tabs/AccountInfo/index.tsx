import { Form, Input } from 'antd';
import 'moment/locale/vi';
import { CustomSelector } from '@/components/CustomSelector';
import { GENDER } from '../../../../shared/enum';
import { TAccount } from '@/pages/quan-ly-thanh-vien/doanh-nghiep/chinh-sua/[id]';
interface IProps {
  accountInfo: TAccount;
}

export function AccountInfoForm({ accountInfo }: IProps) {
  return (
    <>
      <div className="min-w-[900px] coupon">
        <Form
          name="basic"
          initialValues={{ remember: true }}
          onFinish={() => {}}
          onFinishFailed={() => {}}
          autoComplete="off"
          className="flex flex-col gap-[8px]"
        >
          <h3 className="font-[600] text-[28px] leading-title">Thông tin tài khoản</h3>

          <div className="campaign">
            <p className="font-[400] mb-3 text-[18px] ">Gmail</p>
            <Form.Item name="email" className="w-full">
              <Input
                size="large"
                placeholder={accountInfo.email}
                className="rounded-[10px] bg-white w-full"
                allowClear
                disabled
              />
            </Form.Item>
            {accountInfo.email_verified ? (
              <p className="text-[14px] mt-1 ml-1 text-[#30AB7E]">Đã xác minh</p>
            ) : (
              <p className="text-[14px] mt-1 ml-1 text-[#EB4C4C]">Chưa xác minh</p>
            )}
          </div>

          <h3 className="font-[600] text-[28px] leading-title">Thông tin liên hệ</h3>
          <div className="create-counpon flex flex-row gap-4 mb-3">
            <div className="flex flex-col w-full gap-[10px]">
              <Form.Item name="first_name" className="w-full">
                <Input
                  size="large"
                  placeholder={accountInfo.first_name}
                  className="rounded-[10px] bg-white"
                  allowClear
                  disabled
                />
              </Form.Item>
            </div>

            <div className="flex flex-col w-full gap-[10px]">
              <Form.Item name="last_name" className="w-full">
                <Input
                  size="large"
                  type="number"
                  placeholder={accountInfo.last_name}
                  className="rounded-[10px] bg-white"
                  allowClear
                  disabled
                />
              </Form.Item>
            </div>
          </div>

          <div className="create-counpon flex flex-row gap-4">
            <div className="flex flex-col w-full ">
              <p className="font-[400] text-[18px]">Số điện thoại</p>
              <Form.Item name="phone_number" className="w-full">
                <Input
                  size="large"
                  placeholder={accountInfo.phone}
                  className="rounded-[10px] bg-white"
                  allowClear
                  disabled
                />
              </Form.Item>
              {accountInfo.phone_verified ? (
                <p className="text-[14px] mt-1 ml-1 text-[#30AB7E]">Đã xác minh</p>
              ) : (
                <p className="text-[14px] mt-1 ml-1 text-[#EB4C4C]">Chưa xác minh</p>
              )}
            </div>

            <div className="flex flex-col w-1/3 ">
              <p className="font-[400] text-[18px]">Giới tính</p>
              <Form.Item name="gender" className="w-full">
                <CustomSelector
                  wrapperClassName="min-w-[150px]"
                  initialValue={accountInfo.gender_id}
                  options={[
                    { key: 0, value: GENDER.MALE.value, label: GENDER.MALE.label },
                    { key: 1, value: GENDER.FEMALE.value, label: GENDER.FEMALE.label },
                    {
                      key: 2,
                      value: GENDER.NO_REQUIRED.value,
                      label: GENDER.NO_REQUIRED.label,
                    },
                  ]}
                  disabled
                />
              </Form.Item>
            </div>

            <div className="flex flex-col w-full ">
              <p className="font-[400] text-[18px]">Vị trí</p>
              <Form.Item name="address" className="w-full">
                <Input
                  size="large"
                  type="number"
                  placeholder={accountInfo.address}
                  className="rounded-[10px] bg-white"
                  allowClear
                  disabled
                />
              </Form.Item>
            </div>
          </div>
        </Form>
      </div>
    </>
  );
}
