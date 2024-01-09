import SrcIcons from '@/assets/icons';
import SrcImages from '@/assets/images';
import { IconButton } from '@/components/IconButton';
import { mapToUserAssessment } from '@/pages/quan-ly-bai-test/nguoi-lam-bai-test';
import { AssessmentTypeNumeric } from '@/shared/enums/enums';
import { Common } from '@/shared/utils';
import { appLibrary } from '@/shared/utils/loading';
import { isNonEmptyArray } from '@apollo/client/utilities';
import { debounce } from '@mui/material';
import {
  Col,
  Row,
  Table,
  Tooltip,
  useAsyncList,
  useCollator,
  User,
} from '@nextui-org/react';
import { Input, message } from 'antd';
import Image from 'next/legacy/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { assessmentService } from '../../shared/api';
import { ROW_PERPAGE } from '../../shared/constance';

interface IProps {
  userAssessment: AssessmentTable[];
  total?: number;
  links?: string[];
  current_page?: number;
}

export type AssessmentTable = {
  id: string | number;
  name: string;
  userId: string;
  avatar: string;
  time: string;
  email: string;
  phone_number: string;
  status: string;
  slug: string;
  suggestion: string;
};
const columns = [
  { name: 'TÊN', uid: 'name' },
  { name: 'TÊN BÀI TEST', uid: 'test_name' },
  { name: 'EMAIL', uid: 'email' },
  { name: 'THỜI GIAN', uid: 'time' },
  { name: 'SĐT', uid: 'phone_number' },
  { name: 'TRẠNG THÁI', uid: 'status' },
  { name: 'ĐỀ XUẤT', uid: 'suggestion' },
  { name: 'THAO TÁC', uid: 'actions' },
];

export function UserAssessmentDashboard(props: IProps) {
  const { userAssessment, total, links, current_page } = props;
  const router = useRouter();
  const [filtedData, setFiltedData] = useState<AssessmentTable[]>(userAssessment);
  const [dataTable, setDataTable] = useState<AssessmentTable[]>(userAssessment);
  const [currentTotal, setCurrentTotal] = useState<number>(total);
  const collator = useCollator({ numeric: true });
  useEffect(() => {
    const { type } = router.query;
    const typeNumber = Number(type);
    if (
      typeNumber === AssessmentTypeNumeric.YOUR_SELF ||
      typeNumber === AssessmentTypeNumeric.CAREER ||
      typeNumber === AssessmentTypeNumeric.COMPETENCY
    ) {
      (async () => {
        try {
          appLibrary.showloading();
          const { data, total: newTotal } = await assessmentService.getSummitedAssessment(
            typeNumber
          );

          if (data) {
            setCurrentTotal(newTotal);
            const newData = mapToUserAssessment(data);
            updateDataTable(newData);
            appLibrary.hideloading();

            return data;
          }
        } catch (error) {
          appLibrary.hideloading();
        }
      })();
    }
  }, [router]);
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
  const updateDataTable = async (newData: AssessmentTable[], both?: boolean) => {
    if (!isNonEmptyArray(newData)) return;
    setFiltedData(newData);
    setDataTable(newData);
  };
  const getPagyData = async (assessmentType: AssessmentTypeNumeric, page: number) => {
    try {
      appLibrary.showloading();
      setFiltedData([]);
      setDataTable([]);
      const { data } = await assessmentService.getSummitedAssessment(
        Number(assessmentType),
        page
      );
      if (data) {
        const newData = mapToUserAssessment(data);
        // TODO: shity code
        const fakeItem = Array(7 * (page - 1)).fill({ id: 0 });
        const currentDataTable = [...fakeItem, ...newData];
        setFiltedData(currentDataTable);
        setDataTable(currentDataTable);
        appLibrary.hideloading();

        return data;
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handlePagyChange = useCallback(async (page: number) => {
    // next router not working for some reason!!!
    const params = new URL(document.location.toString()).searchParams;
    const assessmentType = Number(params.get('type') ?? AssessmentTypeNumeric.YOUR_SELF);
    getPagyData(assessmentType, page);
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
  const list = useAsyncList({ load, sort });
  const renderCell = (item: AssessmentTable, columnKey: React.Key) => {
    const cellValue = item[columnKey];

    switch (columnKey) {
      case 'name':
        return (
          <User
            squared
            src={item?.avatar === '' ? SrcImages.defaultAvatar : item.avatar}
            size="xl"
            name={cellValue}
          ></User>
        );
      case 'test_name':
        return (
          <Col>
            <Row>
              <span className="text-[14px]">{cellValue}</span>
            </Row>
          </Col>
        );
      case 'email':
        return (
          <Col>
            <Row>
              <span className="text-[14px]">{cellValue}</span>
            </Row>
          </Col>
        );

      case 'time':
        return (
          <Col>
            <Row align="center">
              <span className="text-[14px]">{cellValue}</span>
            </Row>
          </Col>
        );

      case 'phone_number':
        return (
          <Col>
            <Row align="center">
              <span className="text-[14px]">{cellValue}</span>
            </Row>
          </Col>
        );
      case 'status':
        return (
          <Col>
            <Row>
              <span className="text-[14px]">{cellValue}</span>
            </Row>
          </Col>
        );
      case 'suggestion':
        return (
          <Col>
            <Row>
              <span className="text-[14px]">{cellValue}</span>
            </Row>
          </Col>
        );
      case 'actions':
        return (
          <Row align="flex-start">
            <Tooltip
              content="Xem chi tiết"
              color="error"
              onClick={() => console.log('Xem chi tiết', item?.id)}
              css={{ marginRight: 20 }}
            >
              <Link
                href={`/quan-ly-bai-test/nguoi-lam-bai-test/chi-tiet?id=${item.userId}&slug=${item.slug}`}
                legacyBehavior
              >
                <IconButton>
                  <Image src={SrcIcons.seeDetail} height={24} width={24} />
                </IconButton>
              </Link>
            </Tooltip>
            <Tooltip content="Sửa">
              <Link
                href={`/quan-ly-bai-test/nguoi-lam-bai-test/goi-y?id=${item.userId}&slug=${item.slug}&test_result_id=${item.id}`}
                legacyBehavior
              >
                <IconButton>
                  <Image src={SrcIcons.editActionIcon} height={24} width={24} />
                </IconButton>
              </Link>
            </Tooltip>
          </Row>
        );
      default:
        return cellValue;
    }
  };
  if (typeof window === 'undefined') return <></>;
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
        <div className="counter pointer-events-none absolute z-10 bottom-[1.4rem] translate-x-[100px]">
          Số người làm đã làm: {currentTotal} người
        </div>
        <Table
          selectionMode="none"
          lang="vi"
          sticked={false}
          lined
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
            rowsPerPage={ROW_PERPAGE}
            initialPage={1}
            page={current_page}
            total={Math.ceil(currentTotal / ROW_PERPAGE)}
            onPageChange={handlePagyChange}
          />
        </Table>
      </div>
    </>
  );
}
