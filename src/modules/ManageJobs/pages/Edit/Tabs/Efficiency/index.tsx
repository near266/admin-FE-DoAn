import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import CustomPieChart from '@/components/PieChart';
import SrcIcons from '@/assets/icons';
import { SvgIcon } from '@mui/material';
import Image from 'next/legacy/image';
import { CustomSelector } from '@/components/CustomSelector';

interface IProps {
  data?: 'TODO:Change';
}
const data = [
  {
    name: 'Jan',
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Feb',
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Mar',
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Apr',
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'May',
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'Jun',
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'Jul',
    pv: 4300,
    amt: 2100,
  },
  {
    name: 'Aug',
    pv: 4300,
    amt: 2100,
  },
  {
    name: 'Sep',
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Oct',
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'Nov',
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'Dec',
    pv: 3800,
    amt: 2500,
  },
];
const fakeCardData = [
  {
    title: 'Số lượng truy cập tin',
    date_range: 7,
    data: 100,
    range: 2.5,
    description: 'Tổng số lượng truy cập tin',
  },
  {
    title: 'Số lượng theo dõi',
    date_range: 7,
    data: 100,
    range: 2.5,
    description: 'Lượng theo dõi',
  },
  {
    title: 'Ứng viên nhận việc',
    date_range: 7,
    data: 100,
    range: 2.5,
    description: 'Tổng số lượng ứng viên nhận việc',
  },
  {
    title: 'CV ứng tuyển mới',
    date_range: 7,
    data: 100,
    range: 2.5,
    description: 'Tổng số lượng CV ứng viên nhận việc',
  },
];

