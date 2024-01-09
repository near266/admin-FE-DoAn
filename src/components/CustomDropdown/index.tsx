import { ClickAwayListener, Popper } from '@mui/material';
import { useEffect, useRef, useState } from 'react';

import autoAnimate from '@formkit/auto-animate';
import clsx from 'clsx';
const CustomDropdown = (props) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const animateRef = useRef<HTMLDivElement>();

  const handleClick = (e) => {
    setAnchorEl(anchorEl ? null : e.currentTarget);
  };

  const handleClickAway = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  useEffect(() => {
    if (open && animateRef.current) {
      autoAnimate(animateRef.current);
    }
  }, [open]);
  return (
    <>
      <div className="h-full" onClick={handleClick}>
        {props.children}
      </div>
      {open && (
        <ClickAwayListener onClickAway={handleClickAway}>
          <Popper
            disablePortal
            className="z-20 right-0"
            open={open}
            placement="bottom"
            anchorEl={anchorEl}
            keepMounted
          >
            <div
              ref={animateRef}
              className={clsx(
                'duration-500 transition-all ease opacity-0 ',
                open && 'opacity-100'
              )}
            >
              {props.dropdownMenu}
            </div>
          </Popper>
        </ClickAwayListener>
      )}
    </>
  );
};

export default CustomDropdown;
