import BussinessPackageOrder from "@/modules/ManageJobs/pages/Edit/Tabs/PackageInfo/pages/BussinessPackage";
import { IGetListLicenseRes } from "@/modules/ManageJobs/pages/Edit/Tabs/PackageInfo/shared/interface";
import { NextPage } from "next";

export interface IProps {
    license: IGetListLicenseRes;
  }

const UpdateBussinessOrder: NextPage = (props: IProps) => {
    return (
      <>
        <BussinessPackageOrder type={'edit'} />
      </>
    );
};

export default UpdateBussinessOrder;
