import SrcIcons from '@/assets/icons';
import autoAnimate from '@formkit/auto-animate';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { Button, Form, Input, Popconfirm, Row, Select } from 'antd';
import clsx from 'clsx';
import Image from 'next/legacy/image';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from 'react';
import { isFunction } from 'lodash-es';
import { options } from '../../shared/utils';
import { debounce } from '@mui/material';
const { Option } = Select;

interface IProps {
  defaulSubOptions?: options[];
  assessmentId: string | number;
  mainFormOptions: options[];
  subFormOptions: options[];
  questionTypeTitle?: string;
  answerRef: any;
  deletedMessage?: string;
}

const QuestionDynamicForm = (props: IProps, ref) => {
  const {
    defaulSubOptions,
    mainFormOptions,
    deletedMessage,
    assessmentId,
    answerRef,
    subFormOptions,
    questionTypeTitle,
  } = props;
  const deletedQuestions = [];
  const categoryRef = useRef(null);
  const [animateRef] = useAutoAnimate<HTMLDivElement>();
  const answerAnimationRef = useRef(null);
  const [form] = Form.useForm();
  const onValueChange = useCallback((event) => {}, []);
  useEffect(() => {
    if (answerAnimationRef.current !== null) {
      autoAnimate(answerAnimationRef.current);
    }
  }, [answerAnimationRef.current]);

  useImperativeHandle(ref, () => {
    return {
      add(value, index) {
        categoryRef.current['add'](value, index);
        setTimeout(() => {
          window.scroll(0, window.scrollY + 200);
        }, 200);
      },
      remove() {
        categoryRef.current['remove']();
      },
      submit() {
        return { ...form.getFieldsValue(), assessment_id: assessmentId };
      },
      getRemovedQuestions() {
        return deletedQuestions;
      },
      update(value, index) {
        // tốn 3 tieesng cho cái này =))
        const { id, content, question_type, answers } = value;
        form.setFields([
          { name: ['questions', index, 'id'], value: id },
          { name: ['questions', index, 'content'], value: content },
          { name: ['questions', index, 'question_type'], value: question_type },
          { name: ['questions', index, 'answers'], value: answers },
        ]);
      },
    };
  });

  const onFinish = (values: any) => {
    return values;
  };

  return (
    <>
      <Form
        name="dynamic_form_nest_item"
        className="w-full border "
        onFinish={onFinish}
        form={form}
        autoComplete="off"
      >
        <Form.List name="questions">
          {(fields, { add, remove }) => {
            if (categoryRef.current === null) {
              categoryRef.current = {
                add,
                remove,
                onFinish,
              };
            }
            return (
              <div ref={animateRef} className="">
                {fields.map((field, index) => (
                  <div
                    className="wrapper-border rounded-[10px] px-[13px] py-5 mt-3"
                    key={field.key}
                  >
                    <div className="col-span-12 flex gap-5 w-[97%]">
                      <p className="block_title block w-1/2">*Câu hỏi thứ {index + 1}</p>
                      <p className="block_title block w-1/2">{questionTypeTitle}</p>
                    </div>
                    <div key={field.key} className="grid grid-cols-2">
                      <Form.Item
                        className="hidden"
                        {...field}
                        name={[field.name, 'id']}
                        fieldKey={[field.key, 'id']}
                        rules={[
                          {
                            required: false,
                            message: 'Không được để trống trường này!',
                          },
                        ]}
                      >
                        <Input
                          size="large"
                          disabled
                          bordered={false}
                          placeholder="Nội dung"
                          className="rounded-[10px] !bg-white drop-shadow-[0_0px_7px_rgba(41,41,50,0.1)]"
                          allowClear
                        />
                      </Form.Item>
                      <Form.Item
                        className="w-full pr-5"
                        {...field}
                        name={[field.name, 'content']}
                        fieldKey={[field.key, 'content']}
                        rules={[
                          {
                            required: false,
                            message: 'Không được để trống trường này!',
                          },
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
                      <div className="flex flex-nowrap w-full">
                        <Form.Item
                          className="w-full "
                          {...field}
                          name={[field.name, 'question_type']}
                          fieldKey={[field.key, 'question_type']}
                          rules={[
                            {
                              required: false,
                              message: 'Không được để trống trường này!',
                            },
                          ]}
                        >
                          <Select
                            className="rounded-[10px] bg-white w-full flex overflow-hidden z-[1] drop-shadow-[0_0px_7px_rgba(41,41,50,0.1)] 'font-[400] text-sm text-[#696974]'"
                            size="large"
                            bordered={false}
                            placement="bottomLeft"
                            direction="rtl"
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
                            {mainFormOptions &&
                              mainFormOptions.map((item) => (
                                <Option key={item.key} value={item.value}>
                                  <span
                                    className={clsx('font-[400] text-sm text-[#696974]')}
                                  >
                                    {item.label}
                                  </span>
                                </Option>
                              ))}
                          </Select>
                        </Form.Item>
                        <Popconfirm
                          placement="leftTop"
                          title={
                            deletedMessage ?? 'Bạn có chắc chắn muốn xóa câu hỏi này?'
                          }
                          onConfirm={() => {
                            deletedQuestions.push(field.key);
                            console.log(field);
                            remove(field.name);
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
                    </div>
                    <div className="w-[full] flex flex-nowrap m-0 mt-5">
                      <p className="block_title block w-1/2">*Danh sách câu trả lời</p>
                      <p className="block_title block w-1/2 ml-[10px]">*Điểm</p>
                    </div>
                    <Form.List name={[field.name, 'answers']}>
                      {(answers, { add, remove }) => {
                        if (answerRef.current === null) {
                          answerRef.current = {
                            add,
                            remove,
                          };
                        }
                        if (answers.length > 0 && answerAnimationRef.current !== null) {
                          autoAnimate(answerAnimationRef.current);
                        }
                        return (
                          <div ref={answerAnimationRef} className="col-span-12">
                            {answers.map((answer, ansIndex) => (
                              <div key={answer.key} className="grid grid-cols-2 mt-3">
                                <Form.Item
                                  className="w-full pr-5"
                                  {...answer}
                                  initialValue=""
                                  name={[answer.name, 'content']}
                                  fieldKey={[answer.key, 'content']}
                                  rules={[
                                    {
                                      required: false,
                                      message: 'Không được để trống trường này!',
                                    },
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
                                <div className="flex flex-nowrap w-full">
                                  <Form.Item
                                    className="w-full "
                                    {...answer}
                                    name={[answer.name, 'point']}
                                    fieldKey={[answer.key, 'point']}
                                    rules={[
                                      {
                                        required: false,
                                        message: 'Không được để trống trường này!',
                                      },
                                    ]}
                                  >
                                    <Select
                                      className="rounded-[10px] bg-white w-full flex overflow-hidden z-[1] drop-shadow-[0_0px_7px_rgba(41,41,50,0.1)] font-[400] text-sm text-[#696974] "
                                      size="large"
                                      bordered={false}
                                      placement="bottomLeft"
                                      direction="rtl"
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
                                      {subFormOptions &&
                                        subFormOptions.map((item) => (
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
                                  </Form.Item>
                                  <div
                                    className="relative h-8 w-8 float-right ml-[10px] select-none"
                                    onClick={(event) => {
                                      remove(answer.name);
                                    }}
                                  >
                                    <Image
                                      layout="fill"
                                      objectFit="contain"
                                      src={SrcIcons.bin}
                                      alt="bin"
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}

                            <Row className="gap-[1rem] mt-3">
                              <Button
                                size="large"
                                className="rounded-[10px] w-fit bg-white flex items-center justify-center text-[var(--primary-color)] "
                                onClick={() => {
                                  add();
                                }}
                              >
                                <div className="relative h-5 w-5">
                                  <Image src={SrcIcons.plusActionIcon} layout="fill" />
                                </div>
                                <span className="text-sm text-[#403ECC] font-[600] tracking-[0.1px] leading-[21px]">
                                  Thêm câu trả lời
                                </span>
                              </Button>
                              <Button
                                size="large"
                                className="rounded-[10px] w-fit bg-white flex items-center justify-center text-[var(--primary-color)] "
                                onClick={debounce(() => {
                                  subFormOptions.forEach((item) => {
                                    add({
                                      content: item.value,
                                      point: item.value,
                                    });
                                  });
                                }, 300)}
                              >
                                <div className="relative h-5 w-5">
                                  <Image src={SrcIcons.plusActionIcon} layout="fill" />
                                </div>
                                <span className="text-sm text-[#403ECC] font-[600] tracking-[0.1px] leading-[21px]">
                                  Thêm nhanh câu trả lời
                                </span>
                              </Button>
                            </Row>
                          </div>
                        );
                      }}
                    </Form.List>
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
export default forwardRef(QuestionDynamicForm);
