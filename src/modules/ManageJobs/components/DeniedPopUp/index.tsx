import AlertDialogSlide from '@/components/Modal';
import { Form } from 'antd';
import { useEffect, useState } from 'react';
import { DENIED_POP_UP } from '../../shared/enum';
import RejectReasonForm, { RejectReasonFormJob } from './RejectReasonForm';
type Props = {
  open: boolean;
  onChange(openState: boolean): void;
  type: DENIED_POP_UP;
  id: string | number;
  update?(status: string): void;
};

type PropsJob = {
  open: boolean;
  onChange(openState: boolean): void;
  type: DENIED_POP_UP;
  id: string | number;
  update?(status: string): void;
  info: object;
};

export function DeniedPopUpJob({ open, onChange, type, id, update, info }: PropsJob) {
  const [data, setData] = useState('');
  return (
    <>
      <AlertDialogSlide
        isOpen={open}
        size="lg"
        preserveState
        contentChild={
          <RejectReasonFormJob
            type={type}
            onChange={onChange}
            id={id}
            data={data}
            update={update}
            info={info}
          />
        }
        onCancel={() => {
          setData(null);
          onChange(false);
        }}
        onChange={() => {
          setData(null);
          onChange(false);
        }}
        onConfirm={() => { }}
      />
    </>
  );
}

export default function DeniedPopUp({ open, onChange, type, id, update }: Props) {
  const [data, setData] = useState('');
  return (
    <>
      <AlertDialogSlide
        isOpen={open}
        size="lg"
        preserveState
        contentChild={
          <RejectReasonForm
            type={type}
            onChange={onChange}
            id={id}
            data={data}
            update={update}
          />
        }
        onCancel={() => {
          setData(null);
          onChange(false);
        }}
        onChange={() => {
          setData(null);
          onChange(false);
        }}
        onConfirm={() => { }}
      />
    </>
  );
}
