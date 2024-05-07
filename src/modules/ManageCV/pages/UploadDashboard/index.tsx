import SrcIcons from '@/assets/icons';
import SrcImages from '@/assets/images';
import IUploadAssessment from '@/interfaces/models/IAssessment';
import { IAssessmentData } from '@/pages/quan-ly-cv/cv-ung-tuyen';
import { Common } from '@/shared/utils';
import { debounce } from '@mui/material';
import { Row, Table, Tooltip, User, useAsyncList, useCollator } from '@nextui-org/react';
import { Input, message } from 'antd';
import axios from 'axios';
import moment from 'moment';
import Image from 'next/legacy/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useMemo, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export interface IProps {
  assessments: IAssessmentData;
}

type AssessmentTable = {
  id: string | number;
  job_post_id: string | number;
  user_id: string | number;
  name?: string;
  email: string;
  phone: string;
  cv_path?: string;
  status_id: string | number;
  jobPost?: {
    id: number;
    title: string;
    slug: string;
    image_url: string;
  };
  jobEnterprise: {
    id: number;
    user_id: string | number;
    name: string;
    slug: string;
  };
  created_at?: string;
  updated_at?: string;
};

type data = {
  current_page: number;
  data: IUploadAssessment[];
};
const columns = [
  { name: 'TÊN TIN TUYỂN DỤNG', uid: 'name' },
  { name: 'TÊN DOANH NGHIỆP', uid: 'enterpriseName' },
  { name: 'TÊN ỨNG VIÊN', uid: 'userName' },
  { name: 'NGÀY ỨNG TUYỂN', uid: 'date' },
  { name: 'DOWNLOAD CV', uid: 'download' },
];

const mapToTableData = (assessments: any) =>
  assessments &&
  assessments?.map((item) => ({
    id: item.id,
    job_post_id: item.job_post_id,
    user_id: item.user_id,
    name: item.name,
    email: item.email,
    phone: item.phone,
    cv_path: item.cv_path,
    status_id: item.status_id,
    jobPost: item.jobPost,
    jobEnterprise: item.jobEnterprise,
    created_at: item.created_at,
    updated_at: item.updated_at,
    postName: item.postName,
    image_url: item.image_url,
    post_slug: item.post_slug,
    jobEnterprise_name: item.jobEnterprise_name,
    jobEnterprise_slug: item.jobEnterprise_slug,
    jobEnterprise_id: item.jobEnterprise_id,
  }));

