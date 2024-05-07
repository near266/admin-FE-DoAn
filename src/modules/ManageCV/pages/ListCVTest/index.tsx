import SrcIcons from '@/assets/icons';
import { appLibrary } from '@/shared/utils/loading';
import { IconButton } from '@/components/IconButton';
import {
  Checkbox,
  Col,
  Row,
  styled,
  Table,
  Tooltip,
  useAsyncList,
  useCollator,
  User,
} from '@nextui-org/react';
import { Button, DatePicker, Form, Input, message, Popconfirm, Select } from 'antd';
import Image from 'next/legacy/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { formatServerDateToDurationString } from '@/shared/helpers';
import FormItem from 'antd/lib/form/FormItem';
import moment from 'moment';
import { IGetListLicenseRes } from '../../shared/interface';
import { assessmentService } from '../../shared/api';

export interface IProps {
  license: IGetListLicenseRes[];
}

const columns = [
  { name: 'HỌ VÀ TÊN', uid: 'fullName' },
  { name: 'TÊN BÀI TEST', uid: 'assessment_id' },
  { name: 'LĨNH VỰC', uid: 'field' },
  { name: 'SỐ ĐIỂM', uid: 'result' },
  { name: 'NGÀY TẠO', uid: 'updated_at' },
  { name: 'XEM CV', uid: 'cvPath' },
];

const assessmentNames = {
  153: 'Đánh giá nghề Sale & Marketing',
  155: 'Đánh giá nghề Công nghệ thông tin',
  156: 'Đánh giá nghề Tài chính - Kế toán',
  157: 'Đánh giá nghề Vận hành',
  159: 'Đánh giá nghề Quản gia cao cấp',
};

const mapToTableData = (license: IGetListLicenseRes[]) =>
  license &&
  license.map((item) => ({
    id_assessment_user: item.id_assessment_user,
    name: item.name,
    // year_of_birth: item.year_of_birth,
    // avatar: item.avatar,
    gender: item.gender,
    assessment_id: item.assessment_id,
    status: item.status,
    field: item.field,
    cvPath: item.cvPath,
    assessment_Test_Results: {
      // id: item.assessment_Test_Results.id,
      // assessment_id: item.assessment_Test_Results.assessment_id,
      // user_id: item.assessment_Test_Results.user_id,
      result: item.assessment_Test_Results.result,
      // suggestion_id: item.assessment_Test_Results.suggestion_id,
      // created_at: item.assessment_Test_Results.created_at,
      updated_at: item.assessment_Test_Results.updated_at,
    },
  }));

