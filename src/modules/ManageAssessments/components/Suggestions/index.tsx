import { AssessmentType } from '@/shared/enums/enums';
import Image from 'next/legacy/image';
import { TruncateLines } from 'react-truncate-lines';
interface IProps {
  assessmentType: AssessmentType;
  suggestion: any;
  shortDesc: string;
  isFree: boolean;
  subData?: any;
  titleStyle?: string;
  descStyle?: string;
}
const BlockText: React.FC<any> = ({
  title,
  description,
  subData,
  titleStyle,
  descStyle,
}) => {
  return (
    <div className="block-text w-full block mt-5">
      <h3
        className={`font-[600] leading-[34px] tracking-[0.1px] text-[24px] md:text-[28px] text-[#171725] block ${titleStyle}`}
      >
        {title}&nbsp;
        {subData ? `:${subData}đ` : ''}
      </h3>
      <p
        className={`font-[300] md:font-[400] leading-[26px] tracking-[0.1px] text-[16px] md:text-[20px] text-[#44444F] block ${descStyle}`}
      >
        <div
          dangerouslySetInnerHTML={{
            __html: description,
          }}
        ></div>
      </p>
    </div>
  );
};

const Suggestions: React.FC<IProps> = (props: IProps) => {
  const {
    assessmentType,
    isFree,
    shortDesc,
    suggestion: { textContent, general, specific, testLevel },
  } = props;
  if (assessmentType === AssessmentType.YOUR_SELF) {
    return (
      <>
        {textContent &&
          textContent.map((item) => {
            return (
              <BlockText
                title={item.title}
                description={item.description}
                subData={item.subData}
              />
            );
          })}
      </>
    );
  }
  if (assessmentType === AssessmentType.CAREER) {
    return (
      <>
        {specific && (
          <>
            <h3 className="font-[600] leading-[34px] tracking-[0.1px] text-[24px] md:text-[28px] text-[#171725] block">
              Chung
            </h3>
            <BlockText
              title="Mô tả nghề:"
              description={general?.selected_career?.description}
              titleStyle="!text-[20px]"
              descStyle="!text-[20px]"
            />
            <BlockText
              title="Năng lực thiết yếu:"
              description={general?.selected_career?.required_competency}
              titleStyle="!text-[20px]"
              descStyle="!text-[20px]"
            />
            <BlockText
              title="Năng lực bổ sung:"
              description={general?.selected_career?.additional_competency}
              titleStyle="!text-[20px]"
              descStyle="!text-[20px]"
            />
            <BlockText
              title="Năng lực tối thiểu:"
              description={general?.selected_career?.minimum_education}
              titleStyle="!text-[20px]"
              descStyle="!text-[20px]"
            />
            <BlockText
              title="Con đường học tập:"
              description={general?.selected_career?.learning_path}
              titleStyle="!text-[20px]"
              descStyle="!text-[20px]"
            />
            <BlockText
              title="Lĩnh vực chuyên sâu:"
              description={general?.selected_career?.area_of_expertise}
              titleStyle="!text-[20px]"
              descStyle="!text-[20px]"
            />
            <h3 className="font-[600] leading-[34px] tracking-[0.1px] text-[24px] md:text-[28px] text-[#171725] block">
              Riêng
            </h3>
          </>
        )}
        {specific &&
          specific.map((item) => {
            return (
              <BlockText
                title={item.label}
                description={item.content}
                titleStyle="!text-[20px]"
                descStyle="!text-[20px]"
              />
            );
          })}
      </>
    );
  }
  if (assessmentType === AssessmentType.COMPETENCY) {
    return (
      <>
        <h3 className="font-[600] leading-[34px] tracking-[0.1px] text-[24px] md:text-[28px] text-[#171725] block mt-5">
          Mức độ của bạn là: {testLevel}
        </h3>
        {isFree && (
          <div className="border-[#D5D5DC] border-l-[6px] h-[131px] border-solid overflow-hidden border-r-0 border-t-0 border-b-0 pl-10">
            <div className="relative h-[39px] w-[39px]">
              <Image src={'/images/icons/quote.svg'} layout="fill" objectFit="contain" />
            </div>
            <p className="text-[#403ECC] text-[20px] font-[400] leading-[30px]">
              <div dangerouslySetInnerHTML={{ __html: shortDesc }}></div>
              {/* <TruncateLines lines={4} ellipsis={<span>...</span>}> */}
              {/* </TruncateLines> */}
            </p>
          </div>
        )}
        {textContent &&
          textContent.map((item) => {
            return <BlockText title={item.title} description={item.description} />;
          })}
      </>
    );
  }
};

export default Suggestions;
