import React from 'react';
import { Line } from '@ant-design/plots';

export const LineWithSlider = ({data, yField}: any) => {

  const config = {
    data,
    width: '100%',
    padding: 'auto',
    xField: 'Date',
    yField: yField,
    xAxis: {
      tickCount: 5,
    },
    slider: {
      start: 0.8,
      end: 1,
    },
  };

  // @ts-ignore
  return <Line {...config} />;
};