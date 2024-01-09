import SrcIcons from '@/assets/icons';
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
import { Button, Input } from 'antd';
import Image from 'next/legacy/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

type columnsType = { name: string; uid: string };
export interface IProps {
  columns: columnsType[];
  data: [];
}

export const IconButton = styled('button', {
  dflex: 'center',
  border: 'none',
  outline: 'none',
  cursor: 'pointer',
  padding: '0',
  margin: '0',
  bg: 'transparent',
  transition: '$default',
  '&:hover': {
    opacity: '0.8',
  },
  '&:active': {
    opacity: '0.6',
  },
});

export function ManageAssessment(props: IProps) {
  const { columns, data } = props;
  const [dataTable, setDataTable] = useState();
  const collator = useCollator({ numeric: true });
  const router = useRouter();
  async function onLoad({ signal }) {
    // can call api here
    return {
      items: dataTable,
    };
  }
  const onSort = async ({ items, sortDescriptor }) => {
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
  };
  const list = useAsyncList({ load: onLoad, sort: onSort });
  const renderCell = (user, columnKey: React.Key) => {
    const cellValue = user[columnKey];
    switch (columnKey) {
      case 'name':
        return (
          <User squared src={user?.avatar} size="xl" name={cellValue}>
            {user?.descriptions}
          </User>
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
            <Checkbox defaultSelected color="success" />
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

      case 'actions':
        return (
          <Row align="flex-start">
            <Tooltip content="Sửa" css={{ marginRight: 20 }}>
              <IconButton
                onClick={() => {
                  router.push(
                    `/quan-ly-bai-test/bai-test/chinh-sua/?${user.slug}`,
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
            <Tooltip
              content="Xóa"
              color="error"
              onClick={() => console.log('Xóa', user?.id)}
            >
              <IconButton>
                <Image src={SrcIcons.deleteActionIcon} height={24} width={24} />
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
      <div className="flex mb-[1rem] gap-3">
        <Input
          size="large"
          placeholder="Tìm kiếm tên bài test"
          className="rounded-[10px] bg-white"
          allowClear
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
            <span className="text-sm leading-[21px]">Thêm bài test</span>
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
          rowsPerPage={5}
          onPageChange={(page) => console.log({ page })}
        />
      </Table>
    </>
  );
}
