import SrcIcons from '@/assets/icons';
import { CustomSelector } from '@/components/CustomSelector';
import { IconButton } from '@/components/IconButton';
import AlertDialogSlide from '@/components/Modal';
import DeniedPopUp from '@/modules/ManageJobs/components/DeniedPopUp';
import { jobService } from '@/modules/ManageJobs/shared/api';
import { TNews } from '@/pages/quan-ly-viec-lam/danh-sach-doanh-nghiep/chinh-sua/[id]';
import { SV_RES_STATUS_CODE } from '@/shared/enums/enums';
import { appLibrary } from '@/shared/utils/loading';
import { Row, Table, Tooltip, useAsyncList, User } from '@nextui-org/react';
import { Button, message } from 'antd';
import moment from 'moment';
import Image from 'next/legacy/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import {
  DENIED_POP_UP,
  JOBS_STATUS,
  JOBS_STATUS_NUMERIC,
  SORT_DIRECTION,
} from '../../../../shared/enum';

export interface IProps {
  posts: TNews[];
  total_page: number;
}

interface IDelete {
  id: string;
  onChange(open: boolean): void;
  update(post_id: string): void;
}

const columns = [
  { name: 'TÊN TIN TUYỂN', uid: 'name' },
  { name: 'SỐ LƯỢNG ỨNG VIÊN', uid: 'total_cv' },
  { name: 'THỜI GIAN', uid: 'created_at' },
  { name: 'THAO TÁC', uid: 'actions' },
  { name: 'PHÊ DUYỆT', uid: 'status' },
];

const sample = [
  {
    id: 0,
    name: 'Doanh nghiep 1',
    avatar: 'http://cisif.do/ibi',
    total_cv: 32,
    created_at: Date.now.toString,
    status: JOBS_STATUS.APPROVED,
  },
  {
    id: 1,
    name: 'Doanh nghiep 1',
    avatar: 'http://cisif.do/ibi',
    total_cv: 32,
    created_at: Date.now.toString,
    status: JOBS_STATUS.PENDING,
  },
  {
    id: 2,
    name: 'Doanh nghiep 1',
    avatar: 'http://cisif.do/ibi',
    total_cv: 32,
    created_at: Date.now.toString,
    status: JOBS_STATUS.REJECTED,
  },
];

export function DeleteConfirm({ id, onChange, update }: IDelete) {
  const handleDelete = async () => {
    console.log(id);
    appLibrary.showloading();
    try {
      const { data } = await jobService.deleteEnterprisePosts(id);
      console.log(data);
      if (data.success === true) {
        update(id);
        message.success('Xóa thành công');
        return;
      }
      message.error('Xóa không thành công');
    } catch (error) {
      console.log(error);
    } finally {
      appLibrary.hideloading();
      handleClose();
    }
  };
  const handleClose = () => {
    onChange(false);
  };
  return (
    <div className="px-7 py-4 pb-0">
      <h2 className="mb-7">Bạn có chắc muốn xóa tin tuyển dụng này không?</h2>
      <div className="flex justify-between">
        <Button
          className="text-[#403ECC] font-[600] text-[18px] rounded-[10px] leading-[21px] flex justify-center items-center w-auto px-[20px] py-[20px]  border-0"
          onClick={handleClose}
        >
          Quay lại
        </Button>
        <Button
          className="text-[18px] bg-primary hover:bg-primary text-white hover:text-white focus:bg-primary focus:text-white rounded-[10px] font-[600] leading-[21px] flex justify-center items-center w-auto px-[20px] py-[20px] drop-shadow-[0_0px_7px_rgba(41,41,50,0.1)]"
          onClick={handleDelete}
        >
          Đồng ý
        </Button>
      </div>
    </div>
  );
}