const subChart = [
  {
    percent: 68,
    description: 'Tỷ lệ ứng viên phản hồi',
    subColor: '#ECFBF5',
    mainColor: '#3BB1CF',
    icon: SrcIcons.target,
  },
  {
    percent: 76,
    description: 'Tỷ lệ ứng viên nhận việc',
    subColor: '#ECFBF5',
    mainColor: '#3DD598',
    icon: SrcIcons.bag,
  },
];
const Efficiency: React.FC = () => {
  const circumference = 35 * 2 * Math.PI;
  return (
    <>
      <div className="flex flex-col gap-5">
        <div className="filter flex flex-row items-center justify-start">
          <span>Hiển thị:</span>
          <CustomSelector
            options={[
              { key: 0, value: 0, label: '7 ngày qua' },
              { key: 1, value: 1, label: '1 tháng qua' },
            ]}
            wrapperClassName="!m-0 !w-auto"
            selectClassName="!shadow-none !filter-none"
          />
        </div>
        <div className="cards grid xl:grid-cols-4 sm:grid-cols-2 gap-6 last:col-span-12 ">
          {fakeCardData.map((item) => (
            <div className="card col-span-12 sm:col-auto ">
              <div className="flex flex-col">
                <div className="card-title font-[500] text-base leading-6 text-[#171725]">
                  {item.title}
                </div>
                <div className="card-time-range">{new Date().toLocaleDateString()}</div>
                <div className="card-body flex flex-row w-full my-auto justify-start items-baseline gap-2 !px-0">
                  <p className=" font-[600] text-[40px] leading-[48px] m-0 text-[#171725]">
                    {item.data}
                  </p>
                  <span className="range text-[#30AB7E] text-base font-[400]">
                    {item.range}%&nbsp;
                  </span>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6.69337 11.3333V0.666667C6.69337 0.298477 6.39489 2.47154e-07 6.0267 2.47154e-07C5.65851 2.47154e-07 5.36003 0.298477 5.36003 0.666667V11.3333C5.36003 11.7015 5.65851 12 6.0267 12C6.39489 12 6.69337 11.7015 6.69337 11.3333Z"
                      fill="#92929D"
                    />
                    <path
                      d="M6.02077 1.67906L10.192 6.43936C10.4346 6.71628 10.8558 6.74406 11.1327 6.50141C11.4096 6.25876 11.4374 5.83756 11.1948 5.56064L6.52146 0.22731C6.25564 -0.0760547 5.78342 -0.0757209 5.51803 0.228018L0.858008 5.56135C0.615749 5.83861 0.644125 6.25977 0.921387 6.50203C1.19865 6.74429 1.6198 6.71591 1.86206 6.43865L6.02077 1.67906Z"
                      fill="#92929D"
                    />
                  </svg>
                </div>
                <div className="card-footer">{item.description}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-5 w-full flex-wrap xl:flex-nowrap">
          <div className="card chart w-full xl:w-[75%] ">
            <div className="flex flex-row justify-between mb-5">
              <p className="font-semibold text-[16px] leading-[20px] text-[#171725]">
                Tổng số lượng ứng viên
              </p>
              <p className="relative font-[400] text-[14px] leading-[32px] text-[#696974] before:h-[10px] before:w-[10px] before:bg-[#30AB7E] before:block before:rounded-full before:absolute before:bottom-[12px] before:-left-[15px] before:animate-pulse">
                Ứng viên
              </p>
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart
                width={100}
                height={250}
                data={data}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3DD598" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3DD598" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="pv"
                  stroke="#3DD598"
                  fillOpacity={1}
                  fill="url(#colorPv)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-col gap-4 w-full  xl:w-[25%] ">
            <div className="card :w-full gap-4 flex flex-col">
              {subChart.map((item, index) => (
                <div className="flex flex-row gap-4">
                  <div className="pie ">
                    <div className=" relative">
                      <svg className="w-20 h-20 -rotate-90">
                        <circle
                          className={`${
                            index == 0 ? 'text-[#EBF7FA]' : 'text-[#ECFBF5]'
                          }`}
                          strokeWidth="3"
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="transparent"
                          r="35"
                          cx="40"
                          cy="40"
                        />
                        <circle
                          // className={`text-[${item.mainColor}]`}
                          className={`${
                            index == 0 ? 'text-[#3BB1CF]' : 'text-[#3DD598]'
                          }`}
                          strokeWidth="3"
                          strokeDasharray={circumference}
                          strokeDashoffset={`${
                            circumference - (item.percent / 100) * circumference
                          }px`}
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="transparent"
                          r="35"
                          cx="40"
                          cy="40"
                        />
                      </svg>
                      <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-6 w-6">
                        <Image layout="fill" objectFit="contain" src={item.icon} alt="" />
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 my-auto">
                    <p className="font-semibold text-[24px] leading-[32px] text-[#171725]">
                      {item.percent}%
                    </p>
                    <p className="font-[400] text-[14px] leading-[24px] text-[#696974]">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="card :w-full h-full flex flex-col justify-around items-center">
              <ResponsiveContainer width="100%" height="50%">
                <LineChart data={data}>
                  <Line type="monotone" dataKey="pv" stroke="#3BB1CF" />
                  <Tooltip />
                </LineChart>
              </ResponsiveContainer>
              <div className="w-full">
                <div className="flex flex-row justify-between items-center">
                  <p className="font-semibold text-[24px] leading-[32px] text-[#171725]">
                    10,254
                  </p>
                  <span className="font-semibold text-[16px] leading-[24px] text-[#EB4C4C] flex items-center gap-1">
                    1.5%
                    <svg
                      width="16"
                      height="18"
                      viewBox="0 0 16 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M7.99714 15.0944C7.81138 15.0954 7.6253 15.0182 7.49166 14.8628L2.83164 9.44497C2.58938 9.16331 2.61776 8.73548 2.89502 8.48939C3.17228 8.24329 3.59344 8.27211 3.8357 8.55377L7.33367 12.6206L7.33367 3.58153C7.33367 3.2075 7.63214 2.9043 8.00033 2.9043C8.36852 2.9043 8.667 3.2075 8.667 3.58153V12.609L12.1656 8.55305C12.4082 8.27174 12.8294 8.24352 13.1064 8.49001C13.3833 8.73651 13.4111 9.16438 13.1684 9.44569L8.55204 14.7975C8.43209 14.9767 8.22974 15.0944 8.00033 15.0944C7.99927 15.0944 7.9982 15.0944 7.99714 15.0944Z"
                        fill="#EB4C4C"
                      />
                    </svg>
                  </span>
                </div>

                <p className="font-[400] text-[16px] leading-[24px] text-[#696974]">
                  Tỷ lệ ứng viên nhận việc
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Efficiency;
