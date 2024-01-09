import SrcIcons from '@/assets/icons';
import { IconButton } from '@/components/IconButton';
import ResumeDetail from '@/modules/ManageJobs/components/ResumeDetail';
import { Row, Table, Tooltip, User } from '@nextui-org/react';
import { Button } from 'antd';
import moment from 'moment';
import Image from 'next/legacy/image';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';

export interface IProps {
  news: TCV;
}

const columns = [
  { name: 'ỨNG VIÊN', uid: 'name', width: '45%' },
  { name: 'THỜI GIAN', uid: 'created_at', width: '35%' },
  { name: 'THAO TÁC', uid: 'actions', width: '20%' },
];

type TCV = {
  id: string | number;
  name: string;
  avatar: string;
  created_at: string;
};

const sample = [
  {
    id: 0,
    name: 'Doanh nghiep 1',
    avatar: 'http://cisif.do/ibi',
    created_at: moment('2022-10-11 12:00:00').format('YYYY-MM-DD hh:mm:ss'),
  },
  {
    id: 1,
    name: 'Doanh nghiep 1',
    avatar: 'http://cisif.do/ibi',
    created_at: moment('2022-10-11 12:00:00').format('YYYY-MM-DD hh:mm:ss'),
  },
  {
    id: 2,
    name: 'Doanh nghiep 1',
    avatar: 'http://cisif.do/ibi',
    created_at: moment('2022-10-11 12:00:00').format('YYYY-MM-DD hh:mm:ss'),
  },
  {
    id: 3,
    name: 'Doanh nghiep 1',
    avatar: 'http://cisif.do/ibi',
    created_at: moment('2022-10-11 12:00:00').format('YYYY-MM-DD hh:mm:ss'),
  },
  {
    id: 4,
    name: 'Doanh nghiep 1',
    avatar: 'http://cisif.do/ibi',
    created_at: moment('2022-10-11 12:00:00').format('YYYY-MM-DD hh:mm:ss'),
  },
  {
    id: 5,
    name: 'Doanh nghiep 1',
    avatar: 'http://cisif.do/ibi',
    created_at: moment('2022-10-11 12:00:00').format('YYYY-MM-DD hh:mm:ss'),
  },
  {
    id: 6,
    name: 'Doanh nghiep 1',
    avatar: 'http://cisif.do/ibi',
    created_at: moment('2022-10-11 12:00:00').format('YYYY-MM-DD hh:mm:ss'),
  },
  {
    id: 7,
    name: 'Doanh nghiep 1',
    avatar: 'http://cisif.do/ibi',
    created_at: moment('2022-10-11 12:00:00').format('YYYY-MM-DD hh:mm:ss'),
  },
  {
    id: 8,
    name: 'Doanh nghiep 1',
    avatar: 'http://cisif.do/ibi',
    created_at: moment('2022-10-11 12:00:00').format('YYYY-MM-DD hh:mm:ss'),
  },
  {
    id: 9,
    name: 'Doanh nghiep 1',
    avatar: 'http://cisif.do/ibi',
    created_at: moment('2022-10-11 12:00:00').format('YYYY-MM-DD hh:mm:ss'),
  },
  {
    id: 10,
    name: 'Doanh nghiep 1',
    avatar: 'http://cisif.do/ibi',
    created_at: moment('2022-10-11 12:00:00').format('YYYY-MM-DD hh:mm:ss'),
  },
  {
    id: 11,
    name: 'Doanh nghiep 1',
    avatar: 'http://cisif.do/ibi',
    created_at: moment('2022-10-11 12:00:00').format('YYYY-MM-DD hh:mm:ss'),
  },
  {
    id: 12,
    name: 'Doanh nghiep 1',
    avatar: 'http://cisif.do/ibi',
    created_at: moment('2022-10-11 12:00:00').format('YYYY-MM-DD hh:mm:ss'),
  },
  {
    id: 13,
    name: 'Doanh nghiep 1',
    avatar: 'http://cisif.do/ibi',
    created_at: moment('2022-10-11 12:00:00').format('YYYY-MM-DD hh:mm:ss'),
  },
  {
    id: 14,
    name: 'Doanh nghiep 1',
    avatar: 'http://cisif.do/ibi',
    created_at: moment('2022-10-11 12:00:00').format('YYYY-MM-DD hh:mm:ss'),
  },
];

export function Resume(props) {
  const router = useRouter();
  const [openDetail, setOpenDetail] = useState(false);
  const toggle = () => setOpenDetail((active) => !active);
  const {
    query: { id },
  } = router;
  const [dataTable, setDataTable] = useState(sample);
  const renderCell = useMemo(
    // eslint-disable-next-line react/display-name
    () => (item: any, columnKey: React.Key) => {
      const cellValue = item[columnKey];
      switch (columnKey) {
        case 'name':
          return (
            <div className="flex">
              <User
                squared
                src={item?.avatar ?? SrcIcons.iconYouth}
                size="xl"
                name={item.name}
              ></User>
              <IconButton>
                <Image src={SrcIcons.ic_link} width={24} height={24} />
              </IconButton>
            </div>
          );

        case 'created_at':
          return moment(item.created_at).format('YYYY-MM-DD hh:mm:ss');

        case 'actions':
          return (
            <Row className="gap-2">
              <Tooltip content="Xem chi tiết">
                <Button
                  className="px-4 py-1 bg-[#F1F1F5] rounded-[10px] text-[#696974] hover:text-[#696974] border-0"
                  onClick={() => {
                    setOpenDetail(true);
                  }}
                >
                  View CV
                </Button>
              </Tooltip>
            </Row>
          );
        default:
          return cellValue;
      }
    },
    []
  );

  if (openDetail) {
    return <ResumeDetail onToggle={toggle} />;
  }
  return (
    <>
      <Table
        selectionMode="none"
        lang="vi"
        sticked={false}
        lined
        css={{ background: 'white', height: 'auto', minWidth: '100%' }}
        striped
        color="secondary"
      >
        <Table.Header columns={columns}>
          {(column) => (
            <Table.Column key={column.uid} align={'start'} width={column.width}>
              {column.name}
            </Table.Column>
          )}
        </Table.Header>
        <Table.Body items={dataTable}>
          {(item) => (
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