export function News({ posts, total_page }: IProps) {
  const router = useRouter();
  const [openDetail, setOpenDetail] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [openDeny, setOpenDeny] = useState(false);
  const [postId, setPostId] = useState(null);
  const [openDeleteConfirm, setopenDeleteConfirm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortDirection, setsortDirection] = useState<SORT_DIRECTION>(
    SORT_DIRECTION.DEFAULT
  );
  const toggleDeny = (value) => setOpenDeny(value);

  const [dataTable, setDataTable] = useState(posts);

  async function load({ signal }) {
    return {
      items: dataTable,
    };
  }

  async function sort({ items, sortDescriptor }) {
    setIsLoading(true);
    appLibrary.showloading();
    try {
      let newDirection;
      if (sortDirection === SORT_DIRECTION.DEFAULT) {
        newDirection = SORT_DIRECTION.SORTED;
      } else {
        newDirection = SORT_DIRECTION.DEFAULT;
      }
      await setsortDirection(newDirection);
      const { data } = await jobService.getEnterprisePostsbyPage(
        router.query.id as string,
        currentPage,
        newDirection
      );
      setDataTable(data);
      appLibrary.hideloading();
      setIsLoading(false);
      return {
        items: data,
      };
    } catch (error) {
      console.log(error);
      appLibrary.hideloading();
      setIsLoading(false);
    }
  }
  const list = useAsyncList({ load, sort });

  const updateAfterDelete = (id: string) => {
    console.log(id);
    setDataTable((prev) => prev.filter((item) => item.id !== id));
  };

  const handleChangeState = async (id: string | number, value: JOBS_STATUS_NUMERIC) => {
    appLibrary.showloading();
    try {
      if (value === JOBS_STATUS_NUMERIC.REJECTED) {
        setPostId(id);
        setOpenDeny(true);
        appLibrary.hideloading();
        return;
      }
      // const data = {
      //   status_id: value,
      //   reason_of_rejection: 'Ly do tu choi',
      // };

      const data = {
        status: value,
        api_key: 'ywvJro$Dna5p11dGg$Q7L3dI#',
      };
      const { code } = await jobService.updateJobPostStatus(id, data);
      if (code === SV_RES_STATUS_CODE.success) {
        appLibrary.hideloading();
        return message.success('Cập nhật thành công');
      }
      appLibrary.hideloading();
      message.error('Cập nhật chưa thành công');
    } catch (error) {
      appLibrary.hideloading();
      console.log(error.message);
    }
  };

  const renderCell = useMemo(
    // eslint-disable-next-line react/display-name
    () => (item: any, columnKey: React.Key) => {
      const cellValue = item[columnKey];
      switch (columnKey) {
        case 'total_cv':
          return (
            <div className="text-[18px] underline text-[#403ECC] ml-[80px]">
              {item.total_cv}
            </div>
          );
        case 'name':
          return (
            <div className="flex">
              <User
                squared
                src={item?.image_url ?? SrcIcons.iconYouth}
                size="xl"
                name={item.title}
              ></User>
              <IconButton>
                <Image src={SrcIcons.ic_link} width={24} height={24} />
              </IconButton>
            </div>
          );
        case 'created_at':
          return moment(item.created_at).format('YYYY-MM-DD hh:mm:ss');
        case 'status':
          return (
            <CustomSelector
              wrapperClassName="w-[200px] mb-0 "
              onChange={(value) => {
                console.log(value);
                handleChangeState(item.id, value);
              }}
              initialValue={item.approve_status_id}
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
            <Row className="ml-[30px] gap-2">
              <Tooltip content="Sửa">
                <IconButton
                  onClick={() => {
                    setOpenDetail(true);
                  }}
                >
                  <Link
                    href={`/quan-ly-viec-lam/tin-tuyen-dung/chinh-sua/${item.id}`}
                    legacyBehavior
                  >
                    <Image src={SrcIcons.editActionIcon} height={30} width={30} />
                  </Link>
                </IconButton>
              </Tooltip>

              <Tooltip content="Xóa">
                <IconButton>
                  <Image
                    src={SrcIcons.deleteActionIcon}
                    height={30}
                    width={30}
                    onClick={async () => {
                      await setPostId(item.id);
                      setopenDeleteConfirm(true);
                    }}
                  />
                </IconButton>
              </Tooltip>
            </Row>
          );
        default:
          return cellValue;
      }
    },
    []
  );

  const getPagyData = async (page: number) => {
    setIsLoading(true);
    appLibrary.showloading();
    try {
      const { data } = await jobService.getEnterprisePostsbyPage(
        router.query.id as string,
        currentPage,
        sortDirection
      );
      setDataTable(data);
      setCurrentPage(page);
      appLibrary.hideloading();
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      appLibrary.hideloading();
      setIsLoading(false);
    }
  };

  const handlePagyChange = async (page: number) => {
    getPagyData(page);
  };

  return (
    <>
      <AlertDialogSlide
        size="lg"
        isOpen={openDeleteConfirm}
        contentChild={
          <DeleteConfirm
            update={updateAfterDelete}
            id={postId}
            onChange={(value) => {
              setopenDeleteConfirm(value);
            }}
          />
        }
        onChange={() => {
          setopenDeleteConfirm(false);
        }}
        onCancel={() => {
          setopenDeleteConfirm(false);
        }}
        onConfirm={() => {}}
      />
      <DeniedPopUp
        open={openDeny}
        onChange={toggleDeny}
        type={DENIED_POP_UP.NEWS}
        id={postId}
      />
      {isLoading ? (
        <></>
      ) : (
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
            page={Number(currentPage)}
            total={total_page}
            onPageChange={handlePagyChange}
          />
        </Table>
      )}
    </>
  );
}
