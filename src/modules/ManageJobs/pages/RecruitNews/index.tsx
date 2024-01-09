import SrcIcons from '@/assets/icons';
import { CustomSelector } from '@/components/CustomSelector';
import { IconButton } from '@/components/IconButton';
import AlertDialogSlide from '@/components/Modal';
import { TNews } from '@/pages/quan-ly-viec-lam/danh-sach-doanh-nghiep/chinh-sua/[id]';
import { SV_RES_STATUS_CODE } from '@/shared/enums/enums';
import { Common } from '@/shared/utils';
import { appLibrary } from '@/shared/utils/loading';
import { Row, Table, Tooltip, useAsyncList, User } from '@nextui-org/react';
import { Input, message } from 'antd';
import moment from 'moment';
import Image from 'next/legacy/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import DeniedPopUp from '../../components/DeniedPopUp';
import { jobService } from '../../shared/api';
import {
  DENIED_POP_UP,
  JOBS_STATUS,
  JOBS_STATUS_NUMERIC,
  SORT_DIRECTION,
} from '../../shared/enum';
import { DeleteConfirm } from '../Edit/Tabs/News';

export interface IProps {
  posts: TNews[];
  total_page: number;
}

const columns = [
  { name: 'TÊN TIN TUYỂN', uid: 'name' },
  { name: 'TÊN DOANH NGHIỆP', uid: 'enterprise_name' },
  { name: 'SỐ LƯỢNG ỨNG VIÊN', uid: 'total_cv' },
  { name: 'THỜI GIAN', uid: 'created_at' },
  { name: 'THAO TÁC', uid: 'actions' },
  { name: 'PHÊ DUYỆT', uid: 'status' },
];

export function RecruitNews({ posts, total_page }: IProps) {
  const [isLoading, setisLoading] = useState(false);
  const router = useRouter();
  const [openDeny, setOpenDeny] = useState(false);
  const [postId, setPostId] = useState(null);
  const [openDeleteConfirm, setopenDeleteConfirm] = useState(false);
  const toggleDeny = (value) => setOpenDeny(value);
  const [searchString, setSearchString] = useState('');
  const [searchPages, setSearchPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(router.query.page ?? 1);
  const [sortDirection, setsortDirection] = useState<SORT_DIRECTION>(
    SORT_DIRECTION.DEFAULT
  );
  console.log(posts);
  const [dataTable, setDataTable] = useState(posts);

  const addQueryString = useCallback(
    (queryString) => {
      const currentUrl = router.pathname;
      router.push(`${currentUrl}${queryString}`, undefined, {
        shallow: true,
      });
    },
    [router]
  );

  const getInitData = async () => {
    setisLoading(true);
    if (Number(currentPage) !== 1) {
      await getPagyData(Number(currentPage));
    }
    setisLoading(false);
  };

  useEffect(() => {
    console.log('first');
    // getInitData();
  }, []);

  useEffect(() => {
    // addQueryString(`?page=${currentPage}`);
  }, [currentPage]);

  async function load() {
    return {
      items: dataTable,
    };
  }

  async function sort({ items, sortDescriptor }) {
    setisLoading(true);
    appLibrary.showloading();
    try {
      let newDirection;
      if (sortDirection === SORT_DIRECTION.DEFAULT) {
        newDirection = SORT_DIRECTION.SORTED;
      } else {
        newDirection = SORT_DIRECTION.DEFAULT;
      }
      setsortDirection(newDirection);
      const { data } = await jobService.getEnterprisesPostsbyPage(
        Number(currentPage),
        newDirection,
        searchString
      );
      console.log('sort', data);
      setDataTable(data);
      appLibrary.hideloading();
      setisLoading(false);

      return {
        items: data,
      };
    } catch (error) {
      console.log(error);
      appLibrary.hideloading();
      setisLoading(false);
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
      const data = {
        status: value,
        api_key: 'ywvJro$Dna5p11dGg$Q7L3dI#',
      };
      // const data = {
      //   status_id: value,
      //   reason_of_rejection: 'Ly do tu choi',
      // };
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

  const handleSearch = async (search_string: string) => {
    setisLoading(true);
    appLibrary.showloading();
    try {
      const { data, meta } = await jobService.getEnterprisesPostsbyPage(
        1,
        sortDirection,
        Common.removeVietnameseTones(search_string).toLowerCase()
      );
      setCurrentPage(1);
      setDataTable(data);
      setSearchPages(meta.total_page);
      appLibrary.hideloading();
      setisLoading(false);
    } catch (error) {
      console.log(error);
      appLibrary.hideloading();
      setisLoading(false);
    }
  };

  const onSearch = (event) => {
    const { value } = event.target;
    handleSearch(value);
    setSearchString(value);
  };

  const renderCell = useMemo(
    // eslint-disable-next-line react/display-name
    () => (item: any, columnKey: React.Key) => {
      const cellValue = item[columnKey];
      switch (columnKey) {
        case 'total_cv':
          return <div className="text-center flex justify-center">{item.total_cv}</div>;
        case 'name':
          return (
            <div className="flex">
              <User
                squared
                src={item.image_url ? item.image_url : SrcIcons.iconYouth}
                size="xl"
                name={item.title}
              ></User>
              <IconButton>
                <Image src={SrcIcons.ic_link} width={24} height={24} />
              </IconButton>
            </div>
          );
        case 'created_at':
          return moment.unix(item.created_at).format('DD/MM/YYYY');
        case 'enterprise_name':
          return <div className="">{item.enterprise.name}</div>;
        case 'status':
          return (
            <CustomSelector
              wrapperClassName="w-[200px] mb-0 "
              initialValue={parseInt(item.approve_status_id)}
              onChange={(value) => {
                console.log(value);
                handleChangeState(item.id, value);
              }}
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
                <Link
                  href={`/quan-ly-viec-lam/tin-tuyen-dung/chinh-sua/${item.id}`}
                  legacyBehavior
                >
                  <IconButton>
                    <Image src={SrcIcons.editActionIcon} height={30} width={30} />
                  </IconButton>
                </Link>
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
    appLibrary.showloading();
    setisLoading(true);
    try {
      const { data } = await jobService.getEnterprisesPostsbyPage(
        page,
        sortDirection,
        Common.removeVietnameseTones(searchString).toLowerCase()
      );
      console.log(data);
      setDataTable([...data]);
      setCurrentPage(page);
      appLibrary.hideloading();
      setisLoading(false);
    } catch (error) {
      console.log(error);
      appLibrary.hideloading();
      setisLoading(false);
    }
  };

  const handlePagyChange = (page: number) => {
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
        onCancel={() => {}}
        onConfirm={() => {}}
      />
      <DeniedPopUp
        open={openDeny}
        onChange={toggleDeny}
        type={DENIED_POP_UP.NEWS}
        id={postId}
      />
      <div className="flex mb-[1rem] gap-3">
        <Input
          size="large"
          placeholder="Tìm kiếm tin tuyển dụng"
          className="rounded-[10px] bg-white"
          allowClear
          onChange={onSearch}
          prefix={<Image src={SrcIcons.searchIcon} width={18} height={18} />}
        />
      </div>
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
            rowsPerPage={5}
            initialPage={Number(router.query.page) ? Number(router.query.page) : 1}
            page={Number(currentPage)}
            total={searchPages ? searchPages : total_page}
            onPageChange={handlePagyChange}
          />
        </Table>
      )}
    </>
  );
}
