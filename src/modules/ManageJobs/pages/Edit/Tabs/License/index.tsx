import SrcIcons from '@/assets/icons';
import { CustomSelector } from '@/components/CustomSelector';
import { IconButton } from '@mui/material';
import { Button, Form, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { DENIED_POP_UP, JOBS_STATUS, JOBS_STATUS_NUMERIC } from '../../../../shared/enum';
import Image from 'next/legacy/image';
import { LicenseView } from '../../../../components/LicenseView';
import { jobService, TStatusUpdate } from '@/modules/ManageJobs/shared/api';
import { useRouter } from 'next/router';
import { appLibrary } from '@/shared/utils/loading';
import DeniedPopUp from '@/modules/ManageJobs/components/DeniedPopUp';
import clsx from 'clsx';
import { SV_RES_STATUS_CODE } from '@/shared/enums/enums';
import { TAccount } from '@/pages/quan-ly-thanh-vien/doanh-nghiep/chinh-sua/[id]';

export interface IProps {
  account: TAccount;
}

export function LicenseForm() {
  const [isLoading, setIsLoading] = useState(true);
  const [openLicense, setOpenLicense] = useState(false);
  const [fileUrl, setFileUrl] = useState('');
  const [enterpriseStatus, setEnterpriseStatus] = useState<string>('');
  const router = useRouter();
  const [openDinedPopUp, setOpenDinedPopUp] = useState(false);
  const toggle = (value: boolean) => {
    setOpenDinedPopUp(value);
  };

  const updateStatus = (status: string) => {
    setEnterpriseStatus(status);
  };

  const getLicense = async () => {
    const { id } = router.query;
    const res = await jobService.getEnterpriseLicense(id as string);
    if (res.data) {
      setFileUrl(res.data);
    } else {
      console.log('Không có giấy phép kinh doanh');
    }
  };

  const getStatus = async () => {
    const { id } = router.query;
    appLibrary.showloading();
    try {
      const {
        data: { status },
      } = await jobService.getEnterpriseStatus(id as string);
      if (status) {
        setEnterpriseStatus(status);
        appLibrary.hideloading();
        return;
      }
      console.log('cant load status');
      appLibrary.hideloading();
    } catch (error) {
      console.log(error);
      appLibrary.hideloading();
    }
  };

  useEffect(() => {
    try {
      if (isLoading) {
        getStatus().then(() => {
          setIsLoading(false);
        });
        getLicense();
      }
    } catch (error) {
      console.log(error.message);
    }
  }, []);

  const onStatusChange = async (id: string, data: TStatusUpdate) => {
    try {
      appLibrary.showloading();
      const { code } = await jobService.updateEnterpriseStatus(data);
      if (code === SV_RES_STATUS_CODE.success) {
        appLibrary.hideloading();
        console.log(JOBS_STATUS[JOBS_STATUS_NUMERIC[data.status]]);
        setEnterpriseStatus(
          data.status === JOBS_STATUS_NUMERIC.PENDING
            ? 'PENDING'
            : JOBS_STATUS_NUMERIC.APPROVED
              ? 'APPROVED'
              : 'REJECTED'
        );
        return message.success('Cập nhật thành công');
      }
      appLibrary.hideloading();
      message.error('Cập nhật chưa thành công');
    } catch (error) {
      appLibrary.hideloading();
      return message.error('Cập nhật chua thành công');
    }
  };

  const handleStatusChange = async (id: string, value: JOBS_STATUS_NUMERIC) => {
    if (value === JOBS_STATUS_NUMERIC.REJECTED) {
      setOpenDinedPopUp(true);
      return;
    }
    const data = {
      status: value,
    };
    onStatusChange(id, data);
  };

  return isLoading ? (
    <></>
  ) : (
    <>
      <LicenseView
        fileUrl={fileUrl}
        open={openLicense}
        onChange={(value) => {
          setOpenLicense(value);
        }}
      />
      <DeniedPopUp
        onChange={toggle}
        open={openDinedPopUp}
        type={DENIED_POP_UP.COMPANY}
        id={router.query.id as string}
        update={updateStatus}
      />
      <div className="min-w-[900px] coupon">
        <Form
          name="basic"
          initialValues={{ remember: true }}
          onFinish={() => { }}
          onFinishFailed={() => { }}
          autoComplete="off"
          className="flex flex-col gap-[8px]"
        >
          <div className="create-counpon flex flex-row gap-4 border-solid border-b border-[#D5D5DC] pb-5">
            <div className="flex flex-col w-full ">
              <p className="font-[400]  text-[18px] leading-title">Trạng thái</p>
            </div>

            <div className="flex flex-col w-full ">
              <p
                className={clsx(
                  'font-[400]  text-[18px] leading-title',
                  enterpriseStatus === 'APPROVED'
                    ? 'text-[#30AB7E]'
                    : enterpriseStatus === 'PENDING'
                      ? 'text-[#3BB1CF]'
                      : ''
                )}
              >
                {JOBS_STATUS[enterpriseStatus]}
              </p>
            </div>

            <div className="flex flex-col w-1/3 ">
              <CustomSelector
                initialValue={JOBS_STATUS_NUMERIC[enterpriseStatus]}
                onChange={(value) => {
                  handleStatusChange(router.query.id as string, value);
                }}
                options={[
                  {
                    key: JOBS_STATUS_NUMERIC.APPROVED,
                    value: JOBS_STATUS_NUMERIC.APPROVED,
                    label: JOBS_STATUS.APPROVED,
                  },
                  {
                    key: JOBS_STATUS_NUMERIC.PENDING,
                    value: JOBS_STATUS_NUMERIC.PENDING,
                    label: JOBS_STATUS.PENDING,
                  },
                  {
                    key: JOBS_STATUS_NUMERIC.REJECTED,
                    value: JOBS_STATUS_NUMERIC.REJECTED,
                    label: JOBS_STATUS.REJECTED,
                  },
                ]}
              />
            </div>
          </div>

          <div className="create-counpon flex flex-row gap-4 border-solid border-b border-[#D5D5DC] pb-5">
            <div className="flex flex-col w-full gap-[10px]">
              <p className="font-[400] text-[18px] leading-title">
                Giấy phép kinh doanh hợp lệ
              </p>
              <ul className="text-[#696974] text-[16px] list-disc ml-5">
                <li className="text-[16px]">
                  Có dấu giáp lai của cơ quan có thẩm quyền.
                </li>
                <li className="text-[16px]">
                  Trường hợp có giấy phép kinh doanh là bản photo thì phải có dấu công
                  chứng.
                </li>
                <li className="text-[16px]">Dung lượng file không quá 5mb</li>
              </ul>
            </div>

            <div className="flex flex-col w-full gap-[10px]">
              <Form.Item name="license" className="w-full">
                {fileUrl ? (
                  <IconButton
                    className="!rounded-[10px] !p-0"
                    onClick={() => {
                      setOpenLicense(true);
                    }}
                  >
                    <Image src={SrcIcons.attachment} height={20} width={20} />
                    &nbsp;
                    <p className="font-[400] text-[16px] ">Giấy phép kinh doanh</p>
                  </IconButton>
                ) : (
                  <h2>Chưa có giấy phép kinh doanh</h2>
                )}
              </Form.Item>
            </div>
          </div>

          <div className="create-counpon flex flex-row gap-4 pb-5">
            <div className="flex flex-col w-full gap-[10px]">
              <p className="font-[400] text-[18px] leading-title">Giấy tờ bổ sung</p>
              <ul className="text-[#696974] text-[16px] ">
                <li className="text-[16px]">Giấy tờ bổ sung</li>
              </ul>
            </div>

            <div className="flex flex-col w-full gap-[10px]">
              <Form.Item name="additional_license" className="w-full">
                <IconButton className="!rounded-[10px] !p-0" onClick={() => { }}>
                  <Image src={SrcIcons.attachment} height={20} width={20} />
                </IconButton>
              </Form.Item>
            </div>
          </div>

          <Form.Item>
            <Button
              className="bg-primary hover:bg-primary text-white hover:text-white focus:bg-primary focus:text-white rounded-[10px] font-[600] leading-[21px] flex justify-center items-center w-auto px-[20px] py-[20px] drop-shadow-[0_0px_7px_rgba(41,41,50,0.1)]"
              htmlType="submit"
            >
              Lưu thay đổi
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
}
