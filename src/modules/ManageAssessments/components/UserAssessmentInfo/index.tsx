import IAssessment from '@/interfaces/models/IAssessment';
import { IUser } from '@/interfaces/models/IUser';
import React from 'react';

type Props = {
  assessmentInfo: IAssessment;
  userInfo: IUser;
};

export const UserAssessmentInfo = ({ assessmentInfo, userInfo }: Props) => {
  return (
    <>
      <div className="user-info container">
        <div className="user-info__name bg-white w-1/2 mx-auto rounded-[10px] py-3 px-5 text-center">
          <p className="font-title text-title leading-title mb-4">
            Kết quả: {assessmentInfo?.name}
          </p>
          <p className="font-title text-title leading-title">{userInfo?.name}</p>
        </div>
      </div>
    </>
  );
};
