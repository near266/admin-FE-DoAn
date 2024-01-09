import SrcIcons from '@/assets/icons';
import { CustomSelector } from '@/components/CustomSelector';
import DynamicForm from '@/components/DynamicForm';
import FileUploader from '@/components/FileUpload';
import IAssessment from '@/interfaces/models/IAssessment';
import IQuestion from '@/interfaces/models/IQuestion';
import { IServerResponse } from '@/interfaces/server/IServerResponse';
import {
  AssessmentSaleCode,
  AssessmentStatusCode,
  AssessmentTypeNumeric,
  SV_RES_STATUS_CODE,
} from '@/shared/enums/enums';
import { appLibrary } from '@/shared/utils/loading';
import { debounce } from '@mui/material';
import { Button, Form, Input, InputNumber, message, Row, UploadProps } from 'antd';
import type { UploadChangeParam } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';
import { useForm } from 'antd/lib/form/Form';
import { isNil } from 'lodash-es';
import Image from 'next/legacy/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import DynamicInputTextArea from '../../components/Dynamic_Input_TextArea';
import { EditorBlock } from '../../components/EditorBlock';
import QuestionDynamicForm from '../../components/QuestionDynamicForm';
import { assessmentService } from '../../shared/api';
import { CONFIRM_DELETE_MSG } from '../../shared/constance';
import { DYNAMIC_FIELD } from '../../shared/types';
import {
  goi_test,
  options,
  phan_loai,
  POINT,
  validateAssessmentPayload,
} from '../../shared/utils';
export interface IProps {
  assessment: IAssessment;
}

