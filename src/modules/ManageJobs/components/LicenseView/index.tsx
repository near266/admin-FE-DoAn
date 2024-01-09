import AlertDialogSlide from '@/components/Modal';
import React from 'react';
import PDF from './PDF';

export interface IProps {
  open: boolean;
  onChange(openState: boolean): void;
  fileUrl: string;
}

export function LicenseView({ open, onChange, fileUrl }: IProps) {
  return (
    <>
      <div className="overflow-y-hidden ">
        <AlertDialogSlide
          size="lg"
          isOpen={open}
          contentChild={<PDF notScroll={false} fileUrl={fileUrl} />}
          onChange={(value) => {
            onChange(value);
          }}
          onCancel={() => {}}
          onConfirm={() => {}}
        />
      </div>
    </>
  );
}
