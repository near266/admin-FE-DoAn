import SrcIcons from '@/assets/icons';
import SrcImages from '@/assets/images';
import IAssessment from '@/interfaces/models/IAssessment';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { IAssessmentData } from '@/pages/quan-ly-cv/cv-ung-tuyen';
import {
  AssessmentStatusCode,
  AssessmentTypeNumeric,
  AssessmentTypeToAssessmentTypeNumeric,
} from '@/shared/enums/enums';
import { Common } from '@/shared/utils';
import { debounce } from '@mui/material';
import { Row, Table, Tooltip, User, useAsyncList, useCollator } from '@nextui-org/react';
import { Button, Input, message } from 'antd';
import Image from 'next/legacy/image';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export interface IProps {
  assessments: IAssessmentData;
}

type AssessmentTable = {
  id: string | number;
  name?: string;
  descriptions?: string;
  slug: string;
  avatar?: string;
  path?: string;
  file_name?: string;
  sale_price: number;
  time?: string;
  assessmentType?: AssessmentTypeNumeric;
  status: AssessmentStatusCode;
};

type data = {
  current_page: number;
  data: IAssessment[];
};
const columns = [
  { name: 'TÊN ỨNG VIÊN', uid: 'name' },
  { name: 'TẢI CV', uid: 'download' },
  { name: 'UPLOAD CV', uid: 'upload' },
];

const mapToTableData = (assessments: data) =>
  assessments &&
  assessments.data.map((item) => ({
    id: item.id,
    name: item.name,
    slug: item.slug,
    avatar: item.avatar,
    path: item.path,
    file_name: item.file_name,
    descriptions: item.description,
    sale_price: item.sale_price,
    assessmentType: AssessmentTypeToAssessmentTypeNumeric(item.assessment_type),
    status: item.status,
    time: new Date(item.updated_at).toLocaleString(),
  }));

export function AssessmentDashboard(props: IProps) {
  const { assessments } = props;
  const router = useRouter();
  const rootData = useMemo(() => mapToTableData(assessments), [assessments]);
  const [filtedData, setFiltedData] = useState<AssessmentTable[]>(rootData);
  const [dataTable, setDataTable] = useState<AssessmentTable[]>(rootData);

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

  useEffect(() => {
    const routerQuery = router.query;
    const queryKey = Object.keys(routerQuery)[0];
    const queryValue = routerQuery[queryKey];
    if (queryKey === 'type' && queryValue) {
      setDataTable(
        filtedData.filter((item) => item.assessmentType === Number(queryValue))
      );
    }
  }, [router.query]);

  function downloadFile(path, file_name) {
    fetch(path)
      .then((response) => response.arrayBuffer())
      .then((buffer) => {
        const url = URL.createObjectURL(new Blob([buffer]));
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
  const renderCell = (item: AssessmentTable, columnKey: React.Key) => {
    console.log('🚀 ~ file: index.tsx:188 ~ renderCell ~ item:', item);
    const cellValue = item[columnKey];
    switch (columnKey) {
      case 'name':
        return (
          <User
            squared
            src={item?.avatar ?? SrcImages.placeholder}
            size="xl"
            name={cellValue}
          ></User>
        );
      case 'download':
        return (
          <Row align="flex-start">
            <Tooltip content="Tải CV" css={{ marginRight: 20 }}>
              {/* <Button
                type="primary"
                onClick={() => downloadFile(item?.path, item?.file_name)}
              >
                Tai cv
              </Button> */}
              <div className="flex w-fit items-center justify-center bg-grey-lighter">
                <label className="w-fit flex flex-col items-center px-2 py-3 text-white bg-green-300 text-blue rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue">
                  <span className="text-sm leading-normal m-0">Download CV</span>
                  <button
                    className="hidden"
                    onClick={() => downloadFile(item?.path, item?.file_name)}
                  />
                </label>
              </div>
            </Tooltip>
          </Row>
        );
      case 'upload':
        return (
          <Row align="flex-start">
            <Tooltip content="Upload CV" css={{ marginRight: 20 }}>
              {/* <input
                className="w-fit"
                type="file"

              /> */}
              {/* <input
                className="block w-full text-xs h-6 text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                id="small_size"
                type="file"
                onChange={(event) => handleFileSelect(event, item?.id)}
              ></input> */}
              <div className="flex w-fit items-center justify-center bg-grey-lighter">
                <label className="w-fit flex flex-col items-center px-2 py-3 bg-white text-blue rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue hover:text-green-300">
                  <span className="text-sm leading-normal m-0">Select a file</span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(event) => handleFileSelect(event, item?.id)}
                  />
                </label>
              </div>
            </Tooltip>
          </Row>
        );
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
          Tổng số CV: {dataTable.length}
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
            total={Math.ceil(dataTable.length / 7)}
            onPageChange={(page) => console.log({ page })}
          ></Table.Pagination>
        </Table>
        <ToastContainer />
      </div>
    </>
  );
}
