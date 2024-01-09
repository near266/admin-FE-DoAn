import { Form, Input, Button, message } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import { DENIED_POP_UP, JOBS_STATUS_NUMERIC } from '../../shared/enum';
import { useForm } from 'antd/lib/form/Form';
import { useEffect, useState } from 'react';
import { jobService } from '../../shared/api';
import { SV_RES_STATUS_CODE } from '@/shared/enums/enums';
import { appLibrary } from '@/shared/utils/loading';

interface IProps {
  type: DENIED_POP_UP;
  onChange(openState: boolean): void;
  id: string | number;
  data?: any;
  update?(status: string): void;
}

interface IPropsJob {
  type: DENIED_POP_UP;
  onChange(openState: boolean): void;
  id: string | number;
  data?: any;
  update?(status: string): void;
  info: object;
}
const { TextArea } = Input;

function RejectReasonForm({ type, onChange, id, data, update }: IProps) {
  const [form] = useForm();

  useEffect(() => {
    form.setFieldsValue({
      reason: data,
    });

    return () => {
      form.resetFields;
    };
  }, [data]);

  const handleEnterprise = async (reason) => {
    const data = {
      status: JOBS_STATUS_NUMERIC.REJECTED,
      reason_of_rejection: reason
    };
    console.log(data);
    appLibrary.showloading();
    try {
      const response = await jobService.updateEnterpriseStatus(data);
      console.log(response);
      if (response.code === SV_RES_STATUS_CODE.success) {
        update('REJECTED');
        message.success('Cập nhật thành công');
        appLibrary.hideloading();
        form.resetFields();
        return;
      }
      message.error('Cập nhật chưa thành công');
      form.resetFields();
      appLibrary.hideloading();
    } catch (error) {
      console.log(error);
      form.resetFields();
      appLibrary.hideloading();
    }
  };

  const handleRecruitNews = async (reason: string) => {
    const data = {
      // status_id: JOBS_STATUS_NUMERIC.REJECTED,
      // reason_of_rejection: reason,
      status: JOBS_STATUS_NUMERIC.REJECTED,
      api_key: 'ywvJro$Dna5p11dGg$Q7L3dI#',
      
    };
    appLibrary.showloading();
    try {
      const response = await jobService.updateJobPostStatus(id, data);
      if (response.code === SV_RES_STATUS_CODE.success) {
        message.success('Cập nhật thành công');
        form.resetFields();
        appLibrary.hideloading();
        return;
      }
      message.error('Cập nhật chưa thành công');
      form.resetFields();
      appLibrary.hideloading();
    } catch (error) {
      console.log(error);
      form.resetFields();
      appLibrary.hideloading();
    }
  };

  return (
    <>
      <div className="min-w-[900px] rejectReasonForm">
        <Form
          form={form}
          name="basic"
          initialValues={{ remember: true }}
          onFinish={(value) => {
            type === DENIED_POP_UP.COMPANY
              ? handleEnterprise(value.reason)
              : handleRecruitNews(value.reason);
            onChange(false);
          }}
          onFinishFailed={() => { }}
          autoComplete="off"
          className="flex flex-col gap-[8px]"
        >
          <h3 className="font-[600] text-[28px] leading-title">{type}</h3>
          <FormItem name="reason">
            <TextArea
              size="large"
              placeholder="Điền lý do từ chối"
              className="rounded-[10px] bg-white w-full min-h-[200px]"
            />
          </FormItem>
          <div className="flex flex-row ml-auto gap-4">
            <Form.Item>
              <Button
                className="bg-primary hover:bg-primary text-white hover:text-white focus:bg-primary focus:text-white rounded-[10px] font-[600] leading-[21px] flex justify-center items-center w-auto px-[20px] py-[20px] drop-shadow-[0_0px_7px_rgba(41,41,50,0.1)]"
                onClick={() => {
                  form.resetFields;
                  onChange(false);
                }}
              >
                Hủy
              </Button>
            </Form.Item>

            <Form.Item>
              <Button
                className="bg-primary hover:bg-primary text-white hover:text-white focus:bg-primary focus:text-white rounded-[10px] font-[600] leading-[21px] flex justify-center items-center w-auto px-[20px] py-[20px] drop-shadow-[0_0px_7px_rgba(41,41,50,0.1)]"
                htmlType="submit"
              >
                Gửi
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>
    </>
  );
}

