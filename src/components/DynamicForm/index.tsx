import SrcIcons from '@/assets/icons';
import { DYNAMIC_FIELD } from '@/modules/ManageAssessments/shared/types';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { Form, Input, Popconfirm } from 'antd';
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

interface Iprops {
  options: options[];
  formName: string;
  idField: string;
  nameField: string;
  deletedMessage?: string;
  onChange: (value: state) => void;
  onSubmit: (value) => void;
  onDelete: (field: DYNAMIC_FIELD, value) => void;
  wraperClassName?: string;
  reloadAfterDelete?: boolean;
}

const DynamicForm = (props: Iprops, ref) => {
  const {
    options,
    deletedMessage,
    onChange,
    idField,
    nameField,
    reloadAfterDelete,
    onDelete,
    onSubmit,
    formName,
    wraperClassName,
  } = props;
  const [value, setValue] = useState<state[]>([]);
  const dynamicFormRef = useRef(null);
  const deleted = [];
  const [animateRef] = useAutoAnimate<HTMLDivElement>(/* optional config */);
  const [form] = Form.useForm();
  const onValueChange = useCallback((event) => {}, [onChange]);

  useImperativeHandle(ref, () => {
    if (ref) {
      return {
        add(value, index) {
          dynamicFormRef.current['add'](value, index);
        },
        remove(name) {
          dynamicFormRef.current['remove'](name);
        },
        submit() {
          return form.getFieldsValue();
        },
        update(value, index) {
          const { id, name } = value;
          form.setFields([
            { name: [formName, index, idField], value: id },
            { name: [formName, index, nameField], value: name },
          ]);
        },
        getDeleted() {
          return deleted;
        },
      };
    }
  });
  const onFinish = (values: any) => {
    // trigger submit event
    // form.submit();
    return values;
  };

  return (
    <>
      <Form form={form} onFinish={onFinish} autoComplete="off" className="w-full">
        <Form.List name={formName}>
          {(fields, { add, remove }) => {
            if (dynamicFormRef.current === null) {
              dynamicFormRef.current = {
                add,
                remove,
                onFinish,
              };
            }
            return (
              <div ref={animateRef}>
                {fields.map((field) => (
                  <div className="flex flex-nowrap flex-row mt-3">
                    <div
                      className={clsx(
                        'w-full flex flex-row mt-1 gap-5 flex-1',
                        wraperClassName
                      )}
                    >
                      <Form.Item
                        className="hidden"
                        name={[field.name, idField]}
                        fieldKey={[field.key, idField]}
                        rules={[
                          { required: false, message: 'Không được để trống trường này!' },
                        ]}
                      >
                        <Input
                          size="large"
                          bordered={false}
                          disabled
                          placeholder="id"
                          className="rounded-[10px] !bg-white drop-shadow-[0_0px_7px_rgba(41,41,50,0.1)]"
                          allowClear
                        />
                      </Form.Item>
                      <Form.Item
                        className="w-full pr-5"
                        name={[field.name, nameField]}
                        fieldKey={[field.key, nameField]}
                        rules={[
                          { required: false, message: 'Không được để trống trường này!' },
                        ]}
                      >
                        <Input
                          size="large"
                          bordered={false}
                          placeholder="Nội dung"
                          className="rounded-[10px] !bg-white drop-shadow-[0_0px_7px_rgba(41,41,50,0.1)]"
                          allowClear
                        />
                      </Form.Item>
                    </div>
                    <Popconfirm
                      placement="leftTop"
                      title={deletedMessage ?? 'Bạn có chắc chắn muốn xóa mục này?'}
                      onConfirm={() => {
                        const deletedData = Object.values(form.getFieldsValue())[0][
                          field.name
                        ];
                        console.log(deletedData);
                        deleted.push(deletedData);
                        onDelete(field as DYNAMIC_FIELD, deletedData);
                        // remove(field.name);
                      }}
                      okText="Xóa"
                      cancelText="Hủy"
                    >
                      <div className="relative h-8 w-8 float-right ml-[10px]">
                        <Image
                          layout="fill"
                          objectFit="contain"
                          src={SrcIcons.bin}
                          alt="bin"
                        />
                      </div>
                    </Popconfirm>
                  </div>
                ))}
              </div>
            );
          }}
        </Form.List>
      </Form>
    </>
  );
};
export default forwardRef(DynamicForm);
