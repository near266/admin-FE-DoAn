import SrcIcons from '@/assets/icons';
import SrcImages from '@/assets/images';
import { IconButton } from '@/components/IconButton';
import IAssessment from '@/interfaces/models/IAssessment';
import {
  AssessmentStatusCode,
  AssessmentTypeNumeric,
  AssessmentTypeToAssessmentTypeNumeric,
  SV_RES_STATUS_CODE,
} from '@/shared/enums/enums';
import { Common } from '@/shared/utils';
import { appLibrary } from '@/shared/utils/loading';
import { debounce } from '@mui/material';
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
    { name: 'TÊN BÀI TEST', uid: 'nameTest' },
    { name: 'LĨNH VỰC', uid: 'field' },
    { name: 'SỐ ĐIỂM', uid: 'point' },
    { name: 'NGÀY TẠO', uid: 'createdDate' },
    { name: 'XEM CV', uid: 'viewCV' },
    { name: 'TẢI CV', uid: 'downCV' },
];

const mapToTableData = (license: IGetListLicenseRes[]) =>
  license &&
  license.map((item) => ({
    fullName: item.name,
    nameTest: item.nameTest,
    field: item.field,
    points: item.points,
    createdDate: item.createdDate,
}));

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
      case 'nameTest':
        return (
          <Col>
            <Row align="center">
              <span className="text-[14px]">{item.nameTest}</span>
            </Row>
          </Col>
        );
      case 'field':
        return (
          <Col>
            <Row align="center">
              <span className="text-[14px]">
                {item.field}
              </span>
            </Row>
          </Col>
        );
      case 'point':
        return (
          <Col>
            <Row align="center">
                <span className="text-[14px]">{item.points}</span>
            </Row>
          </Col>
        );
      case 'createdDate':
        return (
          <Col>
            <Row align="center">
              <span className="text-[14px]">{item.createdDate}</span>
            </Row>
          </Col>
        );
      case 'action':
        return (
          <Link legacyBehavior href={`/quan-ly-viec-lam/goi-doanh-nghiep/chinh-sua`}>
            <Row align="flex-start">
              <Tooltip content="Xem chi tiết" css={{ marginRight: 20 }}>
                <IconButton>
                  <Image src={SrcIcons.editActionIcon} height={24} width={24} />
                </IconButton>
              </Tooltip>
            </Row>
          </Link>
        );
      default:
        return cellValue;
    }
  };

export function ListCVTestDashboard(props: IProps) {
    const { license } = props;
    const [form] = Form.useForm();
    const rootData = useMemo(() => mapToTableData(license), [license]);
    const [dataTable, setDataTable] = useState<IGetListLicenseRes[]>(rootData);
    const collator = useCollator({ numeric: true });

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
        // appLibrary.showloading();
        try {
          const params = {
            account_id: "c4ca4238a0b923820dcc509a6f75849b", 
            page: 1, 
            pageSize: 10 
          }
          const response = await assessmentService.getListCV(params);
          console.log(response.data)
          // if (response.data && response.data.length > 0) {
          //   setDataTable(response.data);
          // }    
          appLibrary.hideloading();
        } catch (error) {
          console.error('Error fetching data:', error);
          appLibrary.hideloading();
        }
      };
      fetchData();
    }, []);

    return (
        <>
            <div className="relative">
              <Form
                form={form}
                // onFinish={handleFormSubmit}
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
                  <DatePicker placeholder="NGÀY TẠO" className="!w-full !h-[39px] rounded-[10px]" format="DD/MM/YYYY"/>
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
            <Table
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
                  {(item: IGetListLicenseRes) => (
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
                  // total={Math.ceil(dataTable.length / 7)}
                  onPageChange={(page) => console.log({ page })}
                ></Table.Pagination>
            </Table>
      </>
    )
}

export default ListCVTestDashboard;