export function EditAssessmentModule(props: IProps) {
  const {
    assessment: {
      assessment_type: assessmentType,
      name,
      description,
      avatar,
      id,
      slug,
      questions,
      test_tutorial,
      sale_code,
      sale_price,
      content,
      test_time,
      original_price,
    },
  } = props;
  const [saleCode, setSaleCode] = useState<AssessmentSaleCode>(sale_code);
  const categoryRef = useRef(null);
  const questionDynamicFormRef = useRef(null);
  const answerRef = useRef(null);
  const thanhToRef = useRef(null);
  const testLevelRef = useRef(null);
  const [testLevels, setTestLevels] = useState<options[]>([]);
  const [questionTypes, setquestionTypes] = useState<options[]>([]);
  const [questionsArr, setQuestionsArr] = useState<IQuestion[]>(questions);
  const [isSSR, setIsSSR] = useState(true);
  const [form] = useForm();
  useEffect(() => {
    form.setFieldsValue({
      name,
      description,
      avatar,
      id,
      slug,
      questions,
      test_tutorial,
      assessment_type: assessmentType,
      sale_code,
      sale_price: saleCode === AssessmentSaleCode.FREE ? 0 : sale_price,
      content,
      test_time,
      original_price: saleCode === AssessmentSaleCode.FREE ? 0 : original_price,
    });
  }, [props]);
  const handleSelectSaleCode = (value: number) => {
    setSaleCode(value);
    if (value === AssessmentSaleCode.FREE) {
      form.setFieldsValue({
        sale_price: 0,
        original_price: 0,
      });
    }
  };
  const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
    const { file, fileList, event } = info;
  };
  const pushQuestionsToUI = useCallback(() => {
    questionsArr &&
      questionsArr.map((item) => {
        if (questionDynamicFormRef.current) {
          questionDynamicFormRef.current.add({
            id: item.id,
            content: item.content,
            question_type: item.question_type,
            // //delete answer id
            answers: item.answers.map((answer) => {
              return {
                content: answer.content,
                point: answer.point,
              };
            }),
          });
        }
      });
  }, [questionsArr]);

  useEffect(() => {
    if (assessmentType === AssessmentTypeNumeric.YOUR_SELF) {
      (async () => {
        const { payload } = await assessmentService.getQuestionTypesById(id);
        const newData = payload.map((item) => {
          return { key: item.id, label: item.name, value: item.id };
        });
        const isOldQuestionType =
          JSON.stringify(newData) == JSON.stringify(questionTypes);
        if (isOldQuestionType) return;
        setquestionTypes(newData);
        payload.map((item, index) => {
          categoryRef.current.add(
            {
              categoryId: item.id,
              categoryName: item.name,
              categoryContent: item.description,
            },
            index
          );
        });
        pushQuestionsToUI();
      })();
    }
    if (assessmentType === AssessmentTypeNumeric.CAREER) {
      (async () => {
        const { payload } = await assessmentService.getQuestionTypesById(id);
        const newData = payload.map((item) => {
          return { key: item.id, label: item.name, value: item.id };
        });
        const isOldQuestionType =
          JSON.stringify(newData) == JSON.stringify(questionTypes);
        if (isOldQuestionType) return;
        setquestionTypes(newData);

        pushQuestionsToUI();
      })();
    }
    if (assessmentType === AssessmentTypeNumeric.COMPETENCY) {
      (async () => {
        Promise.all([
          assessmentService.getTestLevels(id),
          assessmentService.getQuestionTypesById(id),
        ])
          .then(([newTestLevels, newQuestionTypes]) => {
            // update new test_levels
            const newTestLevelsData = newTestLevels.payload
              .sort((a, b) => {
                if (a.name < b.name) {
                  return -1;
                }
                if (a.name > b.name) {
                  return 1;
                }
                return 0;
              })
              .map((item) => {
                return { key: item.id, label: item.name, value: item.id };
              });
            const isOldTestLevel =
              JSON.stringify(newTestLevelsData) == JSON.stringify(testLevels);

            if (!isOldTestLevel) {
              setTestLevels(newTestLevelsData);
              newTestLevels.payload.map((item, index) => {
                testLevelRef.current.add(
                  {
                    id: item.id,
                    upper_bound: item.upper_bound,
                    name: item.name,
                    content: item.content,
                  },
                  index
                );
              });
            }

            // update new question_type
            const newQuestionTypesData = newQuestionTypes.payload.map((item) => {
              return { key: item.id, label: item.name, value: item.id };
            });
            const isOldQuestionType =
              JSON.stringify(newQuestionTypesData) == JSON.stringify(questionTypes);
            if (!isOldQuestionType) {
              setquestionTypes(newQuestionTypesData);
              // this for update dynamic form
              newQuestionTypes.payload.map((item, index) => {
                thanhToRef.current.add(
                  {
                    id: item.id,
                    name: item.name,
                  },
                  index
                );
              });
            }
            if (!(isOldQuestionType && isOldTestLevel)) {
              pushQuestionsToUI();
            }
          })
          .catch((err) => {
            message.error(err.message);
          })
          .finally(() => {
            setIsSSR(false);
          });
      })();
    }
  }, []);
  useEffect(() => {
    setIsSSR(false);
  }, []);
  const handleCategoryChange = (value) => {};
  const handleCategorySubmit = debounce((event) => {}, 600);
  const handleDeleteCategory = async (field: DYNAMIC_FIELD, deletedData?: any) => {
    console.log(field);
  };
  const handleDeleteThanhTo = async (field: DYNAMIC_FIELD, deletedData?: any) => {
    deletedData.id
      ? onDeleteThanhTo(deletedData.id).then((res) => {
          if (res?.code === SV_RES_STATUS_CODE.success) {
            thanhToRef.current.remove(field.name);
            setquestionTypes((pre) => pre.filter((item) => item.key !== deletedData.id));
            return message.success('Đã xóa thành tố');
          } else {
            message.error(res?.error ?? 'Xóa thành tố thất bại!');
          }
        })
      : thanhToRef.current.remove(field.name);
  };

  const onSaveCategoryAst1 = async () => {
    if (!categoryRef.current) return message.error('Đã có lỗi xảy ra!');

    // nên tách ra nhiều hàm nhưng mà vội + mệt. Nếu tách ra nhiều hàm thì file sẽ nhiều hàm => tracking logic cũng khó.
    // lấy ra những phần tử đã bị xóa
    const deletedCategories = Array.from<{
      categoryId: string;
      categoryName: string;
      categoryContent: string;
    }>(categoryRef.current.getDeleted())
      .filter((item) => item.categoryId)
      .map((item) => item.categoryId);

    // lấy ra các phần tử đang có trong form
    const { categories } = categoryRef.current.submit();
    // validate form
    for (let i = 0; i < categories.length; i++) {
      if (!categories[i])
        return message.error(`Vui lòng nhập nội dung các nhóm của mục ${i + 1}!`);
      if (!categories[i].categoryName)
        return message.error(`Vui lòng nhập tên mục ${i + 1} !`);
      if (!categories[i].categoryContent)
        return message.error(`Vui lòng nhập nội dung nhóm mục ${i + 1}!`);
    }
    try {
      // format payload trước khi gửi lên
      const payloadCate = categories.map((item) => {
        return {
          id: item.categoryId,
          name: item.categoryName,
          description: item.categoryContent,
        };
      });
      // gửi lên server
      appLibrary.showloading();
      const res = await assessmentService.updateQuestionTypes({
        assessment_id: id,
        question_types: payloadCate,
        deleted: deletedCategories,
      });
      // nếu thành công thì cập nhật lại state
      if (res.code === SV_RES_STATUS_CODE.success) {
        setquestionTypes(
          res.payload.map((item) => {
            return { key: item.id, label: item.name, value: item.id };
          })
        );
        res.payload.map((item, index) => {
          categoryRef.current.update(
            {
              id: item.id,
              name: item.name,
              value: item.description,
            },
            index
          );
        });
        appLibrary.hideloading();
        message.success('Cập nhật thành công!');
      }
    } catch (error) {
      appLibrary.hideloading();
      message.error(error.response.data.error ?? 'Cập nhật thất bại!');
    }
  };
  const onSaveTestLevel = async () => {
    if (!testLevelRef.current) return message.error('Đã có lỗi xảy ra!');

    // lấy ra những phần tử đã bị xóa
    const deletedTestLevels = testLevelRef.current
      .getDeleted()
      .map((item) => {
        if (testLevels[item] !== undefined && !isNil(testLevels[item])) {
          return testLevels[item].key;
        }
      })
      .filter((item) => item !== undefined && !isNil(item));
    // lấy ra tất cả những phần từ đã có trong mảng
    const { test_levels } = testLevelRef.current.submit();
    // validate form
    for (let i = 0; i < test_levels.length; i++) {
      if (!test_levels[i])
        return message.error(
          `Vui lòng nhập nội dung các nhóm của mức trong mục ${i + 1}!`
        );
      if (!test_levels[i].name)
        return message.error(`Vui lòng nhập tên của mức trong mục ${i + 1} !`);
      if (!test_levels[i].content)
        return message.error(`Vui lòng nhập nội dung nhóm của mức trong mục ${i + 1}!`);
    }

    try {
      // gửi lên server
      const res = await assessmentService.updateTestLevels({
        assessment_id: id,
        test_levels: test_levels,
        deleted: deletedTestLevels,
      });

      if (res.code === SV_RES_STATUS_CODE.success) {
        message.success('Cập nhật thành công!');
        // update lại id của các bài test trên UI để lần sai update bài test sẽ có id
        setTestLevels(
          res.payload.map((item) => {
            return { key: item.id, label: item.name, value: item.id };
          })
        );
      }
    } catch (error) {
      message.error('Cập nhật thất bại!');
    }
  };
  const onSaveThanhTo = async () => {
    if (!thanhToRef.current) return message.error('Đã có lỗi xảy ra!');
    // lấy ra những phần tử đã bị xóa
    const deletedThanhTo = Array.from<{
      name: string;
      id: string;
    }>(thanhToRef.current.getDeleted())
      .filter((item) => item.id)
      .map((item) => item.id);
    // lấy ra tất cả những phần từ đã có trong mảng
    const { thanhTo } = thanhToRef.current.submit();
    // validate form
    for (let i = 0; i < thanhTo.length; i++) {
      if (!thanhTo[i].name)
        return message.error(`Vui lòng nhập tên của thành tố ${i + 1} !`);
    }

    try {
      appLibrary.showloading();
      // gửi lên server
      const res = await assessmentService.updateQuestionTypes({
        assessment_id: id,
        question_types: thanhTo,
        deleted: deletedThanhTo,
      });
      if (res.code === SV_RES_STATUS_CODE.success) {
        // update lại id của các thành tố trên UI để lần sai update thành tố sẽ có id
        const newData = res.payload.map((item) => {
          return { key: item.id, label: item.name, value: item.id };
        });
        res.payload.map((item, index) =>
          thanhToRef.current.update({ id: item.id, name: item.name }, index)
        );
        setquestionTypes(newData);
        message.success('Cập nhật thành công!');
      }
      appLibrary.hideloading();
    } catch (error) {
      appLibrary.hideloading();
      message.error(error.response.data.error ?? 'Cập nhật thất bại!');
    }
  };
  const onSaveQuestions = async () => {
    // lấy ra các câu hỏi đã bị xóa và lọc các phần tử null và undefined
    const deletedQuestions = questionDynamicFormRef.current
      .getRemovedQuestions()
      .map((item) => {
        if (questionsArr[item] !== undefined && !isNil(questionsArr[item])) {
          return questionsArr[item].id;
        }
      })
      .filter((item) => item !== undefined && !isNil(item));
    // lấy ra các câu hỏi đang có trong form
    const updatedQuestions = questionDynamicFormRef.current.submit();
    // validate form
    for (let i = 0; i < updatedQuestions.questions.length; i++) {
      if (!updatedQuestions.questions[i])
        return message.error(`Vui lòng nhập nội dung câu hỏi ${i + 1}!`);
      if (!updatedQuestions.questions[i].content)
        return message.error(`Vui lòng nhập nội dung câu hỏi ${i + 1}!`);
      if (!updatedQuestions.questions[i].question_type)
        return message.error(`Vui lòng chọn loại câu hỏi ${i + 1}!`);
      if (!updatedQuestions.questions[i].answers)
        return message.error(`Vui lòng thêm câu trả lời cho câu hỏi số ${i + 1}!`);
      for (let j = 0; j < updatedQuestions.questions[i].answers.length; j++) {
        if (!updatedQuestions.questions[i].answers[j])
          return message.error(`Vui lòng nhập nội dung câu trả lời số ${i + 1}!`);
        if (!updatedQuestions.questions[i].answers[j].content)
          return message.error(`Vui lòng nhập nội dung câu trả lời số ${i + 1}!`);
        if (!updatedQuestions.questions[i].answers[j].point)
          return message.error(`Vui lòng nhập điểm câu trả lời số ${i + 1}!`);
      }
    }
    try {
      appLibrary.showloading();
      // gửi lên server
      const {
        payload: { questions: questionsRes },
      } = await assessmentService.updateAssessmentQuestions({
        ...updatedQuestions,
        deleted: deletedQuestions,
      });
      questionsRes.map((item, index) =>
        questionDynamicFormRef.current.update(item, index)
      );

      setQuestionsArr(questionsRes);
      appLibrary.hideloading();
      message.success('Cập nhật câu hỏi thành công!');
    } catch (error) {
      appLibrary.hideloading();
      message.error('Cập nhật câu hỏi thất bại!');
    }
  };
  const onFinishFailed = (errorInfo: any) => {};
  const onFinish = async (values) => {
    const formData = new FormData();

    if (validateAssessmentPayload(values)) {
      try {
        formData.append('avatar', values.avatar.file?.originFileObj ?? values.avatar);
        formData.append('name', values.name);
        formData.append('assessment_type', values.assessment_type);
        formData.append('content', values.content);
        formData.append('description', values.description);
        formData.append('test_tutorial', values.test_tutorial);
        formData.append('sale_code', saleCode?.toString());
        formData.append('test_time', values.test_time);
        formData.append(
          'original_price',
          saleCode === AssessmentSaleCode.FREE ? 0 : values.original_price
        );
        formData.append(
          'sale_price',
          saleCode === AssessmentSaleCode.FREE ? 0 : values.sale_price
        );
        formData.append('status', AssessmentStatusCode.DRAFT.toString());
        appLibrary.showloading();
        const res: IServerResponse = await assessmentService.updateNewAssessment(
          id,
          formData
        );
        appLibrary.hideloading();
        if (res.code === SV_RES_STATUS_CODE.success) {
          form.setFieldsValue({
            avatar: res.payload.avatar,
          });
          return message.success('Cập nhật thành công');
        }
        return message.error('Cập nhật thất bại');
      } catch (error) {
        appLibrary.hideloading();
        return message.error('Cập nhật thất bại');
      }
    }
  };
  const onDeleteCategory = async (id: string) => {};
  const onDeleteThanhTo = async (id: string) => {
    let response = null;
    try {
      appLibrary.showloading();
      const res = await assessmentService.deleteQuestionType(id);
      response = res;
      appLibrary.hideloading();
    } catch (error) {
      response = error.response.data;
      console.log(error.response.data);
      appLibrary.hideloading();
    }
    return response;
  };

  return (
    <>
      {!isSSR && (
        <Form
          form={form}
          autoComplete="off"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <div className="create-assessment">
            <div className="title text-title font-title tw-text-[20px]">
              {assessmentType === AssessmentTypeNumeric.YOUR_SELF
                ? 'Thêm mới bài hiểu mình'
                : assessmentType === AssessmentTypeNumeric.CAREER
                ? 'Thêm mới bài hiểu nghề'
                : 'Thêm mới bài đánh giá năng lực'}
            </div>
            <div className="flex flex-row gap-[1rem] justify-between">
              <div className="flex mb-[1rem] gap-3 w-full flex-col ">
                <p className="block_title">*Tên</p>
                <Form.Item name="name">
                  <Input
                    size="large"
                    bordered={false}
                    placeholder="Nhập tên bài đánh giá"
                    className="rounded-[10px] !bg-white"
                    allowClear
                  />
                </Form.Item>
              </div>
              <div className="min-w-[230px]">
                <Form.Item
                  name="assessment_type"
                  initialValue={
                    phan_loai[assessmentType - 1]?.value ?? phan_loai[0].value
                  }
                >
                  <CustomSelector
                    options={phan_loai}
                    title="Phân loại"
                    required
                    disabled
                    initialValue={assessmentType}
                    onChange={(value) => {
                      form.setFieldsValue({
                        assessment_type: value,
                      });
                    }}
                  />
                </Form.Item>
              </div>
            </div>

            <div className="mt-3">
              <Form.Item name="content">
                <EditorBlock
                  onChange={(data) => {}}
                  title="Mô tả"
                  required
                  defaultValue={content}
                />
              </Form.Item>
            </div>
            <div className="mt-3">
              <Form.Item name="description">
                <EditorBlock
                  onChange={() => {}}
                  title="Mô tả chi tiết"
                  required
                  defaultValue={description}
                />
              </Form.Item>
            </div>
            <div className="mt-3">
              <Form.Item name="test_tutorial">
                <EditorBlock
                  onChange={() => {}}
                  title="Hướng dẫn làm bài test"
                  required
                  defaultValue={test_tutorial}
                />
              </Form.Item>
            </div>

            <div className="w-full flex gap-[1rem] flex-wrap mt-[1.5rem] justify-between">
              <div className="min-w-[230px]">
                <Form.Item name="sale_code" initialValue={saleCode}>
                  <CustomSelector
                    options={goi_test}
                    title="Gói test"
                    required
                    initialValue={saleCode}
                    onChange={handleSelectSaleCode}
                  />
                </Form.Item>
              </div>

              <div className="flex mb-[1rem] gap-3 flex-col w-fit flex-nowrap">
                <p className="whitespace-nowrap block_title">
                  *Thời gian ước tính làm test
                </p>
                <Form.Item name="test_time">
                  <InputNumber
                    bordered={false}
                    size="large"
                    placeholder="phút"
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    }
                    parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                    className="rounded-[10px] w-full !bg-white drop-shadow-[0_0px_7px_rgba(41,41,50,0.1)]"
                  />
                </Form.Item>
              </div>
              <div className="flex mb-[1rem] gap-3 flex-col w-fit flex-nowrap">
                <p className="block_title">*Giá tiền (VND)</p>
                <Form.Item name="original_price">
                  <InputNumber
                    size="large"
                    disabled={saleCode === AssessmentSaleCode.FREE}
                    bordered={false}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    }
                    parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                    placeholder="VND"
                    className="w-full overflow-hidden rounded-[10px] !bg-white drop-shadow-[0_0px_7px_rgba(41,41,50,0.1)]"
                  />
                </Form.Item>
              </div>
              <div className="flex mb-[1rem] gap-3 flex-col w-fit flex-nowrap">
                <p className="block_title">Giá bán</p>
                <Form.Item name="sale_price">
                  <InputNumber
                    size="large"
                    disabled={saleCode === AssessmentSaleCode.FREE}
                    bordered={false}
                    placeholder="VND"
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    }
                    parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                    className="w-full overflow-hidden rounded-[10px] !bg-white drop-shadow-[0_0px_7px_rgba(41,41,50,0.1)]"
                  />
                </Form.Item>
              </div>
              <div className="flex mb-[1rem] gap-3 flex-col w-fit flex-nowrap">
                <p className="block_title">*Ảnh thumbnail</p>

                <Form.Item name="avatar">
                  <FileUploader
                    onChange={handleChange}
                    {...(avatar && { defaultImage: avatar })}
                  />
                </Form.Item>
              </div>
            </div>

            <div className="container !my-10 ">
              <Button
                className="custom-button"
                onClick={debounce(() => {
                  form.submit();
                }, 500)}
              >
                Lưu
              </Button>
            </div>
            {/* hieu minh start */}

            {assessmentType === AssessmentTypeNumeric.YOUR_SELF && (
              <div className="hieu-minh">
                <p className="block_title">*Chỉnh sửa các nhóm</p>
                <Row className="gap-[1rem]">
                  <Button
                    size="large"
                    className="rounded-[10px] bg-white flex items-center justify-center text-[var(--primary-color)] "
                    onClick={() => {
                      categoryRef.current.add({}, 0);
                    }}
                  >
                    <div className="relative h-5 w-5">
                      <Image src={SrcIcons.plusActionIcon} layout="fill" />
                    </div>
                    <span className="text-sm text-[#403ECC] font-[600] tracking-[0.1px] leading-[21px]">
                      Thêm dòng mới
                    </span>
                  </Button>
                  <Button
                    size="large"
                    className="rounded-[10px] bg-white flex items-center justify-center text-[var(--primary-color)] "
                    onClick={onSaveCategoryAst1}
                  >
                    <div className="relative h-5 w-5">
                      <Image src={SrcIcons.bookmarkBlue} layout="fill" />
                    </div>
                    <span className="text-sm text-[#403ECC] font-[600] tracking-[0.1px] leading-[21px]">
                      Lưu tất cả
                    </span>
                  </Button>
                </Row>
                <div className="flex flex-col mt-3 justify-between items-start">
                  <div className="w-full flex flex-row mt-1 gap-5 ">
                    <DynamicInputTextArea
                      formName="categories"
                      idField="categoryId"
                      nameField="categoryName"
                      valueField="categoryContent"
                      ref={categoryRef}
                      options={questionTypes}
                      isInput
                      reloadAfterDelete
                      deletedMessage={CONFIRM_DELETE_MSG}
                      titleLeft={'*Tên nhóm'}
                      titleRight={'*Nội dung nhóm'}
                      onChange={handleCategoryChange}
                      onSubmit={handleCategorySubmit}
                      onDelete={handleDeleteCategory}
                    />
                  </div>
                </div>
                <div className="divider mt-5"></div>

                <p className="block_title mt-5">*Chỉnh sửa câu hỏi</p>
                <div className="w-full flex flex-row mt-1 gap-5">
                  <QuestionDynamicForm
                    assessmentId={id}
                    ref={questionDynamicFormRef}
                    answerRef={answerRef}
                    mainFormOptions={questionTypes}
                    subFormOptions={POINT}
                  />
                </div>
                <Row className="gap-[1rem]">
                  <Button
                    size="large"
                    className="rounded-[10px] bg-white flex items-center justify-center text-[var(--primary-color)] "
                    onClick={() => {
                      questionDynamicFormRef.current.add({});
                    }}
                  >
                    <div className="relative h-5 w-5">
                      <Image src={SrcIcons.plusActionIcon} layout="fill" />
                    </div>
                    <span className="text-sm text-[#403ECC] font-[600] tracking-[0.1px] leading-[21px]">
                      Thêm câu hỏi mới
                    </span>
                  </Button>
                  <Button
                    size="large"
                    className="rounded-[10px] bg-white flex items-center justify-center text-[var(--primary-color)] "
                    onClick={onSaveQuestions}
                  >
                    <div className="relative h-5 w-5">
                      <Image src={SrcIcons.bookmarkBlue} layout="fill" />
                    </div>
                    <span className="text-sm text-[#403ECC] font-[600] tracking-[0.1px] leading-[21px]">
                      Lưu tất cả
                    </span>
                  </Button>
                </Row>
              </div>
            )}
            {/* hieu minh end */}

            {/* hieu nghe start */}
            <div className="divider mt-5"></div>
            {assessmentType === AssessmentTypeNumeric.CAREER && (
              <div className="hieu-nghe">
                <p className="block_title">*Các mức</p>
                <div className="flex flex-col mt-3 justify-between items-start  border border-solid wrapper-border w-1/2">
                  <CustomSelector
                    options={questionTypes}
                    title="Tên nhóm"
                    required
                    onChange={handleCategoryChange}
                  />
                </div>
                <div className="divider mt-5"></div>
                <p className="block_title">*Chỉnh sửa câu hỏi</p>
                <div className="w-full flex flex-row mt-1 gap-5">
                  <QuestionDynamicForm
                    assessmentId={id}
                    ref={questionDynamicFormRef}
                    answerRef={answerRef}
                    mainFormOptions={questionTypes}
                    subFormOptions={POINT}
                  />
                </div>
                <Row className="gap-[1rem] mt-5">
                  <Button
                    size="large"
                    className="rounded-[10px] bg-white flex items-center justify-center text-[var(--primary-color)] "
                    onClick={() => {
                      questionDynamicFormRef.current.add({});
                    }}
                  >
                    <div className="relative h-5 w-5">
                      <Image src={SrcIcons.plusActionIcon} layout="fill" />
                    </div>
                    <span className="text-sm text-[#403ECC] font-[600] tracking-[0.1px] leading-[21px]">
                      Thêm câu hỏi mới
                    </span>
                  </Button>
                  <Button
                    size="large"
                    className="rounded-[10px] bg-white flex items-center justify-center text-[var(--primary-color)] "
                    onClick={onSaveQuestions}
                  >
                    <div className="relative h-5 w-5">
                      <Image src={SrcIcons.bookmarkBlue} layout="fill" />
                    </div>
                    <span className="text-sm text-[#403ECC] font-[600] tracking-[0.1px] leading-[21px]">
                      Lưu tất cả
                    </span>
                  </Button>
                </Row>
              </div>
            )}
            {/* hieu nghe end */}

            {/* danh gia nang luc start */}
            <div className="divider mt-5"></div>

            {assessmentType === AssessmentTypeNumeric.COMPETENCY && (
              <div className="danh-gia-nang-luc">
                <p className="block_title">*Chỉnh sửa các thành tố</p>
                <Row className="gap-[1rem]">
                  <Button
                    size="large"
                    className="rounded-[10px] bg-white flex items-center justify-center text-[var(--primary-color)] "
                    onClick={() => {
                      thanhToRef.current.add({}, 0);
                    }}
                  >
                    <div className="relative h-5 w-5">
                      <Image src={SrcIcons.plusActionIcon} layout="fill" />
                    </div>
                    <span className="text-sm text-[#403ECC] font-[600] tracking-[0.1px] leading-[21px]">
                      Thêm dòng mới
                    </span>
                  </Button>
                  <Button
                    size="large"
                    className="rounded-[10px] bg-white flex items-center justify-center text-[var(--primary-color)] "
                    onClick={onSaveThanhTo}
                  >
                    <div className="relative h-5 w-5">
                      <Image src={SrcIcons.bookmarkBlue} layout="fill" />
                    </div>
                    <span className="text-sm text-[#403ECC] font-[600] tracking-[0.1px] leading-[21px]">
                      Lưu tất cả
                    </span>
                  </Button>
                </Row>
                <div className="flex flex-col mt-3 justify-between items-start  border border-solid wrapper-border w-1/2">
                  <p className="block_title">*Tên thành tố</p>
                  <DynamicForm
                    formName="thanhTo"
                    idField="id"
                    nameField="name"
                    ref={thanhToRef}
                    reloadAfterDelete
                    deletedMessage={CONFIRM_DELETE_MSG}
                    options={[]}
                    onChange={handleCategoryChange}
                    onSubmit={handleCategorySubmit}
                    onDelete={(field: DYNAMIC_FIELD, deletedData) => {
                      handleDeleteThanhTo(field, deletedData);
                    }}
                    wraperClassName="!border-none !p-0 !m-0"
                  />
                </div>
                <p className="block_title mt-5">*Chỉnh sửa câu hỏi</p>
                <div className="w-full flex flex-row mt-1 gap-5">
                  <QuestionDynamicForm
                    assessmentId={id}
                    ref={questionDynamicFormRef}
                    answerRef={answerRef}
                    mainFormOptions={questionTypes}
                    subFormOptions={POINT}
                    questionTypeTitle="*Thành tố"
                  />
                </div>
                <Row className="gap-[1rem] mt-5">
                  <Button
                    size="large"
                    className="rounded-[10px] bg-white flex items-center justify-center text-[var(--primary-color)] "
                    onClick={() => {
                      questionDynamicFormRef.current.add({});
                    }}
                  >
                    <div className="relative h-5 w-5">
                      <Image src={SrcIcons.plusActionIcon} layout="fill" />
                    </div>
                    <span className="text-sm text-[#403ECC] font-[600] tracking-[0.1px] leading-[21px]">
                      Thêm câu hỏi mới
                    </span>
                  </Button>
                  <Button
                    size="large"
                    className="rounded-[10px] bg-white flex items-center justify-center text-[var(--primary-color)] "
                    onClick={onSaveQuestions}
                  >
                    <div className="relative h-5 w-5">
                      <Image src={SrcIcons.bookmarkBlue} layout="fill" />
                    </div>
                    <span className="text-sm text-[#403ECC] font-[600] tracking-[0.1px] leading-[21px]">
                      Lưu tất cả
                    </span>
                  </Button>
                </Row>
                <div className="divider mt-5"></div>
                <p className="block_title">*Chỉnh sửa các mức</p>
                <Row className="gap-[1rem]">
                  {/* <Button
                  size="large"
                  className="rounded-[10px] bg-white flex items-center justify-center text-[var(--primary-color)] "
                  onClick={() => {
                    testLevelRef.current.add();
                  }}
                >
                  <div className="relative h-5 w-5">
                    <Image src={SrcIcons.plusActionIcon} layout="fill" />
                  </div>
                  <span className="text-sm text-[#403ECC] font-[600] tracking-[0.1px] leading-[21px]">
                    Thêm dòng mới
                  </span>
                </Button> */}
                  <Button
                    size="large"
                    className="rounded-[10px] bg-white flex items-center justify-center text-[var(--primary-color)] "
                    onClick={onSaveTestLevel}
                  >
                    <div className="relative h-5 w-5">
                      <Image src={SrcIcons.bookmarkBlue} layout="fill" />
                    </div>
                    <span className="text-sm text-[#403ECC] font-[600] tracking-[0.1px] leading-[21px]">
                      Lưu tất cả
                    </span>
                  </Button>
                </Row>
                <div className="divider mt-5"></div>

                <DynamicInputTextArea
                  formName="test_levels"
                  idField="upper_bound"
                  nameField="name"
                  valueField="content"
                  // disabledSelect
                  ref={testLevelRef}
                  options={testLevels}
                  titleLeft={'*Mức'}
                  titleRight={'*Nội dung của mức'}
                  onChange={handleCategoryChange}
                  onSubmit={handleCategorySubmit}
                  onDelete={handleDeleteCategory}
                />
              </div>
            )}
            {/* danh gia nang luc end */}
          </div>
        </Form>
      )}
    </>
  );
}
