import { Empty } from 'antd';
import React, { memo, useState } from 'react';
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip as RechartTooltip,
} from 'recharts';
import styles from './styles.module.scss';
export interface IChartData {
  subject: string;
  point: number;
  maxPoint: number;
}
export interface IRadarChartData {
  chartData: IChartData[];
}

const customTick: React.FC = (tickProps: any) => {
  const { payload, x, y, textAnchor, stroke, radius } = tickProps;
  return (
    <g>
      <text
        fill="#171725"
        radius={radius}
        stroke={stroke}
        x={x}
        y={y}
        textAnchor={textAnchor}
      >
        <tspan x={x} dy="0em">
          {payload.value}
        </tspan>
      </text>
    </g>
  );
};

const customPolarAngleAxisTick: React.FC = (tickProps: any, chartData: IChartData) => {
  const { payload, cx, cy, x, y, textAnchor, stroke, radius } = tickProps;
  return (
    <g>
      <text
        fill="#171725"
        radius={radius}
        stroke={stroke}
        x={x + (x - cx) / 3}
        y={y + (y - cy) / 7}
        className={styles.custom_tick_label}
        textAnchor={textAnchor}
      >
        <tspan x={x} dy="0em">
          {chartData[payload.value]?.subject}
        </tspan>
      </text>
    </g>
  );
};

const CustomTooltip: React.FC = (props: any) => {
  const { active, payload, label } = props;
  if (active && payload && payload.length) {
    return (
      <div className={styles.custom_tooltip}>
        <p className="label">{`${payload[0].payload.subject} : ${payload[0].value} / ${payload[0].payload.maxPoint}`}</p>
        {/* <p className="desc">message</p> */}
      </div>
    );
  }

  return null;
};
const customLable: React.FC = (props: any, chartData) => {
  const { x, y, cy, cx, stroke, name, radius } = props;
  return (
    <g>
      <text
        fill="#171725"
        radius={radius}
        stroke={stroke}
        x={x + (x - cx) / 3}
        y={y + (y - cy) / 7}
        className={styles.custom_label}
        textAnchor="middle"
      >
        <tspan x={x} dy="0em">
          {chartData[name].subject}
        </tspan>
      </text>
    </g>
  );
};
const VariantChart: React.FC<IRadarChartData> = (props: IRadarChartData) => {
  const [isReady, setIsReady] = useState(false);
  const { chartData } = props;

  return (
    <>
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={450} className={styles.addZoom}>
          <RadarChart
            outerRadius={160}
            data={chartData}
            width={500}
            height={400}
            className={styles.responsive_wraper}
          >
            <PolarGrid gridType="polygon" fill="#8884d8" innerRadius={160} />
            <RechartTooltip content={<CustomTooltip />} />

            <PolarAngleAxis
              tick={(tickProps) => {
                return customPolarAngleAxisTick(tickProps, chartData);
              }}
              type="category"
              allowDuplicatedCategory
            />
            <PolarRadiusAxis
              color="#30AB7E"
              opacity={1}
              angle={90}
              tickSize={10}
              tick={customTick}
              orientation="left"
            />
            <Radar
              dataKey="point"
              stroke="#30AB7E"
              activeDot={{ r: 6 }}
              strokeWidth={0}
              label={(labelProps) => {
                return customLable(labelProps, chartData);
              }}
              fill="#30AB7E"
              opacity={1}
              style={{
                fontSize: '20px',
                backgroundColor: '#30AB7E',
                color: '#30AB7E',
              }}
              fillOpacity={0.3}
            />
            {/* <Legend /> */}
          </RadarChart>
        </ResponsiveContainer>
      ) : (
        <Empty className="tw-my-[100px]" description={'Không có dữ liệu !'} />
      )}
    </>
  );
};

export default memo(VariantChart);