function downloadFile(path, file_name) {
  const link = document.createElement('a');
  link.href = path;
  link.download = file_name;
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function ListCVTestDashboard(props: IProps) {
  const { license } = props;
  const [form] = Form.useForm();
  const rootData = useMemo(() => mapToTableData(license), [license]);
  const [dataTable, setDataTable] = useState<IGetListLicenseRes[]>(rootData);
  const collator = useCollator({ numeric: true });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number>(0);

  const load = async ({ signal }) => {
    return {
      items: dataTable,
    };
  };
  const handleResetForm = () => {
    form.resetFields();
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

  const list = useAsyncList({ load, sort });

  useEffect(() => {
    const fetchData = async () => {
      appLibrary.showloading();
      try {
        const params = {
          account_id: 'c4ca4238a0b923820dcc509a6f75849b',
          page: page,
          pageSize: 10,
          assessment_Test_Results: {},
        };
        const response = await assessmentService.getListCV(params);
        console.log(response.data);
        if (response.data && response.data.length > 0) {
          appLibrary.hideloading();
          setDataTable(response.data);
          const totalPages = Math.ceil(response.totalCount / 10);
          setTotalPages(totalPages);
          console.log('thuonggg: ', dataTable);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        appLibrary.hideloading();
      }
    };
    fetchData();
  }, [page]);

  const renderCell = (item: IGetListLicenseRes, columnKey: React.Key) => {
    const cellValue = item[columnKey];
    switch (columnKey) {
      case 'fullName':
        return (
          <Col>
            <Row>
              <span className="text-[14px]">{item.name}</span>
            </Row>
          </Col>
        );
      case 'assessment_id':
        return (
          <Col>
            <Row align="center">
              <span className="text-[14px]">{assessmentNames[item.assessment_id]}</span>
            </Row>
          </Col>
        );
      case 'field':
        return (
          <Col>
            <Row align="center">
              <span className="text-[14px]">{item.field}</span>
            </Row>
          </Col>
        );
      case 'result':
        return (
          <Col>
            <Row align="center">
              <span className="text-[14px]">{item.assessment_Test_Results.result}</span>
            </Row>
          </Col>
        );
      case 'updated_at':
        return (
          <Col>
            <Row align="center">
              <span className="text-[14px]">
                {moment(item.assessment_Test_Results.updated_at).format('DD/MM/YYYY')}
              </span>
            </Row>
          </Col>
        );
      case 'cvPath':
        return (
          <Col>
            <Row align="center">
              <Tooltip content="Xem CV">
                <IconButton onClick={() => downloadFile(item?.cvPath, item?.name)}>
                  <Image src={SrcIcons.download} height={24} width={24} />
                </IconButton>
              </Tooltip>
            </Row>
          </Col>
        );
      default:
        return cellValue;
    }
  };

  const handleFormSubmit = () => {};

  return (
    <>
      <div className="relative">
        <Form
          form={form}
          onFinish={handleFormSubmit}
          className="flex mb-[1rem] gap-3 justify-between"
        >
          <FormItem className="w-1/6">
            <Input
              size="large"
              placeholder="HỌ VÀ TÊN"
              className="rounded-[10px] bg-white w-full"
              allowClear
            />
          </FormItem>
          <FormItem className="w-1/6">
            <Input
              size="large"
              placeholder="TÊN BÀI TEST"
              className="rounded-[10px] bg-white w-full"
              allowClear
            />
          </FormItem>
          <FormItem className="w-1/6">
            <Select
              size="large"
              className="!w-full"
              showSearch
              placeholder="LĨNH VỰC"
              allowClear
            >
              {/* {listCareer.map((item: any) => {
                    return (
                      <Select.Option key={item.value} value={item.value}>
                        {item.label}
                      </Select.Option>
                    );
                  })} */}
            </Select>
          </FormItem>
          <FormItem className="w-1/6">
            <Input
              size="large"
              placeholder="SỐ ĐIỂM"
              className="rounded-[10px] bg-white w-full"
              allowClear
            />
          </FormItem>
          <FormItem className="w-1/6">
            <DatePicker
              placeholder="NGÀY TẠO"
              className="!w-full !h-[39px] rounded-[10px]"
              format="DD/MM/YYYY"
            />
          </FormItem>
          <button
            className="min-w-[150px] px-3 cursor-pointer rounded-[10px] bg-[#EB4C4C] flex items-center justify-center text-[var(--primary-color)] "
            onClick={handleResetForm}
          >
            <span className="text-sm text-white font-[600] tracking-[0.1px] leading-[21px] mr-1">
              Huỷ bỏ
            </span>
          </button>
          <button
            type="submit"
            className="min-w-[150px] px-3 cursor-pointer rounded-[10px] bg-[var(--primary-color)] flex items-center justify-center text-[var(--primary-color)] "
          >
            <span className="text-sm text-white font-[600] tracking-[0.1px] leading-[21px] mr-1">
              Tìm kiếm
            </span>
            <div className="relative h-4 w-4">
              <Image src={SrcIcons.searchIcon} layout="fill" />
            </div>
          </button>
        </Form>
        <div className="flex items-center justify-between mt-5 mb-3">
          <p className="text-[var(--primary-color)] font-bold text-xl mb-3">
            Danh sách CV
          </p>
        </div>
      </div>
      {/* <div className="counter pointer-events-none absolute z-10 bottom-[1rem] translate-x-[100px]">
            Tổng số CV: {totalCount}
          </div> */}
      <Table
        key={page}
        selectionMode="none"
        lang="vi"
        sticked={false}
        lined
        autoSave="true"
        suppressHydrationWarning
        aria-label="Danh sách bài test"
        aria-labelledby="Danh sách bài test"
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
          {(item) => (
            <Table.Row key={item.id_assessment_user} css={{ background: 'red' }}>
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
          rowsPerPage={10}
          initialPage={page}
          // total={Math.ceil(dataTable.length)}
          total={totalPages}
          onPageChange={(newPage) => setPage(newPage)}
        ></Table.Pagination>
      </Table>
    </>
  );
}

export default ListCVTestDashboard;
