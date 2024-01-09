import { CustomSelector } from '@/components/CustomSelector';
import CustomPieChart from '@/components/PieChart';
import VariantChart from '@/components/RadarChart';
import SelectSearch from '@/components/SelectSearch';
import { IUser } from '@/interfaces/models/IUser';
import { mentorServices } from '@/modules/ManageMentor/shared/api';
import { AssessmentType, SV_RES_STATUS_CODE } from '@/shared/enums/enums';
import { appLibrary } from '@/shared/utils/loading';
import { debounce } from '@mui/material';
import { Button, Collapse, Form, message, Skeleton } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import TextArea from 'antd/lib/input/TextArea';
import clsx from 'clsx';
import { isString } from 'lodash-es';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { careerService } from '../../../ManageCareers/shared/api';
import Dynamic_Input_TextArea from '../../components/Dynamic_Input_TextArea';
import { EditorBlock } from '../../components/EditorBlock';
import { UserAssessmentInfo } from '../../components/UserAssessmentInfo';
import { assessmentService } from '../../shared/api';
import { PayloadAssessment } from '../../shared/utils';
import styles from './styles.module.scss';
const { Panel } = Collapse;
type Props = {
  assessment: any;
  chartData: any;
  userInfo: IUser;
  // chartData: number | IChartData;
  suggestion: any;
};

