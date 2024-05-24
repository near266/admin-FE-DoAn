import React, { useMemo, useState } from 'react';
import { DatePicker, Input, message } from 'antd';
import SrcIcons from '@/assets/icons';
import Link from 'next/link';
import { IconButton } from '@/components/IconButton';

import Image from 'next/legacy/image';
import {
  Col,
  Row,
  Table,
  Tooltip,
  useAsyncList,
  useCollator,
  User,
} from '@nextui-org/react';
import { JOBS_STATUS, JOBS_STATUS_NUMERIC } from '@/modules/ManageJobs/shared/enum';
import { CustomSelector } from '@/components/CustomSelector';

const Enterprise = () => {
  const [dataTable, setDataTable] = useState<any[]>();
  const renderCell = useMemo(
    // eslint-disable-next-line react/display-name
    () => (item: any, columnKey: React.Key) => {
      const cellValue = item[columnKey];
      switch (columnKey) {
        case 'name':
          return <div className="text-[14px] font-semibold">{item.name}</div>;
        case 'represent':
          return (
            <User
              squared
              src={item?.avatar ?? SrcIcons.iconYouth}
              size="xl"
              name={item.represent}
            ></User>
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
            <CustomSelector
              wrapperClassName="w-[200px] mb-0 "
              onChange={(value) => {
                console.log('aaa');
              }}
              initialValue={JOBS_STATUS[item.status]}
              options={[
                {
                  key: JOBS_STATUS_NUMERIC.APPROVED,
                  value: JOBS_STATUS_NUMERIC.APPROVED,
                  label: JOBS_STATUS.APPROVED,
                },
                {
                  key: JOBS_STATUS_NUMERIC.PENDING,
                  value: JOBS_STATUS_NUMERIC.PENDING,
                  label: JOBS_STATUS.PENDING,
                },
                {
                  key: JOBS_STATUS_NUMERIC.REJECTED,
                  value: JOBS_STATUS_NUMERIC.REJECTED,
                  label: JOBS_STATUS.REJECTED,
                },
              ]}
            />
          );
        case 'actions':
          return (
            <Row className="ml-[30px]">
              <Tooltip content="Sửa">
                <Link
                  href={`/quan-ly-thanh-vien/doanh-nghiep/chinh-sua/${item.id}`}
                  legacyBehavior
                >
                  <IconButton
                    onClick={() => {
                      localStorage.setItem('enterprise_id', '');
                    }}
                  >
                    <Image src={SrcIcons.seeDetail} height={30} width={30} />
                  </IconButton>
                </Link>
              </Tooltip>
            </Row>
          );
        default:
          return cellValue;
      }
    },
    []
  );
  async function load({ signal }) {
    return {
      items: dataTable,
    };
  }
  async function sort({ items, sortDescriptor }) {
    return {
      items: [],
    };
  }
  const list = useAsyncList({ load, sort });

  const onSearch = () => {};
  const columns = [
    { name: 'DOANH NGHIỆP', uid: 'name' },
    { name: 'ĐẠI DIỆN', uid: 'represent' },
    { name: 'EMAIL', uid: 'email' },
    // { name: 'GÓI', uid: 'plan' },
    { name: 'NGÀY TẠO', uid: 'created_at' },
    // { name: 'TRẠNG THÁI', uid: 'status' },
    { name: 'THAO TÁC', uid: 'actions' },
  ];
  const handlePagyChange = () => {
    console.log('aa');
  };

  return (
    <>
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

        <div className="min-w-[150px] px-3 cursor-pointer rounded-[10px] bg-[var(--primary-color)] flex items-center justify-center text-[var(--primary-color)] ">
          <span className="text-sm text-white font-[600] tracking-[0.1px] leading-[21px] mr-1">
            Tìm kiếm
          </span>
          <div className="relative h-4 w-4">
            <Image src={SrcIcons.searchIcon} layout="fill" />
          </div>
        </div>
      </div>
      <Table
        className="custom_table"
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
              allowsSorting={column.uid === 'created_at'}
            >
              <div className="flex gap-2">
                {column.name}

                {column.uid === 'created_at' ? (
                  <Image src={SrcIcons.sort} width={24} height={24} />
                ) : null}
              </div>
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
          initialPage={1}
          page={1}
          total={10}
          onPageChange={handlePagyChange}
        />
      </Table>
    </>
  );
};

export default Enterprise;
