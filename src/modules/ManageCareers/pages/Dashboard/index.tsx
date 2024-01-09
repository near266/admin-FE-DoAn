import SrcIcons from '@/assets/icons';
import { IconButton } from '@/components/IconButton';
import ICareer from '@/interfaces/models/ICareer';
import { Common } from '@/shared/utils';
import { debounce } from '@mui/material';
import {
  Checkbox,
  Col,
  Row,
  Table,
  Tooltip,
  useAsyncList,
  useCollator,
  User,
} from '@nextui-org/react';
import { Button, Input, message, Popconfirm } from 'antd';
import Image from 'next/legacy/image';
import Link from 'next/link';
import { useCallback, useMemo, useState } from 'react';
import { careerService } from '../../shared/api';

export interface IProps {
  careers: ICareer[];
}

const columns = [
  { name: 'TÊN', uid: 'name' },
  { name: 'LĨNH VỰC', uid: 'field' },
  { name: 'TÌNH TRẠNG', uid: 'status' },
  { name: 'THAO TÁC', uid: 'actions' },
];

export function CareerDashboard(props: IProps) {
  const { careers } = props;
  const [dataTable, setDataTable] = useState<ICareer[]>(careers);
  const [filtedData, setFiltedData] = useState<ICareer[]>(careers);
  const collator = useCollator({ numeric: true });

  async function load({ signal }) {
    return {
      items: dataTable,
    };
  }
  async function sort({ items, sortDescriptor }) {
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
  }
  const list = useAsyncList({ load, sort });
  const handleDelete = async (id: number) => {
    try {
      const res = await careerService.deleteCareer(id);
      if (res) {
        setDataTable((pre) => pre.filter((item) => item.id !== id));
        setFiltedData((pre) => pre.filter((item) => item.id !== id));
        message.success('Xóa thành công');
      }
    } catch (error) {
      console.log(error);
      // message.error('Đã có lỗi xảy ra!');
      message.error('Bạn không thể xóa!');
    }
  };
  const onDeleteField = (id: number) => {
    console.log('onDeleteField', id);
    handleDelete(id);
  };
  const renderCell = useMemo(
    // eslint-disable-next-line react/display-name
    () => (item: any, columnKey: React.Key) => {
      const cellValue = item[columnKey];
      switch (columnKey) {
        case 'name':
          return (
            <User
              squared
              src={item?.avatar ?? SrcIcons.iconYouth}
              size="xl"
              name={cellValue}
            >
              {item?.name}
            </User>
          );
        case 'field':
          return (
            <Col>
              <Row>
                <span className="text-[14px]">{item.field}</span>
              </Row>
            </Col>
          );
        case 'status':
          return (
            <Row css={{ marginLeft: 20 }}>
              <Checkbox
                defaultValue={item.status}
                aria-label="Checkbox"
                color="success"
              />
            </Row>
          );
        case 'actions':
          return (
            <Row align="flex-start">
              <Tooltip content="Sửa" css={{ marginRight: 20 }}>
                <Link href={`/quan-ly-nghe/chinh-sua/?id=${item.id}`} legacyBehavior>
                  <IconButton>
                    <Image src={SrcIcons.editActionIcon} height={24} width={24} />
                  </IconButton>
                </Link>
              </Tooltip>

              <Popconfirm
                placement="leftTop"
                title={'Bạn có chắc chắn muốn xóa lĩnh vực này?'}
                onConfirm={() => {
                  onDeleteField(item?.id);
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
    },
    [dataTable]
  );
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
  return (
    <>
      <div className="flex mb-[1rem] gap-3">
        <Input
          size="large"
          placeholder="Tìm kiếm nghề "
          className="rounded-[10px] bg-white"
          allowClear
          onChange={onSearch}
          prefix={<Image src={SrcIcons.searchIcon} width={18} height={18} />}
        />
        <Link href="/quan-ly-nghe/them-moi" legacyBehavior>
          <Button
            size="large"
            className="rounded-[10px] bg-white flex items-center justify-center text-[var(--primary-color)] "
          >
            <div className="relative h-5 w-5">
              <Image src={SrcIcons.plusActionIcon} layout="fill" />
            </div>
            <span className="text-sm text-[#403ECC] font-[600] tracking-[0.1px] leading-[21px]">
              Thêm nghề
            </span>
          </Button>
        </Link>
      </div>
      <Table
        selectionMode="none"
        lang="vi"
        sticked={false}
        lined
        aria-label="Danh sách bài test"
        aria-labelledby="Danh sách bài test"
        css={{ background: 'white', height: 'auto', minWidth: '100%' }}
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
          {(item: ICareer) => (
            <Table.Row>
              {(columnKey) => <Table.Cell>{renderCell(item, columnKey)}</Table.Cell>}
            </Table.Row>
          )}
        </Table.Body>
        <Table.Pagination
          noMargin
          align="center"
          rowsPerPage={7}
          onPageChange={(page) => console.log({ page })}
        />
      </Table>
    </>
  );
}
