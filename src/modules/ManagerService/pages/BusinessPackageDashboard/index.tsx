import SrcIcons from '@/assets/icons';
import SrcImages from '@/assets/images';
import { IconButton } from '@/components/IconButton';
import IAssessment from '@/interfaces/models/IAssessment';
import { assessmentService } from '@/modules/ManageAssessments/shared/api';
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
import { Button, DatePicker, Input, message, Popconfirm, Select } from 'antd';
import Image from 'next/legacy/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useState } from 'react';

export interface IProps {
  assessments: IAssessment[];
}

type AssessmentTable = {
  id: string | number;
  name?: string;
  descriptions?: string;
  slug: string;
  avatar?: string;
  sale_price: number;
  time?: string;
  assessmentType?: AssessmentTypeNumeric;
  status: AssessmentStatusCode;
};
const columns = [
  { name: 'MÃ GÓI', uid: 'id' },
  { name: 'TÊN GÓI', uid: 'name' },
  { name: 'LĨNH VỰC', uid: 'field' },
  { name: 'GIÁ (VND)', uid: 'price' },
  { name: 'NGÀY TẠO', uid: 'createdDate' },
  { name: 'NGÀY CẬP NHẬP', uid: 'modifiedDate' },
  { name: 'TRẠNG THÁI', uid: 'status' },
  { name: 'THAO TÁC', uid: 'action' },
];

const listFields = [
  { label: 'Sale & Marketing', value: 'Sale & Marketing' },
  { label: 'Công nghệ thông tin', value: 'Công nghệ thông tin' },
  { label: 'Tài chính - kế toán', value: 'Tài chính - kế toán' },
  { label: 'Vận hành', value: 'Vận hành' },
];

const listStatus = [
  { label: 'Hiển thị', value: '0' },
  { label: 'Ẩn', value: '1' },
  { label: 'Hết hàng', value: '2' },
];

const mapToTableData = (assessments: IAssessment[]) =>
  assessments &&
  assessments.map((item) => ({
    id: item.id,
    name: item.name,
    slug: item.slug,
    avatar: item.avatar,
    descriptions: item.description,
    sale_price: item.sale_price,
    assessmentType: AssessmentTypeToAssessmentTypeNumeric(item.assessment_type),
    status: item.status,
    time: new Date(item.updated_at).toLocaleString(),
  }));

