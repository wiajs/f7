import { Constructors } from '@wiajs/core';
import AreaChart from './area-chart-class';

export default {
  name: 'areaChart',
  params: {
    areaChart: {
      el: null,
      lineChart: false,
      datasets: [],
      axis: false,
      axisLabels: [],
      tooltip: false,
      legend: false,
      toggleDatasets: false,
      width: 640,
      height: 320,
      maxAxisLabels: 8,
      formatAxisLabel: null,
      formatLegendLabel: null,
      formatTooltip: null,
      formatTooltipAxisLabel: null,
      formatTooltipTotal: null,
      formatTooltipDataset: null,
    },
  },
  create() {
    const app = this;
    app.areaChart = Constructors({
      defaultSelector: '.area-chart',
      constructor: AreaChart,
      app,
      domProp: 'f7AreaChart',
    });
    app.areaChart.update = (el, newParams) => {
      const $el = $(el);
      if ($el.length === 0) return undefined;
      const areaChart = app.areaChart.get(el);
      if (!areaChart) return undefined;
      areaChart.update(newParams);
      return areaChart;
    };
  },
};
