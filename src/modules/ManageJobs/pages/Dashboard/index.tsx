import SrcIcons from '@/assets/icons';
import { CustomSelector } from '@/components/CustomSelector';
import { IconButton } from '@/components/IconButton';
import { appLibrary } from '@/shared/utils/loading';
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
import { useCallback, useEffect, useMemo, useState } from 'react';
import DeniedPopUp, { DeniedPopUpJob } from '../../components/DeniedPopUp';
import {
  DENIED_POP_UP,
  JOBS_STATUS,
  JOBS_STATUS_NUMERIC,
  SORT_DIRECTION,
} from '../../shared/enum';
import { debounce } from '@mui/material';
import { TJobs } from '@/pages/quan-ly-viec-lam/danh-sach-doanh-nghiep';
import { Common } from '@/shared/utils';
import { jobService } from '../../shared/api';
import { SV_RES_STATUS_CODE } from '@/shared/enums/enums';
import { useRouter } from 'next/router';

interface IProps {
  jobs: TJobs[];
  total_page: number;
}

interface IInfo {
  user_id: string | number;
  email: string;
  api_key: string;
  status: string | number;
}

const columns = [
  { name: 'DOANH NGHIỆP', uid: 'name' },
  { name: 'ĐẠI DIỆN', uid: 'represent' },
  { name: 'EMAIL', uid: 'email' },
  { name: 'LOẠI', uid: 'plan' },
  { name: 'NGÀY TẠO', uid: 'created_at' },
  { name: 'TRẠNG THÁI', uid: 'status' },
  { name: 'THAO TÁC', uid: 'actions' },
];

export function ManageJobsDashBoard({ jobs, total_page }: IProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [dataTable, setDataTable] = useState<TJobs[]>(jobs);
  const [filtedData, setFiltedData] = useState<TJobs[]>(jobs);
  const [openDinedPopUp, setOpenDinedPopUp] = useState(false);
  const [enterpriseId, setEnterpriseId] = useState(null);
  const [searchString, setSearchString] = useState('');
  const [searchPages, setSearchPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(
    router.query.page ? router.query.page : 1
  );
  const [apiInfo, setApiInfo] = useState<IInfo>({
    user_id: '',
    email: '',
    status: '',
    api_key: '',
  });
  const [sortDirection, setsortDirection] = useState<SORT_DIRECTION>(
    SORT_DIRECTION.DEFAULT
  );
  const addQueryString = useCallback(
    (queryString) => {
      const currentUrl = router.pathname;
      router.push(`${currentUrl}${queryString}`, undefined, {
        shallow: true,
      });
    },
    [router]
  );

  useEffect(() => {
    if (Number(currentPage) !== 1) {
      getPagyData(Number(currentPage));
    }
  }, []);

  useEffect(() => {
    addQueryString(`?page=${currentPage}`);
  }, [currentPage]);

  const toggle = (value) => {
    setOpenDinedPopUp(value);
  };

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
      const { data } = await jobService.getAllEnterprisebyPage(
        Number(currentPage),
        newDirection,
        searchString
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

  const handleChangeState = async (id: string | number, email: string, value: JOBS_STATUS_NUMERIC) => {
    appLibrary.showloading();
    try {
      if (value === JOBS_STATUS_NUMERIC.REJECTED) {
        setEnterpriseId(id);
        setOpenDinedPopUp(true);
        setApiInfo({
          user_id: id,
          status: value,
          api_key: 'ywvJro$Dna5p11dGg$Q7L3dI#',
          email: email,
        });
      } else {
        const data = {
          user_id: id,
          status: value,
          api_key: 'ywvJro$Dna5p11dGg$Q7L3dI#',
          email: email,
        };
        const res = await jobService.updateEnterpriseStatus(data);
        if (res.code === SV_RES_STATUS_CODE.success) {
          message.success('Cập nhật thành công');
        } else {
          message.error('Cập nhật chưa thành công');
        }
      }
      appLibrary.hideloading();
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
                handleChangeState(item.account_id, item.email, value);
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
                  href={`/quan-ly-viec-lam/danh-sach-doanh-nghiep/chinh-sua/${item.id}`}
                  legacyBehavior
                >
                  <IconButton>
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

  const handleSearch = async (search_string: string) => {
    setIsLoading(true);
    appLibrary.showloading();
    try {
      const { data, meta } = await jobService.getAllEnterprisebyPage(
        Number(currentPage),
        sortDirection,
        Common.removeVietnameseTones(search_string).toLowerCase()
      );
      console.log(data);
      setCurrentPage(1);
      setDataTable(data);
      setSearchPages(meta.total_page);
      appLibrary.hideloading();
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      appLibrary.hideloading();
      setIsLoading(false);
    }
  };

  const onSearch = (event) => {
    const { value } = event.target;
    handleSearch(value);
    setSearchString(value);
  };

  const getPagyData = async (page: number) => {
    appLibrary.showloading();
    setIsLoading(true);
    try {
      const { data } = await jobService.getAllEnterprisebyPage(
        page,
        sortDirection,
        searchString
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
      <div className="flex mb-[1rem] gap-3">
        <Input
          size="large"
          placeholder="Tìm kiếm nghề "
          className="rounded-[10px] bg-white"
          allowClear
          onChange={onSearch}
          prefix={<Image src={SrcIcons.searchIcon} width={18} height={18} />}
        />
      </div>
      <DeniedPopUpJob
        onChange={toggle}
        open={openDinedPopUp}
        type={DENIED_POP_UP.COMPANY}
        id={enterpriseId}
        info={apiInfo}
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
