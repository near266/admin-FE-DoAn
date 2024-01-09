import SrcIcons from '@/assets/icons';
import { IconButton } from '@/components/IconButton';
import ICareer from '@/interfaces/models/ICareer';
import { IField } from '@/interfaces/models/IField';
import { Common } from '@/shared/utils';
import { debounce } from '@mui/material';
import {
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
import { ChangeEventHandler, useCallback, useMemo, useState } from 'react';
import { fieldService } from '../../shared/api';

interface IProps {
  fields: IField[];
  pagination: {
    current_page: number;
    total_field: number;
    links?: any[];
  };
}

const columns = [
  { name: 'TÊN', uid: 'name' },
  { name: 'THAO TÁC', uid: 'actions' },
];

export function FieldDashboard(props: IProps) {
  const {
    fields: rootData,
    pagination: { current_page, links, total_field },
  } = props;
  // this data is ref by search, delete
  const [filtedData, setFiltedData] = useState<IField[]>(rootData);
  const [dataTable, setDataTable] = useState<IField[]>(rootData);
  const [perPage, setPerPage] = useState(7);
  const collator = useCollator({ numeric: true });
  const router = useRouter();
  async function load(params) {
    return {
      items: dataTable,
    };
  }
  const loadMore = async (params) => {
    try {
      console.log('loadMore', params);
    } catch (error) {
      console.log(error);
    }
  };
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
  const handleDelete = async (id: number) => {
    try {
      const res = await fieldService.deleteField(id);
      if (res) {
        setFiltedData((pre) => pre.filter((item) => item.id !== id));
        setDataTable((pre) => pre.filter((item) => item.id !== id));
        message.success('Xóa thành công');
      }
    } catch (error) {
      console.log(error);
      message.error('Bạn không thể xóa!');
    }
  };
  const onDeleteField = (id: number) => {
    console.log('onDeleteField', id);
    handleDelete(id);
  };
  const tableControl = useAsyncList({ load, sort });
  const renderCell = useMemo(
    // eslint-disable-next-line react/display-name
    () => (item: IField, columnKey: React.Key) => {
      const cellValue = item[columnKey];
      switch (columnKey) {
        case 'name':
          return (
            <User
              squared
              src={item?.avatar ?? SrcIcons.iconYouth}
              size="xl"
              name={''}
              autoCapitalize="none"
              className="!normal-case"
            >
              <span className="normal-case text-[0.875rem] text-[#11181C] font-[500]">
                {item?.name}
              </span>
            </User>
          );
        case 'actions':
          return (
            <Row align="flex-start">
              <Tooltip content="Sửa" css={{ marginRight: 20 }}>
                <Link href={`quan-ly-linh-vuc/chinh-sua/?id=${item.id}`} legacyBehavior>
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
  const handlePageChange = (page: number) => {};
  const handleSearch = useCallback(
    debounce((value: string) => {
      if (value === '') {
        setPerPage(7);
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
    setPerPage(100);
    handleSearch(value);
  };
  return (
    <>
      <div className="flex mb-[1rem] gap-3">
        <Input
          size="large"
          placeholder="Nhập tên lĩnh vực"
          className="rounded-[10px] bg-white"
          allowClear
          onChange={onSearch}
          prefix={<Image src={SrcIcons.searchIcon} width={18} height={18} />}
        />
        <Link href="/quan-ly-linh-vuc/them-moi" legacyBehavior>
          <Button
            size="large"
            className="rounded-[10px] bg-white flex items-center justify-center text-[var(--primary-color)] "
          >
            <div className="relative h-5 w-5">
              <Image src={SrcIcons.plusActionIcon} layout="fill" />
            </div>
            <span className="text-sm text-[#403ECC] font-[600] tracking-[0.1px] leading-[21px]">
              Thêm lĩnh vực
            </span>
          </Button>
        </Link>
      </div>
      <Table
        selectionMode="none"
        lang="vi"
        sticked={false}
        lined
        aria-label="Danh sách lĩnh vực"
        aria-labelledby="Danh sách lĩnh vực"
        css={{ background: 'white', height: 'auto', minWidth: '100%' }}
        striped
        color="secondary"
        sortDescriptor={tableControl.sortDescriptor}
        onSortChange={tableControl.sort}
      >
        <Table.Header columns={columns}>
          {(column) => (
            <Table.Column
              key={column.uid}
              align={'start'}
              allowsSorting={column.uid !== 'actions'}
            >
              {column.name}
            </Table.Column>
          )}
        </Table.Header>
        <Table.Body items={dataTable} loadingState={tableControl.loadingState}>
          {(item: IField) => (
            <Table.Row>
              {(columnKey) => <Table.Cell>{renderCell(item, columnKey)}</Table.Cell>}
            </Table.Row>
          )}
        </Table.Body>
        <Table.Pagination
          noMargin
          align="center"
          initialPage={1}
          rowsPerPage={perPage}
          onPageChange={handlePageChange}
        />
      </Table>
    </>
  );
}
