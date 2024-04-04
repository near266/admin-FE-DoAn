import SrcIcons from '@/assets/icons';
import SrcImages from '@/assets/images';
import { IconButton } from '@/components/IconButton';
import IAssessment from '@/interfaces/models/IAssessment';
import { assessmentService } from '@/modules/ManageAssessments/shared/api';
import {
  AssessmentStatusCode,
  AssessmentTypeNumeric,
  AssessmentTypeToAssessmentTypeNumeric,
  SV_RES_STATUS_CODE,
} from '@/shared/enums/enums';
import { Common } from '@/shared/utils';
import { appLibrary } from '@/shared/utils/loading';
import { debounce } from '@mui/material';
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
import { Button, DatePicker, Form, Input, message, Popconfirm, Select } from 'antd';
import Image from 'next/legacy/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { formatServerDateToDurationString } from '@/shared/helpers';
import FormItem from 'antd/lib/form/FormItem';
import { managerServiceService } from '../../shared/api';
import { LICENSE_DATA_FIELD, listCareer, listStatus } from '../../shared/enum';
import { IGetListLicenseRes } from '../../shared/interface';

export interface IProps {
  license: IGetListLicenseRes[];
}

const columns = [
  { name: 'MÃ GÓI', uid: 'id' },
  { name: 'TÊN GÓI', uid: 'name' },
  { name: 'LĨNH VỰC', uid: 'field' },
  { name: 'THỜI GIAN SỬ DỤNG', uid: 'period' },
  { name: 'NGÀY KÍCH HOẠT', uid: 'activation_date' },
  { name: 'NGÀY HẾT HẠN', uid: 'expiration_date' },
  { name: 'TRẠNG THÁI', uid: 'status' },
  { name: 'THAO TÁC', uid: 'action' },
];

const mapToTableData = (license: IGetListLicenseRes[]) =>
  license &&
  license.map((item) => ({
    id: item.id,
    license_code: item.license_code,
    license_name: item.license_name,
    career_field_id: item.career_field_id,
    selling_price: item.selling_price,
    listed_price: item.listed_price,
    created_date: item.created_date,
    last_modified_date: item.last_modified_date,
    status: item.status,
  }));

