import SrcIcons from '@/assets/icons';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { Form, Input, Popconfirm, Select } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import clsx from 'clsx';
import Image from 'next/legacy/image';
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
type options = {
  key: string | number;
  label: React.ReactNode;
  value: string | number;
};
type state = {
  categoryId: string | number;
  categoryName?: string;
  categoryContent: string;
};
/*
  @formName: tên của form cần phải truyền vào đúng với tên của object bạn muốn gửi lên server
  @options: ddữ liệu của 1 dynamic field
  @idField: tên của trường id của form
  @nameField: tên của trường name của form
  @valueField: tên của trường value của form
  @isInput: true nếu là input, false nếu là textarea
  @titleRight: tiêu đề của phần bên phải
  @titleLeft: tiêu đề của phần bên trái
 */
interface Iprops {
  options: options[];
  formName: string;
  idField: string;
  nameField: string;
  valueField: string;
  isInput?: boolean;
  disabledSelect?: boolean;
  deletedMessage?: string;
  reloadAfterDelete?: boolean;
  titleRight?: React.ReactNode | string;
  titleLeft?: React.ReactNode | string;
  initialCategories?: { categoryId: any; categoryContent: string }[];
  onChange: (value: state) => void;
  onSubmit: (value) => void;
  onDelete: (value) => void;
}
const { Option } = Select;
const DynamicInputTextArea = (props: Iprops, ref) => {
  const {
    options,
    titleRight,
    isInput,
    titleLeft,
    initialCategories,
    idField,
    nameField,
    reloadAfterDelete,
    deletedMessage,
    formName,
    valueField,
    disabledSelect,
    onChange,
    onDelete,
    onSubmit,
  } = props;
  const deletedCategories = [];
  const [value, setValue] = useState<state[]>([]);
  const categoryRef = useRef(null);
  const [animateRef] = useAutoAnimate<HTMLDivElement>(/* optional config */);
  const [form] = Form.useForm();
  const onValueChange = useCallback((event) => {}, [onChange]);
  // sử dunng hook useImperativeHandle để expose những method cho component cha
  useImperativeHandle(ref, () => {
    return {
      add(value, index) {
        return categoryRef.current['add'](value, index);
      },
      remove(index) {
        return categoryRef.current['remove']();
      },
      submit() {
        return form.getFieldsValue();
      },
      getDeleted() {
        return deletedCategories;
      },
      update(data: { id: any; name: any; value: any }, index) {
        // tốn 3 tieesng cho cái này =))
        const { id, name, value } = data;
        form.setFields([
          { name: [formName, index, idField], value: id },
          { name: [formName, index, nameField], value: name },
          { name: [formName, index, valueField], value: value },
        ]);
      },
    };
  });
  const onFinish = (values: any) => {
    // trigger submit event
    // form.submit();
    return values;
  };

  return (
    <>
      <Form
        form={form}
        onFinish={onFinish}
        autoComplete="off"
        className="w-full"
        {...(initialCategories ? { initialValues: initialCategories } : {})}
      >
        <Form.List name={formName}>
          {(fields, { add, remove }) => {
            if (categoryRef.current === null) {
              categoryRef.current = {
                add,
                remove,
                onFinish,
              };
            }
            return (
              <div ref={animateRef} className={clsx(fields.length && 'wrapper-border')}>
                {fields.map((field, index) => {
                  return (
                    <>
                      {index === 0 && (
                        <div className="col-span-12 flex gap-5 w-[97%]">
                          <p className="block_title block w-1/2">{titleLeft}</p>
                          <p className="block_title block w-1/2">{titleRight}</p>
                        </div>
                      )}
                      <div className="flex flex-nowrap flex-row  mt-5" key={field.key}>
                        <div className="w-full flex flex-row gap-5 flex-1">
                          <Form.Item
                            className="w-1/2 hidden"
                            {...field}
                            name={[field.name, idField]}
                            fieldKey={[field.key, idField]}
                            rules={[
                              {
                                required: false,
                                message: 'Không được để trống trường này!',
                              },
                            ]}
                          >
                            <TextArea
                              className="w-full"
                              placeholder="Nhập nội dung"
                              disabled
                              autoSize={{ minRows: 2, maxRows: 6 }}
                            />
                          </Form.Item>
                          <Form.Item
                            className="w-1/2"
                            {...field}
                            name={[field.name, nameField]}
                            fieldKey={[field.key, nameField]}
                            rules={[
                              {
                                required: false,
                                message: 'Không được để trống trường này!',
                              },
                            ]}
                          >
                            {isInput ? (
                              <Input
                                size="large"
                                bordered={false}
                                placeholder="Nội dung"
                                className="rounded-[10px] !bg-white drop-shadow-[0_0px_7px_rgba(41,41,50,0.1)]"
                                allowClear
                              />
                            ) : (
                              <Select
                                className="rounded-[10px] bg-white w-full flex overflow-hidden z-[1] drop-shadow-[0_0px_7px_rgba(41,41,50,0.1)] 'font-[400] text-sm text-[#696974]'"
                                size="large"
                                bordered={false}
                                placement="bottomLeft"
                                direction="rtl"
                                disabled={disabledSelect}
                                dropdownAlign={{ offset: [0, 0] }}
                                suffixIcon={
                                  <div>
                                    <Image
                                      width={20}
                                      height={20}
                                      objectFit="cover"
                                      src={SrcIcons.dropDown}
                                      alt=""
                                    />
                                  </div>
                                }
                              >
                                {options &&
                                  options.map((item) => (
                                    <Option key={item.key} value={item.value}>
                                      <span
                                        className={clsx(
                                          'font-[400] text-sm text-[#696974]'
                                        )}
                                      >
                                        {item.label}
                                      </span>
                                    </Option>
                                  ))}
                              </Select>
                            )}
                          </Form.Item>
                          <Form.Item
                            className="w-1/2"
                            {...field}
                            name={[field.name, valueField]}
                            fieldKey={[field.key, valueField]}
                            rules={[
                              {
                                required: false,
                                message: 'Không được để trống trường này!',
                              },
                            ]}
                          >
                            <TextArea
                              data-key={field.key}
                              rows={5}
                              allowClear
                              placeholder="Nội dung"
                              className="rounded-[10px] resize-none w-full text-[#696974] custom_scrollbar"
                              onChange={onValueChange}
                              // value={value[key].categoryContent}
                              onResize={() => {}}
                            />
                          </Form.Item>
                        </div>
                        <Popconfirm
                          placement="leftTop"
                          title={deletedMessage ?? 'Bạn có chắc chắn muốn xóa nhóm này?'}
                          onConfirm={() => {
                            const deletedData = Object.values(form.getFieldsValue())[0][
                              field.name
                            ];
                            deletedData && deletedCategories.push(deletedData);
                            remove(field.name);
                            onDelete(field);
                          }}
                          okText="Xóa"
                          cancelText="Hủy"
                        >
                          <div className="relative h-8 w-8 float-right ml-[10px] select-none">
                            <Image
                              layout="fill"
                              objectFit="contain"
                              src={SrcIcons.bin}
                              alt="bin"
                            />
                          </div>
                        </Popconfirm>
                      </div>
                    </>
                  );
                })}
              </div>
            );
          }}
        </Form.List>
      </Form>
    </>
  );
};
export default forwardRef(DynamicInputTextArea);
