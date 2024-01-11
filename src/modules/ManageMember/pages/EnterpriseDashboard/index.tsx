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
import { Button, DatePicker, Input, message, Popconfirm } from 'antd';
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
  { name: 'DOANH NGHIỆP', uid: 'enterprise' },
  { name: 'ĐẠI DIỆN', uid: 'represent' },
  { name: 'EMAIL', uid: 'email' },
  { name: 'GÓI', uid: 'package' },
  { name: 'NGÀY TẠO', uid: 'createdDate' },
  { name: 'THAO TÁC', uid: 'action' },
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

export function EnterpriseDashboard(props: IProps) {
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

  const list = useAsyncList({ load, sort });
  const renderCell = (item: AssessmentTable, columnKey: React.Key) => {
    const cellValue = item[columnKey];
    switch (columnKey) {
      case 'enterprise':
        return (
          <Col>
            <Row>
              <span className="text-[14px]">YOUTH+</span>
            </Row>
          </Col>
        );
      case 'represent':
        return (
          <User
            squared
            src="https://storage.googleapis.com/youth-media/assessments/avatars/HqMuEvmGjBhHjkpPexggNKRLSVHcOhXa48Fc3jzo.png"
            size="xl"
            name="Nguyễn Văn A"
          ></User>
        );
      case 'email':
        return (
          <Col>
            <Row align="center">
              <span className="text-[14px]">tung@gmail.com</span>
            </Row>
          </Col>
        );
      case 'package':
        return (
          <Col>
            <Row align="center">
              <span className="text-[14px]">FREE</span>
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
                <Image src={SrcIcons.seeDetail} height={24} width={24} />
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
            placeholder="Doanh nghiệp"
            className="rounded-[10px] bg-white"
            allowClear
            onChange={onSearch}
          />
          <Input
            size="large"
            placeholder="Đại diện"
            className="rounded-[10px] bg-white"
            allowClear
            onChange={onSearch}
          />
          <Input
            size="large"
            placeholder="Email"
            className="rounded-[10px] bg-white"
            allowClear
            onChange={onSearch}
          />
          <DatePicker placeholder="Ngày tạo" className="!w-[1650px]" />
          <Input
            size="large"
            placeholder="Gói"
            className="rounded-[10px] bg-white"
            allowClear
            onChange={onSearch}
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
          Tổng số doanh nghiệp: {dataTable.length} doanh nghiệp
        </div>
        <p className="text-[var(--primary-color)] font-bold text-xl mb-3">
          Danh sách doanh nghiệp
        </p>
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
