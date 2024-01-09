import { Form, Input } from 'antd';
import 'moment/locale/vi';

import { CustomSelector } from '@/components/CustomSelector';
import FormItem from 'antd/lib/form/FormItem';
import { TCompany } from '@/pages/quan-ly-viec-lam/danh-sach-doanh-nghiep/chinh-sua/[id]';
import { JOBS_STATUS, GENDER, convertOption, SCALE } from '../../../../shared/enum';
import { useCallback, useEffect, useState } from 'react';
import { jobService } from '@/modules/ManageJobs/shared/api';
import useSWR from 'swr';
interface IProps {
  company: TCompany;
}

const { TextArea } = Input;

export const CompanyInfoForm = ({ company }: IProps) => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const getProvincesData = useCallback(async () => {
    const res = await jobService.fetchProvinces();
    if (res) {
      setProvinces([...res]);
    }
    return res;
  }, []);

  const { data } = useSWR('getLocation', getProvincesData);

  const getDistrictsData = useCallback(async () => {
    const res = await jobService.fetchDistricts(company.city_id);
    if (res) {
      setDistricts([...res.districts]);
    }
  }, []);

  const getWardsData = useCallback(async () => {
    const res = await jobService.fetchWards(company.district_id);
    if (res) {
      setWards([...res.wards]);
    }
  }, []);

  const getLocation = () => {
    // Promise.all([getProvincesData, getDistrictsData, getWardsData]).then(
    //   ([res1, res2, res3]) => {
    //     console.log(res1, res2, res3);
    //   }
    // );
    getProvincesData();
    getDistrictsData();
    getWardsData();
  };

  useEffect(() => {
    getLocation();
  }, []);
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
          <div className="create-counpon flex flex-row gap-4">
            <div className="flex flex-col w-full ">
              <p className="font-[400] text-[18px]">
                Tên công ty <span className="text-[#EB4C4C]">*</span>
              </p>

              <Form.Item name="name" className="w-full">
                <Input
                  size="large"
                  placeholder={company.name}
                  className="rounded-[10px] bg-white w-full"
                  allowClear
                  disabled
                />
              </Form.Item>
            </div>

            <div className="flex flex-col w-1/5 ">
              <p className="font-[400] text-[18px]">
                Quy mô <span className="text-[#EB4C4C]">*</span>
              </p>
              <FormItem name="scale" className="w-full">
                <CustomSelector
                  initialValue={company.scale_id}
                  options={convertOption(SCALE)}
                  disabled
                />
              </FormItem>
            </div>
          </div>

          <p className="font-[400] text-[18px]">
            Địa điểm <span className="text-[#EB4C4C]">*</span>
          </p>
          <div className="create-counpon flex flex-row gap-4">
            <div className="flex flex-col w-full ">
              <FormItem name="city" className="w-full">
                <CustomSelector
                  initialValue={company.city_id}
                  options={provinces.map((item) => {
                    return { key: item.code, value: item.code, label: item.name };
                  })}
                  disabled
                />
              </FormItem>
            </div>

            <div className="flex flex-col w-full ">
              <FormItem name="district" className="w-full">
                <CustomSelector
                  initialValue={company.district_id}
                  options={districts.map((item) => {
                    return { key: item.code, value: item.code, label: item.name };
                  })}
                  disabled
                />
              </FormItem>
            </div>

            <div className="flex flex-col w-full ">
              <FormItem name="ward" className="w-full">
                <CustomSelector
                  initialValue={company.ward_id}
                  options={wards.map((item) => {
                    return { key: item.code, value: item.code, label: item.name };
                  })}
                  disabled
                />
              </FormItem>
            </div>
          </div>

          <div className="campaign">
            <p className="font-[400] text-[18px]">Địa chỉ chi tiết</p>
            <Form.Item name="detail_address" className="w-full">
              <Input
                size="large"
                placeholder={company.address}
                className="rounded-[10px] bg-white w-full"
                allowClear
                disabled
              />
            </Form.Item>
          </div>

          <div className="campaign">
            <p className="font-[400] text-[18px]">Số điện thoại</p>
            <Form.Item name="phone_number" className="w-full">
              <Input
                size="large"
                placeholder={company.phone}
                className="rounded-[10px] bg-white w-full"
                allowClear
                disabled
              />
            </Form.Item>
          </div>

          <div className="create-counpon flex flex-row gap-4">
            <div className="flex flex-col w-full ">
              <p className="font-[400] text-[18px]">Lĩnh vực hoạt động</p>
              <Form.Item name="field" className="w-full">
                <CustomSelector
                  initialValue={company.career_field_id}
                  options={[
                    { key: 0, value: 0, label: 'Nam' },
                    { key: 1, value: 1, label: 'Nữ' },
                  ]}
                  disabled
                />
              </Form.Item>
            </div>

            <div className="flex flex-col w-full ">
              <p className="font-[400] text-[18px]">Website</p>

              <Form.Item name="website" className="w-full">
                <Input
                  size="large"
                  placeholder={company.website_url}
                  className="rounded-[10px] bg-white w-full"
                  allowClear
                  disabled
                />
              </Form.Item>
            </div>
          </div>

          <div className="companyTextarea">
            <p className="font-[400] text-[18px]">
              Giới thiệu về công ty <span className="text-[#EB4C4C]">*</span>
            </p>
            <Form.Item className="w-full" name="description">
              <TextArea
                placeholder={company.introduce}
                className="rounded-[10px] bg-white w-full min-h-[200px]"
                disabled
              />
            </Form.Item>
          </div>
        </Form>
      </div>
    </>
  );
};