export function BussinessPackageChild(props: IProps) {
  const { license } = props;
  const router = useRouter();
  const [form] = Form.useForm();
  const rootData = useMemo(() => mapToTableData(license), [license]);
  const [filtedData, setFiltedData] = useState<IGetListLicenseRes[]>(rootData);
  const [dataTable, setDataTable] = useState<IGetListLicenseRes[]>(rootData);
  const collator = useCollator({ numeric: true });
  const load = async ({ signal }) => {
    return {
      items: dataTable,
    };
  };
  const handleAddNewDataFromOrder = useCallback((newData: IGetListLicenseRes) => {
    // Thêm dữ liệu mới vào bảng
    setDataTable(prevData => [...prevData, newData]);
  }, []);
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const page = 0;
        const pageSize = 10; 
        const params = {
          enterpriseId: localStorage.getItem('enterprise_id')
        }; 
        const response = await managerServiceService.getAllLicenseOrder(page, pageSize, params);
        if (response.data && response.data.length > 0) {
          setDataTable(response.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData(); 
  }, []);

  const fetchData2 = async (params) => {
    appLibrary.showloading();
    try {
      const page = 0;
      const pageSize = 10; 
      const response = await managerServiceService.getAllLicense(page, pageSize, params);
      if (response.data && response.data.length > 0) {
        appLibrary.hideloading();
        setDataTable(response.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  

  const handleDelete = async (id) => {
    try {
      const response = await managerServiceService.deleteLicenseOrder(id);
      if (response) {
        const newData = dataTable.filter((item) => item.id !== id);
        setDataTable(newData);
        message.success('Xoá thành công!');
      } else {
        message.error('Xoá thất bại!');
      }
    } catch (error) {
      console.error('Lỗiiiii:', error);
      message.error('Xoá bị lỗi!');
    } finally {
      appLibrary.hideloading();
    }
  };

  const handleSearch = debounce(async (value) => {
    appLibrary.showloading();
    try {
      const { data } = await managerServiceService.getAllLicense(
        0,
        10,
        Common.removeVietnameseTones(value).toLowerCase()
      );
      setDataTable(data);
      appLibrary.hideloading();
    } catch (error) {
      console.log(error);
      appLibrary.hideloading();
    }
  }, 300);
  const handlePublise = async (value, assessment_id) => {
    console.log(value, assessment_id);

    try {
      appLibrary.showloading();
      const res = await assessmentService.updateNewAssessmentStatus(assessment_id, {
        status: value,
      });
      if (res.code === SV_RES_STATUS_CODE.success) {
        const newData = filtedData.map((item) => {
          if (item.id === assessment_id) {
            item.status = value;
          }
          return item;
        });
        // setFiltedData(newData);
        // console.log(newData);
        // setDataTable(newData);
        appLibrary.hideloading();
        return message.success('Cập nhật thành công!');
      }
    } catch (error) {
      appLibrary.hideloading();
      message.warning('Xuất bản thất bại!');
    }
  };
  const onSearch = (event) => {
    const { value } = event.target;
    handleSearch(value);
  };

  const filterOption = (input: string, option?: { label: string; value: string }) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  const list = useAsyncList({ load, sort });
  const renderCell = (item: IGetListLicenseRes, columnKey: React.Key) => {
    const cellValue = item[columnKey];
    switch (columnKey) {
      case 'id':
        return (
          <Col>
            <Row>
              <span className="text-[14px]">{item.license_code}</span>
            </Row>
          </Col>
        );
      case 'name':
        return (
          <Col>
            <Row align="center">
              <span className="text-[14px]">{item.license_name}</span>
            </Row>
          </Col>
        );
      case 'field':
        return (
          <Col>
            <Row align="center">
              <span className="text-[14px]">
                {viewValueItem(item.career_field_id, listCareer)}
              </span>
            </Row>
          </Col>
        );
      case 'period':
        return (
          <Col>
            <Row align="center">
              <span className="text-[14px]">{item.period} tháng</span>
            </Row>
          </Col>
        );
      case 'expiration_date':
        return (
          <Col>
            <Row align="center">
              <span className="text-[14px]">{item.expiration_date}</span>
            </Row>
          </Col>
        );
      case 'activation_date':
        return (
          <Col>
            <Row align="center">
              <span className="text-[14px]">{item.activation_date}</span>
            </Row>
          </Col>
        );
      case 'modifiedDate':
        return (
          <Col>
            <Row align="center">
              <span className="text-[14px]">{item.last_modified_date}</span>
            </Row>
          </Col>
        );
      case 'status':
        return (
          <Col>
            <Row align="center">
              <span className={`text-[14px] 
                ${item.status === 0 ? 'text-color-error' :
                item.status === 1 ? 'text-color-access' :
                item.status === 2 ? 'text-color-default' : ''}`}>
                {viewValueItem(item.status, listStatus)}
              </span>
            </Row>
          </Col>
        );
      case 'action':
        return (
          <Row className="ml-[30px] gap-2">
            <Tooltip content="Sửa">
              <IconButton>
                <Link
                  href={`/quan-ly-thanh-vien/doanh-nghiep/them-moi/chinh-sua/${item.id}`}
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
                  onClick={() => 
                    {
                      handleDelete(item.id)
                      console.log('ID: ', item.id)
                    }
                  }
                />
              </IconButton>
            </Tooltip>
          </Row>
        );
      default:
        return cellValue;
    }
  };

  useEffect(() => {
    console.log('mmm', dataTable);
  }, []);

  const viewValueItem = (value: number, list: any[]): string => {
    return list.find((item: any) => item.value === value)?.label;
  };

  // const handleFormSubmit = () => {
  //   const dateString = JSON.stringify(form.getFieldValue('created_date'));
  //   // form.setFieldValue('created_date', dateString);
  //   console.log('bbb', form.getFieldValue('created_date')?.format('YYYY-MM-DD'));
  //   // console.log('aaa', form.getFieldsValue());
  // };

  const handleFormSubmit = () => {
    const values = form.getFieldsValue();
    const params = {
      enterprise_id: localStorage.getItem('enterprise_id'),
      license_code: values[LICENSE_DATA_FIELD.license_code],
      license_name: values[LICENSE_DATA_FIELD.license_name],
      status: values[LICENSE_DATA_FIELD.status],
      career_field_id: values[LICENSE_DATA_FIELD.career_field_id],
      activation_date: values[LICENSE_DATA_FIELD.activation_date],
      expiration_date: values[LICENSE_DATA_FIELD.expiration_date],
    };
    fetchData2(params);
  };

  return (
    <>
      <div className="relative">
        <Form
          form={form}
          onFinish={handleFormSubmit}
          className="flex mb-[1rem] gap-3 justify-between"
        >
          <FormItem name={LICENSE_DATA_FIELD.license_code} className="w-1/6">
            <Input
              size="large"
              placeholder="Mã gói"
              className="rounded-[10px] bg-white w-full"
              allowClear
              onChange={onSearch}
            />
          </FormItem>
          <FormItem name={LICENSE_DATA_FIELD.license_name} className="w-1/6">
            <Input
              size="large"
              placeholder="Tên gói"
              className="rounded-[10px] bg-white w-full"
              allowClear
              onChange={onSearch}
            />
          </FormItem>
          <FormItem name={LICENSE_DATA_FIELD.career_field_id} className="w-1/6">
            <Select
              size="large"
              className="!w-full"
              showSearch
              placeholder="Lĩnh vực"
              allowClear
            >
              {listCareer.map((item: any) => {
                return (
                  <Select.Option key={item.value} value={item.value}>
                    {item.label}
                  </Select.Option>
                );
              })}
            </Select>
          </FormItem>
          <FormItem name={LICENSE_DATA_FIELD.activation_date} className="w-1/6">
            <DatePicker 
                placeholder="Ngày kích hoạt" 
                className="!w-full !h-[39px] rounded-[10px]" 
                format="DD/MM/YYYY"
            />
          </FormItem>
          <FormItem name={LICENSE_DATA_FIELD.expiration_date} className="w-1/6">
            <DatePicker 
                placeholder="Ngày hết hạn" 
                className="!w-full !h-[39px] rounded-[10px]" 
                format="DD/MM/YYYY"
            />
          </FormItem>
          <FormItem name={LICENSE_DATA_FIELD.status} className="w-1/6">
            <Select
              size="large"
              className="!w-full"
              showSearch
              placeholder="Trạng thái"
              allowClear
            >
              {listStatus.map((item: any) => {
                return (
                  <Select.Option key={item.value} value={item.value}>
                    {item.label}
                  </Select.Option>
                );
              })}
            </Select>
          </FormItem>
          <button
            type="submit"
            className="min-w-[150px] px-3 cursor-pointer rounded-[10px] bg-[var(--primary-color)] flex items-center justify-center text-[var(--primary-color)] "
          >
            <span className="text-sm text-white font-[600] tracking-[0.1px] leading-[21px] mr-1">
              Tìm kiếm
            </span>
            <div className="relative h-4 w-4">
              <Image src={SrcIcons.searchIcon} layout="fill" />
            </div>
          </button>
        </Form>
        <div className="counter pointer-events-none absolute z-10 bottom-[1rem] translate-x-[100px]">
          {/* Tổng số gói: {dataTable.length} gói */}
        </div>
        <div className="flex items-center justify-between mt-5 mb-3">
          <p className="text-[var(--primary-color)] font-bold text-xl mb-3">
            Danh sách gói
          </p>
          <Link href={`/quan-ly-thanh-vien/doanh-nghiep/them-moi`}>
            <div className="w-fit cursor-pointer rounded-[10px] bg-[var(--primary-color)] text-white py-3 px-4">
              Thêm mới
            </div>
          </Link>
        </div>
        <Table
          selectionMode="none"
          lang="vi"
          sticked={false}
          lined
          autoSave="true"
          suppressHydrationWarning
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
            {(item: IGetListLicenseRes) => (
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
            rowsPerPage={7}
            initialPage={1}
            // total={Math.ceil(dataTable.length / 7)}
            onPageChange={(page) => console.log({ page })}
          ></Table.Pagination>
        </Table>
      </div>
    </>
  );
}