export function RejectReasonFormJob({ type, onChange, id, data, update, info }: IPropsJob) {
  const [form] = useForm();

  useEffect(() => {
    form.setFieldsValue({
      reason: data,
    });

    return () => {
      form.resetFields;
    };
  }, [data]);

  const handleEnterprise = async (reason) => {
    const data = {
      status: JOBS_STATUS_NUMERIC.REJECTED,
      reason_of_rejection: reason,
      user_id: info["user_id"],
      email: info["email"],
      api_key: info["api_key"],
    };
    console.log(data);
    appLibrary.showloading();
    try {
      const response = await jobService.updateEnterpriseStatus(data);
      console.log(response);
      if (response.code === SV_RES_STATUS_CODE.success) {
        update('REJECTED');
        message.success('Cập nhật thành công');
        appLibrary.hideloading();
        form.resetFields();
        return;
      }
      message.error('Cập nhật chưa thành công');
      form.resetFields();
      appLibrary.hideloading();
    } catch (error) {
      console.log(error);
      form.resetFields();
      appLibrary.hideloading();
    }
  };

  const handleRecruitNews = async (reason: string) => {
    const data = {
      // status_id: JOBS_STATUS_NUMERIC.REJECTED,
      // reason_of_rejection: reason,
      status: JOBS_STATUS_NUMERIC.REJECTED,
      api_key: 'ywvJro$Dna5p11dGg$Q7L3dI#',
    };
    appLibrary.showloading();
    try {
      const response = await jobService.updateJobPostStatus(id, data);
      if (response.code === SV_RES_STATUS_CODE.success) {
        message.success('Cập nhật thành công');
        form.resetFields();
        appLibrary.hideloading();
        return;
      }
      message.error('Cập nhật chưa thành công');
      form.resetFields();
      appLibrary.hideloading();
    } catch (error) {
      console.log(error);
      form.resetFields();
      appLibrary.hideloading();
    }
  };

  return (
    <>
      <div className="min-w-[900px] rejectReasonForm">
        <Form
          form={form}
          name="basic"
          initialValues={{ remember: true }}
          onFinish={(value) => {
            type === DENIED_POP_UP.COMPANY
              ? handleEnterprise(value.reason)
              : handleRecruitNews(value.reason);
            onChange(false);
          }}
          onFinishFailed={() => { }}
          autoComplete="off"
          className="flex flex-col gap-[8px]"
        >
          <h3 className="font-[600] text-[28px] leading-title">{type}</h3>
          <FormItem name="reason">
            <TextArea
              size="large"
              placeholder="Điền lý do từ chối"
              className="rounded-[10px] bg-white w-full min-h-[200px]"
            />
          </FormItem>
          <div className="flex flex-row ml-auto gap-4">
            <Form.Item>
              <Button
                className="bg-primary hover:bg-primary text-white hover:text-white focus:bg-primary focus:text-white rounded-[10px] font-[600] leading-[21px] flex justify-center items-center w-auto px-[20px] py-[20px] drop-shadow-[0_0px_7px_rgba(41,41,50,0.1)]"
                onClick={() => {
                  form.resetFields;
                  onChange(false);
                }}
              >
                Hủy
              </Button>
            </Form.Item>

            <Form.Item>
              <Button
                className="bg-primary hover:bg-primary text-white hover:text-white focus:bg-primary focus:text-white rounded-[10px] font-[600] leading-[21px] flex justify-center items-center w-auto px-[20px] py-[20px] drop-shadow-[0_0px_7px_rgba(41,41,50,0.1)]"
                htmlType="submit"
              >
                Gửi
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>
    </>
  );
}

export default RejectReasonForm;