export function BusinessPackageDashboard(props: IProps) {
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
  const handlePublise = async (value, assessment_id) => {
    console.log(value, assessment_id);

    try {
      appLibrary.showloading();
      const res = await assessmentService.updateNewAssessmentStatus(assessment_id, {
        status: value,
      });
      if (res.code === SV_RES_STATUS_CODE.success) {
        const newData = filtedData.map((item) => {
          if (item.id === assessment_id) {
            item.status = value;
          }
          return item;
        });
        // setFiltedData(newData);
        // console.log(newData);
        // setDataTable(newData);
        appLibrary.hideloading();
        return message.success('Cập nhật thành công!');
      }
    } catch (error) {
      appLibrary.hideloading();
      message.warning('Xuất bản thất bại!');
    }
  };
  const onSearch = (event) => {
    const { value } = event.target;
    handleSearch(value);
  };
  const onSelect = (value, assessment_id) => {
    handlePublise(value, assessment_id);
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

  const onDeleteAssessment = async (id) => {
    if (!id) return;
    try {
      appLibrary.showloading();
      const { code, payload } = await assessmentService.deleteAssessment(id);
      if (code === SV_RES_STATUS_CODE.success) {
        appLibrary.hideloading();
        message.success('Xóa bài test thành công');
        if (payload.id) {
          setDataTable((pre) => pre.filter((item) => item.id !== parseInt(payload.id)));
          setFiltedData((pre) => pre.filter((item) => item.id !== parseInt(payload.id)));
        }
      }
    } catch (error) {
      appLibrary.hideloading();
      console.log(error);
      message.error('Xóa bài test thất bại!');
    }
  };

  const filterOption = (input: string, option?: { label: string; value: string }) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  const list = useAsyncList({ load, sort });
  const renderCell = (item: AssessmentTable, columnKey: React.Key) => {
    const cellValue = item[columnKey];
    switch (columnKey) {
      case 'id':
        return (
          <Col>
            <Row>
              <span className="text-[14px]">SPM1</span>
            </Row>
          </Col>
        );
      case 'name':
        return (
          <Col>
            <Row align="center">
              <span className="text-[14px]">SALE & MARKETING</span>
            </Row>
          </Col>
        );
      case 'field':
        return (
          <Col>
            <Row align="center">
              <span className="text-[14px]">Sale & Marketing</span>
            </Row>
          </Col>
        );
      case 'price':
        return (
          <Col>
            <Row align="center">
              <div>
                <p className="text-[var(--primary-color)]">39.000.000</p>
                <p className="text-[#92929D]">42.000.000</p>
              </div>
            </Row>
          </Col>
        );
      case 'createdDate':
        return (
          <Col>
            <Row align="center">
              <span className="text-[14px]">1/1/2022</span>
            </Row>
          </Col>
        );
      case 'modifiedDate':
        return (
          <Col>
            <Row align="center">
              <span className="text-[14px]">30/1/2022</span>
            </Row>
          </Col>
        );
      case 'status':
        return (
          <Col>
            <Row align="center">
              <span className="text-[14px]">Hiển thị</span>
            </Row>
          </Col>
        );
      case 'action':
        return (
          <Row align="flex-start">
            <Tooltip content="Xem chi tiết" css={{ marginRight: 20 }}>
              <IconButton
                onClick={() => {
                  router.push(``, undefined, {
                    shallow: true,
                  });
                }}
              >
                <Image src={SrcIcons.editActionIcon} height={24} width={24} />
              </IconButton>
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
            placeholder="Mã gói"
            className="rounded-[10px] bg-white"
            allowClear
            onChange={onSearch}
          />
          <Input
            size="large"
            placeholder="Tên gói"
            className="rounded-[10px] bg-white"
            allowClear
            onChange={onSearch}
          />
          <Select
            size="large"
            className="!min-w-[250px]"
            showSearch
            placeholder="Lĩnh vực"
            optionFilterProp="children"
            filterOption={filterOption}
            options={listFields}
          />
          <DatePicker placeholder="Ngày tạo" className="!w-[1650px]" />
          <Select
            size="large"
            className="!min-w-[250px]"
            showSearch
            placeholder="Trạng thái"
            optionFilterProp="children"
            filterOption={filterOption}
            options={listStatus}
          />
          <div className="min-w-[150px] px-3 cursor-pointer rounded-[10px] bg-[var(--primary-color)] flex items-center justify-center text-[var(--primary-color)] ">
            <span className="text-sm text-white font-[600] tracking-[0.1px] leading-[21px] mr-1">
              Tìm kiếm
            </span>
            <div className="relative h-4 w-4">
              <Image src={SrcIcons.searchIcon} layout="fill" />
            </div>
          </div>
        </div>
        <div className="counter pointer-events-none absolute z-10 bottom-[1rem] translate-x-[100px]">
          Tổng số gói: {dataTable.length} gói
        </div>
        <div className="flex items-center justify-between mt-5 mb-3">
          <p className="text-[var(--primary-color)] font-bold text-xl mb-3">
            Danh sách gói doanh nghiệp
          </p>
          <Link href={'/quan-ly-viec-lam/goi-doanh-nghiep/them-moi'}>
            <div className="w-fit cursor-pointer rounded-[10px] bg-[var(--primary-color)] text-white py-3 px-4">
              Thêm mới
            </div>
          </Link>
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
      </div>
    </>
  );
}