export default function CreateSugesstionModule({
  assessment,
  chartData,
  suggestion,
  userInfo,
}: Props) {
  const router = useRouter();
  const [formYourSelf] = useForm();
  const [formCareer] = useForm();
  const [formCompetency] = useForm();
  const mentorsRef = useRef<any>(null);
  const { assessmentType, content, id, name, slug, avatar, description } =
    assessment || {};
  const [editorDefaultValues, setEditorDefaultValues] = useState<any>({
    you_are: '',
    you_strong: '',
    you_weak: '',
    you_like: '',
    suggest_improve: '',
    need_improve: '',
    recommend: '',
  });
  const {
    textContent = [],
    general = { data: { selected_career: {} } },
    specific = [],
  } = suggestion;

  const onFinish = async (values: PayloadAssessment) => {
    const formData = new FormData();
  };

  const onFinishFailed = (errorInfo: any) => {};
  const [career, setCareer] = useState([]);
  useEffect(() => {
    if (assessmentType === AssessmentType.YOUR_SELF) {
      const formYourSelfContents = textContent.filter(
        (item) => isString(item.subData) && item.subData.length > 0
      );

      formYourSelfContents.forEach((item) => {
        formYourSelf.setFieldsValue({
          [item.subData]: item.description,
        });
      });
      // shitty code
      setEditorDefaultValues({
        you_are: formYourSelfContents.find((item) => item.subData === 'you_are')
          ?.description,
        you_strong: formYourSelfContents.find((item) => item.subData === 'you_strong')
          ?.description,
        you_weak: formYourSelfContents.find((item) => item.subData === 'you_weak')
          ?.description,
        you_like: formYourSelfContents.find((item) => item.subData === 'you_like')
          ?.description,
        suggest_improve: formYourSelfContents.find(
          (item) => item.subData === 'suggest_improve'
        )?.description,
      });
    }
    if (assessmentType === AssessmentType.CAREER) {
      (async () => {
        try {
          const { code, payload } = await careerService.getAllCareers();
          if (code === SV_RES_STATUS_CODE.success) {
            const { data } = payload;
            const careerData = data
              .map((item) => {
                if (item.active) {
                  return {
                    key: item.field_id,
                    label: item.name,
                    value: item.id,
                  };
                }
              })
              .filter((item) => item);
            setCareer(careerData);
          }
        } catch (error) {
          message.error('Lấy dữ liệu nghề thất bại! Hãy tải lại trang');
        }
      })();
      const { selected_career: formCareerGeneralValues } = general;
      formCareerGeneralValues &&
        Object.keys(formCareerGeneralValues).forEach((key) => {
          formCareer.setFields([
            { name: ['general', key], value: formCareerGeneralValues[key] },
          ]);
        });
      specific.forEach((item, index) => {
        formCareer.setFields([{ name: ['specific', item.subdata], value: item.content }]);
      });

      setEditorDefaultValues({
        you_strong: specific.find((item) => item.subdata === 'you_strong')?.content,
        need_improve: specific.find((item) => item.subdata === 'need_improve')?.content,
        recommend: specific.find((item) => item.subdata === 'recommend')?.content,
      });
    }

    if (assessmentType === AssessmentType.COMPETENCY) {
      const formCompetencyContents = textContent.filter(
        (item) => isString(item.subData) && item.subData.length > 0
      );
      formCompetencyContents.forEach((item) => {
        formCompetency.setFieldsValue({
          [item.subData]: item.description,
        });
      });
      // shitty code
      setEditorDefaultValues({
        test_mean: formCompetencyContents.find((item) => item.subData === 'test_mean')
          ?.description,
        you_strong: formCompetencyContents.find((item) => item.subData === 'you_strong')
          ?.description,
        need_improve: formCompetencyContents.find(
          (item) => item.subData === 'need_improve'
        )?.description,
        environment: formCompetencyContents.find((item) => item.subData === 'environment')
          ?.description,
      });
    }

    // form.setFieldsValue({});
  }, [assessmentType]);

  const getCareerInfo = async (id: string) => {
    try {
      appLibrary.showloading();
      const { code, payload } = await careerService.getCareer(id);
      if (code === SV_RES_STATUS_CODE.success) {
        Object.keys(formCareer.getFieldsValue().general).forEach((key) => {
          formCareer.setFields([{ name: ['general', key], value: payload[key] }]);
        });
      }
      appLibrary.hideloading();
    } catch (error) {
      console.log(error);
      appLibrary.hideloading();
      message.error('Lấy dữ liệu nghề thất bại! Hãy tải lại trang');
    }
    const careerInfo = career.find((item) => item.key === id);
    return careerInfo?.label;
  };

  const updateSuggestion = async (params: any) => {
    try {
      appLibrary.showloading();
      const { code, payload } = await assessmentService.updateSuggestion(params);
      if (code === SV_RES_STATUS_CODE.success) {
        message.success('Cập nhật thành công!');
      }
      appLibrary.hideloading();
    } catch (error) {
      appLibrary.hideloading();
      message.error('Cập nhật thất bại! Hãy tải lại trang');
    }
  };
  const onSubmit = () => {
    const { test_result_id } = router.query;
    // done this
    if (assessmentType === AssessmentType.YOUR_SELF) {
      const { suggest_improve, you_are, you_like, you_strong, you_weak } =
        formYourSelf.getFieldsValue();
      const info = [
        {
          label: 'Bạn là',
          content: you_are,
          subdata: 'you_are',
        },
        {
          label: 'Bạn giỏi',
          content: you_like,
          subdata: 'you_like',
        },
        {
          label: 'Bạn thích',
          content: you_strong,
          subdata: 'you_strong',
        },
        {
          label: 'Bạn yếu',
          content: you_weak,
          subdata: 'you_weak',
        },
        {
          label: 'Khuyến nghị phát triển',
          content: suggest_improve,
          subdata: 'suggest_improve',
        },
      ];
      const suggestion = {
        careers: [],
        mentors: [],
      };

      updateSuggestion({
        test_result_id,
        content: { info, suggestion },
      });
    }
    // done this
    if (assessmentType === AssessmentType.CAREER) {
      const { general, specific } = formCareer.getFieldsValue();
      const info = {
        general: {
          data: {
            selected_career: {
              ...general,
            },
          },
        },
        specific: {
          data: [
            {
              label: 'Bạn mạnh',
              content: specific.you_strong,
              subdata: 'you_strong',
            },
            {
              label: 'Cần cải thiện',
              content: specific.need_improve,
              subdata: 'need_improve',
            },
            {
              label: 'Khuyến nghị',
              content: specific.recommend,
              subdata: 'recommend',
            },
          ],
        },
      };

      updateSuggestion({
        test_result_id,
        content: { info, suggestion },
      });
    }
    if (assessmentType === AssessmentType.COMPETENCY) {
      const info = [
        {
          label: 'Bạn ở mức này có nghĩa',
          content: formCompetency.getFieldValue('test_mean'),
          subdata: 'test_mean',
        },
        {
          label: 'Bạn mạnh',
          content: formCompetency.getFieldValue('you_strong'),
          subdata: 'you_strong',
        },
        {
          label: 'Cần cải thiện',
          content: formCompetency.getFieldValue('need_improve'),
          subdata: 'need_improve',
        },
        {
          label: 'Môi trường',
          content: formCompetency.getFieldValue('environment'),
          subdata: 'environment',
        },
      ];
      const suggestion = {
        careers: [],
        mentors: [],
      };
      updateSuggestion({
        test_result_id,
        content: { info, suggestion },
      });
    }
  };

  const searchFetcher = (search: string): Promise<any[]> => {
    return;
  };
  return (
    <>
      {/* user assessment infor section */}
      <UserAssessmentInfo assessmentInfo={assessment} userInfo={userInfo} />
      {/* chartData section */}
      <div className="chart_data_section my-4">
        <div className=" flex items-center justify-center bg-white rounded-[10px] sm:rounded-[20px] overflow-hidden ">
          {assessmentType === AssessmentType.CAREER && (
            <CustomPieChart chartData={chartData} />
          )}
          {(assessmentType === AssessmentType.YOUR_SELF ||
            assessmentType === AssessmentType.COMPETENCY) && (
            <VariantChart chartData={chartData} />
          )}
        </div>
      </div>
      {/*  suggestion section */}
      <div className="suggestion_section">
        {/* title start */}
        {assessmentType === AssessmentType.CAREER && (
          <p className="font-title text-title leading--title">Hiểu nghề</p>
        )}
        {assessmentType === AssessmentType.YOUR_SELF && (
          <p className="font-title text-title leading--title">Hiểu mình</p>
        )}
        {assessmentType === AssessmentType.COMPETENCY && (
          <p className="font-title text-title leading--title">Năng lực</p>
        )}
        {/* title end */}

        {/* suggestion for AssessmentType.YOUR_SELF */}
        {assessmentType === AssessmentType.YOUR_SELF && (
          <div className="wrapper-border-gray">
            <Form
              form={formYourSelf}
              autoComplete="off"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
            >
              <div className="flex flex-col gap-[1rem] justify-between">
                {/* Bạn là  */}
                <div className="mt-3">
                  <Form.Item name="you_are">
                    <EditorBlock
                      defaultValue={editorDefaultValues?.you_are}
                      onChange={(data) => {}}
                      title="Bạn là"
                      required
                    />
                  </Form.Item>
                </div>

                {/* Bạn mạnh  */}
                <div className="mt-3">
                  <Form.Item name="you_strong">
                    <EditorBlock
                      defaultValue={editorDefaultValues?.you_strong}
                      onChange={(data) => {}}
                      title="Bạn mạnh"
                      required
                    />
                  </Form.Item>
                </div>
                {/* Bạn yếu  */}
                <div className="mt-3">
                  <Form.Item name="you_weak">
                    <EditorBlock
                      defaultValue={editorDefaultValues?.you_weak}
                      onChange={(data) => {}}
                      title="Bạn yếu"
                      required
                    />
                  </Form.Item>
                </div>

                {/* Bạn thích  */}
                <div className="mt-3">
                  <Form.Item name="you_like">
                    <EditorBlock
                      defaultValue={editorDefaultValues?.you_like}
                      onChange={(data) => {}}
                      title="Bạn thích"
                      required
                    />
                  </Form.Item>
                </div>
                {/* Khuyến nghị phát triển  */}
                <div className="mt-3">
                  <Form.Item name="suggest_improve">
                    <EditorBlock
                      defaultValue={editorDefaultValues?.suggest_improve}
                      onChange={(data) => {}}
                      title="Khuyến nghị phát triển"
                      required
                    />
                  </Form.Item>
                </div>
              </div>
            </Form>
          </div>
        )}
        {/* suggestion for AssessmentType.CAREER */}
        {assessmentType === AssessmentType.CAREER && (
          <div>
            <p className="font-title text-title leading--title mt-7">Chung</p>
            <div>
              <Form
                form={formCareer}
                autoComplete="off"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
              >
                <div className="wrapper-border-gray">
                  <p className="font-[400] text-title leading--title">Chọn nghề</p>
                  <Form.Item name="career_id" initialValue={career[0]?.value}>
                    <CustomSelector
                      options={career}
                      required
                      // showSearch
                      initialValue={career[0]?.value}
                      onChange={(value) => {
                        getCareerInfo(value);
                        formCareer.setFieldsValue({ career_id: value });
                      }}
                    />
                  </Form.Item>
                  <Skeleton active loading={false}>
                    <Collapse
                      defaultActiveKey={['1', '2', '3', '4', '5', '6', '7', '8']}
                      onChange={() => {}}
                      className="bg-white text-sm rounded-[10px] overflow-hidden"
                    >
                      {/* Mô tả nghề */}
                      <Panel
                        className={clsx(styles.career_title)}
                        header="Mô tả nghề"
                        key="1"
                      >
                        <Form.Item name={['general', 'description']}>
                          <TextArea
                            autoSize
                            bordered={false}
                            disabled
                            className={clsx(styles.career_description)}
                          />
                        </Form.Item>
                      </Panel>
                      {/* Nhiệm vụ chủ yếu */}
                      <Panel
                        className={clsx(styles.career_title)}
                        header="Nhiệm vụ chủ yếu"
                        key="2"
                      >
                        <Form.Item name={['general', 'main_tasks']}>
                          <TextArea
                            autoSize
                            bordered={false}
                            disabled
                            className={clsx(styles.career_description)}
                          />
                        </Form.Item>
                      </Panel>
                      {/* Năng lực thiết yếu */}
                      <Panel
                        className={clsx(styles.career_title)}
                        header="Năng lực thiết yếu"
                        key="3"
                      >
                        <Form.Item name={['general', 'required_competency']}>
                          <TextArea
                            autoSize
                            bordered={false}
                            disabled
                            className={clsx(styles.career_description)}
                          />
                        </Form.Item>
                      </Panel>
                      {/* Năng lực bổ sung */}
                      <Panel
                        className={clsx(styles.career_title)}
                        header="Năng lực bổ sung"
                        key="4"
                      >
                        <Form.Item name={['general', 'additional_competency']}>
                          <TextArea
                            autoSize
                            bordered={false}
                            disabled
                            className={clsx(styles.career_description)}
                          />
                        </Form.Item>
                      </Panel>
                      {/* Học vấn tối thiểu */}
                      <Panel
                        className={clsx(styles.career_title)}
                        header="Học vấn tối thiểu"
                        key="5"
                      >
                        <Form.Item name={['general', 'minimum_education']}>
                          <TextArea
                            autoSize
                            bordered={false}
                            disabled
                            className={clsx(styles.career_description)}
                          />
                        </Form.Item>
                      </Panel>
                      {/* Con đường học tập */}
                      <Panel
                        className={clsx(styles.career_title)}
                        header="Con đường học tập"
                        key="6"
                      >
                        <Form.Item name={['general', 'learning_path']}>
                          <TextArea
                            autoSize
                            bordered={false}
                            disabled
                            className={clsx(styles.career_description)}
                          />
                        </Form.Item>
                      </Panel>
                      {/* Lĩnh vực chuyên sâu */}
                      <Panel
                        className={clsx(styles.career_title)}
                        header="Lĩnh vực chuyên sâu"
                        key="7"
                      >
                        <Form.Item name={['general', 'area_of_expertise']}>
                          <TextArea
                            autoSize
                            bordered={false}
                            disabled
                            className={clsx(styles.career_description)}
                          />
                        </Form.Item>
                      </Panel>
                      {/* Ví dụ về nơi làm việc */}
                      <Panel
                        className={clsx(styles.career_title)}
                        header="Ví dụ về nơi làm việc"
                        key="8"
                      >
                        <Form.Item name={['general', 'workplace_example']}>
                          <TextArea
                            autoSize
                            bordered={false}
                            disabled
                            className={clsx(styles.career_description)}
                          />
                        </Form.Item>
                      </Panel>
                    </Collapse>
                  </Skeleton>
                </div>
                <p className="font-title text-title leading--title mt-7">Riêng</p>
                <div className="wrapper-border-gray">
                  <div className="flex flex-col gap-[1rem] justify-between">
                    {/* Bạn mạnh  */}
                    <div className="mt-3">
                      <Form.Item name={['specific', 'you_strong']}>
                        <EditorBlock
                          defaultValue={editorDefaultValues.you_strong}
                          onChange={(data) => {}}
                          title="Bạn mạnh"
                          required
                        />
                      </Form.Item>
                    </div>
                    {/* Cần cải thiện  */}
                    <div className="mt-3">
                      <Form.Item name={['specific', 'need_improve']}>
                        <EditorBlock
                          defaultValue={editorDefaultValues.need_improve}
                          onChange={(data) => {}}
                          title="Cần cải thiện"
                          required
                        />
                      </Form.Item>
                    </div>

                    {/* Khuyến nghị  */}
                    <div className="mt-3">
                      <Form.Item name={['specific', 'recommend']}>
                        <EditorBlock
                          defaultValue={editorDefaultValues.recommend}
                          onChange={(data) => {}}
                          title="Khuyến nghị"
                          required
                        />
                      </Form.Item>
                    </div>
                  </div>
                </div>
              </Form>
            </div>
          </div>
        )}
        {/* suggestion for AssessmentType.COMPETENCY */}
        {assessmentType === AssessmentType.COMPETENCY && (
          <div className="wrapper-border-gray">
            <Form
              form={formCompetency}
              autoComplete="off"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
            >
              <div className="flex flex-col gap-[1rem] justify-between">
                {/* Bạn ở mức này có nghĩa  */}
                <div className="mt-3">
                  <Form.Item name="test_mean">
                    <EditorBlock
                      defaultValue={editorDefaultValues.test_mean}
                      onChange={(data) => {}}
                      title="Bạn ở mức này có nghĩa"
                      required
                    />
                  </Form.Item>
                </div>

                {/* Bạn mạnh  */}
                <div className="mt-3">
                  <Form.Item name="you_strong">
                    <EditorBlock
                      defaultValue={editorDefaultValues.you_strong}
                      onChange={(data) => {}}
                      title="Bạn mạnh"
                      required
                    />
                  </Form.Item>
                </div>
                {/* Cần cải thiện  */}
                <div className="mt-3">
                  <Form.Item name="need_improve">
                    <EditorBlock
                      defaultValue={editorDefaultValues.need_improve}
                      onChange={(data) => {}}
                      title="Cần cải thiện"
                      required
                    />
                  </Form.Item>
                </div>

                {/* Môi trường  */}
                <div className="mt-3">
                  <Form.Item name="environment">
                    <EditorBlock
                      defaultValue={editorDefaultValues.environment}
                      onChange={(data) => {}}
                      title="Môi trường"
                      required
                    />
                  </Form.Item>
                </div>
              </div>
            </Form>
          </div>
        )}
      </div>
      {/* đề xuất section */}
      <div className="wrapper-border-gray mt-5">
        <p className="font-title text-title leading--title">Đề xuất</p>
        <Form.Item name="name">
          <SelectSearch fetcherOptions={mentorServices.searchMentor} />
        </Form.Item>
        <Dynamic_Input_TextArea
          formName="test_levels"
          idField="upper_bound"
          nameField="name"
          valueField="content"
          disabledSelect
          ref={mentorsRef}
          options={[]}
          titleLeft={'*Mức'}
          titleRight={'*Nội dung của mức'}
          onChange={() => {}}
          onSubmit={() => {}}
          onDelete={() => {}}
        />
      </div>

      <Button className="custom-button mt-5" onClick={debounce(onSubmit, 500)}>
        Lưu
      </Button>
    </>
  );
}
