import { memo, useEffect } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Sector } from 'recharts';
import styles from './styles.module.scss';
export interface IPieChartData {
  chartData: number;
  height?: number;
  activeColor?: string;
  fillColor?: string;
}
// do not edit if not understand
const LAYOUT_DATA = [
  {
    name: 'Group A',
    value: 0,
    color: '#403ECC',
  },
  {
    name: 'Group A',
    value: 100,
    color: '#D6D6FD',
  },
];
const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text
        x={cx}
        y={cy}
        dy={8}
        textAnchor="middle"
        fill={fill}
        className={styles.custom_pie_center_text}
      >
        {payload.value}%
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <g className={styles.tooltip_wrapper}>
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          textAnchor={textAnchor}
          fill="#333"
          className={styles.custom_pie_tooltip_title}
        >
          {'Kết quả:'}
        </text>
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          dy={18}
          textAnchor={textAnchor}
          fill="#999"
          className={styles.custom_pie_tooltip_message}
        >
          {`(Mức độ phù hợp của bạn là ${value}%)`}
        </text>
      </g>
    </g>
  );
};
const CustomPieChart = (props: IPieChartData) => {
  const { chartData } = props;
  useEffect(() => {
    LAYOUT_DATA[0].value = chartData;
    LAYOUT_DATA[1].value = 100 - chartData;
  }, [chartData]);
  return (
    <>
      <ResponsiveContainer width="100%" height={450}>
        <PieChart>
          <Pie
            dataKey="value"
            nameKey="name"
            data={LAYOUT_DATA}
            // cx={200}
            // cy={200}
            innerRadius={120}
            outerRadius={150}
            fill="#8884d8"
            activeIndex={0}
            activeShape={renderActiveShape}
          >
            {LAYOUT_DATA.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color}></Cell>
            ))}
          </Pie>
          {/* <Tooltip /> */}
        </PieChart>
      </ResponsiveContainer>
    </>
  );
};

export default memo(CustomPieChart);