export function AssessmentDashboard(props: IProps) {
  const { assessments } = props;
  const router = useRouter();
  const rootData = useMemo(() => mapToTableData(assessments), [assessments]);
  const [filtedData, setFiltedData] = useState<AssessmentTable[]>(rootData);
  const [dataTable, setDataTable] = useState<AssessmentTable[]>(rootData);
  console.log('🚀 ~ file: index.tsx:75 ~ AssessmentDashboard ~ dataTable:', dataTable);

  const collator = useCollator({ numeric: true });
  const load = async ({ signal }) => {
    return {
      items: dataTable,
    };
  };
  const sort = useCallback(async ({ items, sortDescriptor }) => {
    const sortedItems = items.sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      let cmp = collator.compare(first, second);
      if (sortDescriptor.direction === 'descending') {
        cmp *= -1;
      }
      return cmp;
    });
    setDataTable(sortedItems);
    return {
      items: sortedItems,
    };
  }, []);

  const handleSearch = useCallback(
    debounce((value: string) => {
      if (value === '') {
        return setDataTable(filtedData);
      }

      try {
        const newData = filtedData.filter((item) =>
          Common.removeVietnameseTones(item.name)
            .toLowerCase()
            .includes(Common.removeVietnameseTones(value).toLowerCase())
        );
        setDataTable(newData);
      } catch (error) {
        message.warning('Không tìm thấy kết quả!');
      }
    }, 500),
    [dataTable, filtedData]
  );

  const onSearch = (event) => {
    const { value } = event.target;
    handleSearch(value);
  };

  const handleFileSelect = async (event, id) => {
    event.preventDefault();
    const formData = new FormData();
    const files = event.target.files[0];
    if (!files) {
      console.error('No file selected');
      return;
    }
    formData.append('file', files);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_JOB_URL}/cv/uploadNewCv/${id}`,
        formData
      );
      toast.success('Upload new cv successfully!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to submit form. Please try again.');
    }
  };

  // useEffect(() => {
  //   const routerQuery = router.query;
  //   const queryKey = Object.keys(routerQuery)[0];
  //   const queryValue = routerQuery[queryKey];
  //   if (queryKey === 'type' && queryValue) {
  //     setDataTable(
  //       filtedData.filter((item) => item.assessmentType === Number(queryValue))
  //     );
  //   }
  // }, [router.query]);

  function downloadFile(path, file_name) {
    fetch(path)
      .then((response) => response.arrayBuffer())
      .then((buffer) => {
        const url = URL.createObjectURL(new Blob([buffer], { type: 'application/pdf' }));
        const link = document.createElement('a');
        link.href = url;
        link.download = file_name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      });
  }

  const list = useAsyncList({ load, sort });
  const renderCell = (item: any, columnKey: React.Key) => {
    console.log('🚀 ~ file: index.tsx:188 ~ renderCell ~ item:', item);
    const cellValue = item[columnKey];
    switch (columnKey) {
      case 'name':
        return (
          <Link
            href={`https://job.youth.com.vn/job/job-detail/${item?.post_slug}/${item?.id}`}
            target="_blank"
          >
            <User
              squared
              src={item?.image_url ?? SrcImages.placeholder}
              size="xl"
              name={item?.postName}
            ></User>
          </Link>
        );
      case 'download':
        return (
          <Row align="flex-start">
            <Tooltip content="Tải CV" css={{ marginRight: 20 }}>
              <div className="flex w-fit items-center justify-center bg-grey-lighter">
                <Link
                  target="_blank"
                  href={`https://youthplus.s3.ap-northeast-1.amazonaws.com/${item?.cv_path}`}
                >
                  <label className="w-fit flex flex-col items-center px-2 py-3 text-white bg-green-300 text-blue rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue">
                    <span className="text-sm leading-normal m-0">Download CV</span>
                    {/* <button
                      className="hidden"
                      onClick={() => downloadFile(item?.cv_path, item?.name)}
                    /> */}
                  </label>
                </Link>
              </div>
            </Tooltip>
          </Row>
        );
      case 'enterpriseName':
        return (
          <Link
            href={`https://job.youth.com.vn/job/company-detail/${item?.jobEnterprise_slug}/${item?.jobEnterprise_id}`}
            target="_blank"
          >
            <p>{item?.jobEnterprise_name}</p>
          </Link>
        );
      case 'userName':
        return item?.name;
      case 'date':
        return item?.created_at;
      default:
        return cellValue;
    }
  };
  return (
    <>
      <div className="relative">
        <div className="flex mb-[1rem] gap-3">
          <Input
            size="large"
            placeholder="Tìm kiếm tên bài test"
            className="rounded-[10px] bg-white"
            allowClear
            onChange={onSearch}
            prefix={<Image src={SrcIcons.searchIcon} width={18} height={18} />}
          />
        </div>
        <div className="counter pointer-events-none absolute z-10 bottom-[1rem] translate-x-[100px]">
          Tổng số CV: {dataTable?.length}
        </div>
        <Table
          selectionMode="none"
          lang="vi"
          sticked={false}
          lined
          autoSave="true"
          suppressHydrationWarning
          aria-label="Danh sách CV"
          aria-labelledby="Danh sách CV"
          css={{ background: 'white' }}
          striped
          color="secondary"
          sortDescriptor={list.sortDescriptor}
          onSortChange={list.sort}
        >
          <Table.Header columns={columns}>
            {(column) => (
              <Table.Column
                key={column.uid}
                align={'start'}
                allowsSorting={column.uid !== 'actions' && column.uid !== 'published'}
              >
                {column.name}
              </Table.Column>
            )}
          </Table.Header>
          <Table.Body items={dataTable} loadingState={list.loadingState}>
            {(item: AssessmentTable) => (
              <Table.Row css={{ background: 'red' }}>
                {(columnKey) => (
                  <Table.Cell css={{ background: 'red' }}>
                    {renderCell(item, columnKey)}
                  </Table.Cell>
                )}
              </Table.Row>
            )}
          </Table.Body>
          <Table.Pagination
            noMargin
            align="center"
            rowsPerPage={7}
            initialPage={1}
            total={Math.ceil(dataTable?.length / 7)}
            onPageChange={(page) => console.log({ page })}
          ></Table.Pagination>
        </Table>
        <ToastContainer />
      </div>
    </>
  );
}
