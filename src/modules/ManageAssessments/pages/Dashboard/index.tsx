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
import { Button, Input, message, Popconfirm } from 'antd';
import Image from 'next/legacy/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { assessmentService } from '../../shared/api';

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
  { name: 'TÊN DANH MỤC', uid: 'name' },
  { name: 'ĐƯỜNG DẪN', uid: 'slug' },
  { name: 'THỜI GIAN', uid: 'time' },
  { name: 'LOẠI', uid: 'type' },
  { name: 'THAO TÁC', uid: 'actions' },
  { name: 'XUẤT BẢN', uid: 'published' },
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
      case 'name':
        return (
          <User
            squared
            src={item?.avatar ?? SrcImages.placeholder}
            size="xl"
            name={cellValue}
          ></User>
        );
      case 'slug':
        return (
          <Col>
            <Row>
              <span className="text-[14px]">{cellValue}</span>
            </Row>
          </Col>
        );
      case 'published':
        return (
          <Row css={{ marginLeft: 20 }}>
            <Checkbox
              defaultSelected={item.status === AssessmentStatusCode.ACTIVE}
              onChange={(value) => onSelect(Number(value), item.id)}
              aria-label="Checkbox"
              color="success"
            />
          </Row>
        );
      case 'time':
        return (
          <Col>
            <Row align="center">
              <span className="text-[14px]">{cellValue}</span>
            </Row>
          </Col>
        );
      case 'type':
        return (
          <Col>
            <Row align="center">
              <span className="text-[14px]">
                {item.sale_price > 0 ? 'Trả phí' : 'Miễn phí'}
              </span>
            </Row>
          </Col>
        );

      case 'actions':
        return (
          <Row align="flex-start">
            <Tooltip content="Sửa" css={{ marginRight: 20 }}>
              <IconButton
                onClick={() => {
                  router.push(
                    `/quan-ly-bai-test/bai-test/chinh-sua/?slug=${item.slug}`,
                    undefined,
                    {
                      shallow: true,
                    }
                  );
                }}
              >
                <Image src={SrcIcons.editActionIcon} height={24} width={24} />
              </IconButton>
            </Tooltip>

            <Popconfirm
              placement="leftTop"
              title={'Bạn có chắc chắn muốn xóa bài test này?'}
              onConfirm={() => {
                onDeleteAssessment(item?.id);
              }}
              okText="Xóa"
              cancelText="Hủy"
            >
              <Tooltip content="Xóa" color="error">
                <IconButton>
                  <Image src={SrcIcons.deleteActionIcon} height={24} width={24} />
                </IconButton>
              </Tooltip>
            </Popconfirm>
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
          <Link href="/quan-ly-bai-test/bai-test/them-moi" legacyBehavior>
            <Button
              size="large"
              className="rounded-[10px] bg-white flex items-center justify-center text-[var(--primary-color)] "
            >
              <div className="relative h-5 w-5">
                <Image src={SrcIcons.plusActionIcon} layout="fill" />
              </div>
              <span className="text-sm text-[#403ECC] font-[600] tracking-[0.1px] leading-[21px]">
                Thêm bài test
              </span>
            </Button>
          </Link>
        </div>
        <div className="counter pointer-events-none absolute z-10 bottom-[1rem] translate-x-[100px]">
          Tổng số bài test: {dataTable.length} bài
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
