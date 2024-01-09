import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { Breakpoint, styled } from '@mui/material/styles';
import Image from 'next/legacy/image';
import React, { useEffect, useState } from 'react';
import SrcIcons from '@/assets/icons';

interface IAlertDialogSlide {
  isOpen: boolean;
  preserveState?: boolean;
  size?: false | Breakpoint;
  actionChild?: React.ReactNode;
  contentChild?: React.ReactNode;
  transitionProps?: TransitionProps;
  cancelButton?: React.ReactNode;
  okButton?: React.ReactNode;
  onChange: (isOpen: boolean) => void;
  onCancel: (event) => void;
  onConfirm: (event) => void;
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const AlertDialogSlide: React.FC<IAlertDialogSlide> = (props: IAlertDialogSlide) => {
  const {
    isOpen,
    actionChild,
    contentChild,
    preserveState,
    onChange,
    onConfirm,
    onCancel,
    size,
    transitionProps,
  } = props;
  const [open, setOpen] = useState(isOpen ?? false);

  const handleClose = (event) => {
    setOpen(false);
    onChange(false);
    if (onCancel) {
      onCancel(event);
    }
  };
  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted={preserveState}
      disableScrollLock
      onClose={handleClose}
      classes={{
        paper: '!overflow-visible !rounded-[20px] !max-w-[2000px] !font-LexendDeca ',
        root: '!font-LexendDeca',
      }}
      {...transitionProps}
      maxWidth={size ?? 'lg'}
    >
      <DialogTitle>{contentChild}</DialogTitle>

      <DialogActions>{actionChild}</DialogActions>
      <div className="absolute  -right-[15px] -top-[15px] w-[48px] h-[48px] bg-transparent rounded-full">
        <Button
          onClick={handleClose}
          className="!min-w-[1px] h-full w-full p-0 m-0 bg-transparent rounded-full "
        >
          <Image src={SrcIcons.closeModal} layout="fill" />
        </Button>
      </div>
    </Dialog>
  );
};

export default AlertDialogSlide;
