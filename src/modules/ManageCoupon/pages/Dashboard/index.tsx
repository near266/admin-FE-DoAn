import SrcIcons from '@/assets/icons';
import { IconButton } from '@/components/IconButton';
import ICareer from '@/interfaces/models/ICareer';
import { ICoupon } from '@/interfaces/models/ICoupon';
import { SV_RES_STATUS_CODE } from '@/shared/enums/enums';
import { formatServerDateToDurationString } from '@/shared/helpers';
import { Common } from '@/shared/utils';
import { appLibrary } from '@/shared/utils/loading';
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
import { Button, Input, message, Popconfirm } from 'antd';
import Image from 'next/legacy/image';
import Link from 'next/link';
import { useCallback, useMemo, useState } from 'react';
import { counponServices as couponServices } from '../../shared/api';
import CouponCreator from '../components/CouponC_U';

interface IProps {
  coupon: ICoupon[];
  total?: string;
  links?: string[];
  current_page?: number;
}
/*   id: string;
  code: string;
  discount: number;
  limit: number;
  used: number;
  start_time: string;
  end_time: string;
  created_at: string;
  updated_at: string; */
const columns = [
  { name: 'MÃ', uid: 'code' },
  // { name: 'TÊN CHIẾN DỊCH', uid: 'campaign' },
  // { name: 'TÌNH TRẠNG', uid: 'status' },
  { name: 'NGÀY TẠO', uid: 'start_time' },
  { name: 'NGÀY HẾT HẠN', uid: 'end_time' },
  { name: 'NGÀY DÙNG', uid: 'used_date' },
  // { name: 'LOẠI', uid: 'type' },
  { name: 'THAO TÁC', uid: 'actions' },
];

export function CouponDashBoard(props: IProps) {
  const { coupon, total, links, current_page } = props;
  const [dataTable, setDataTable] = useState<ICoupon[]>(coupon);
  const [filtedData, setFiltedData] = useState<ICoupon[]>(coupon);
  const [edittingCoupon, setEdittingCoupon] = useState<ICoupon>(null);
  const [openModal, setOpenModal] = useState(false);
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

  const handleDelete = async (id: string) => {
    try {
      appLibrary.showloading();
      const { code } = await couponServices.deleteCouponById(id);
      if (code === SV_RES_STATUS_CODE.success) {
        setDataTable((pre) => pre.filter((item) => item.id !== id));
        setFiltedData((pre) => pre.filter((item) => item.id !== id));
        message.success('Xóa thành công');
      }
      appLibrary.hideloading();
    } catch (error) {
      appLibrary.hideloading();
      message.error('Đã có lỗi xảy ra!');
    }
  };
  const onDeleteField = (id: string) => {
    handleDelete(id);
  };
  const renderCell = useMemo(
    // eslint-disable-next-line react/display-name
    () => (item: any, columnKey: React.Key) => {
      const cellValue = item[columnKey];
      switch (columnKey) {
        case 'campaign':
          return (
            <Col>
              <Row>
                <span className="text-[14px]">{item.field}</span>
              </Row>
            </Col>
          );
        case 'start_time':
          return (
            <Col>
              <Row>
                <span className="text-[14px]">
                  {formatServerDateToDurationString(item.start_time)}
                </span>
              </Row>
            </Col>
          );
        case 'end_time':
          return (
            <Col>
              <Row>
                <span className="text-[14px]">
                  {formatServerDateToDurationString(item.end_time)}
                </span>
              </Row>
            </Col>
          );
        case 'status':
          return (
            <Row css={{ marginLeft: 20 }}>
              <span className="text-[14px]">{item.status}</span>
            </Row>
          );

        case 'actions':
          return (
            <Row align="flex-start">
              <Tooltip content="Sửa" css={{ marginRight: 20 }}>
                <IconButton
                  onClick={() => {
                    setEdittingCoupon(item);
                    setOpenModal(true);
                  }}
                >
                  <Image src={SrcIcons.editActionIcon} height={24} width={24} />
                </IconButton>
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
          Common.removeVietnameseTones(item.code)
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
  const handleDataCallback = useCallback((data: ICoupon) => {
    setFiltedData((pre) => [...pre, data]);
    setDataTable((pre) => [...pre, data]);
  }, []);
  return (
    <>
      <div className="flex mb-[1rem] gap-3">
        <Input
          size="large"
          placeholder="Tìm kiếm thông tin"
          className="rounded-[10px] bg-white"
          allowClear
          onChange={onSearch}
          prefix={<Image src={SrcIcons.searchIcon} width={18} height={18} />}
        />
        <Button
          size="large"
          className="rounded-[10px] bg-white flex items-center justify-center text-[var(--primary-color)] "
          onClick={() => setOpenModal((pre) => !pre)}
        >
          <div className="relative h-5 w-5">
            <Image src={SrcIcons.plusActionIcon} layout="fill" />
          </div>
          <span className="text-sm text-[#403ECC] font-[600] tracking-[0.1px] leading-[21px]">
            Tạo COUPON
          </span>
        </Button>
      </div>

      <CouponCreator
        data={edittingCoupon}
        open={openModal}
        update={handleDataCallback}
        onChange={(openState) => {
          setOpenModal(openState);
        }}
      />

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
          {(item: ICoupon) => (
            <Table.Row>
              {(columnKey) => <Table.Cell>{renderCell(item, columnKey)}</Table.Cell>}
            </Table.Row>
          )}
        </Table.Body>
        <Table.Pagination
          noMargin
          align="center"
          rowsPerPage={15}
          onPageChange={(page) => console.log({ page })}
        />
      </Table>
    </>
  );
}
