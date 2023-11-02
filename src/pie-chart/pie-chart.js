import { Constructors } from '@wiajs/core';
import PieChart from './pie-chart-class';

export default {
  name: 'pieChart',
  params: {
    pieChart: {
      el: null,
      datasets: [],
      size: 320,
      tooltip: false,
      formatTooltip: null,
    },
  },
  create() {
    const app = this;
    app.pieChart = Constructors({
      defaultSelector: '.pie-chart',
      constructor: PieChart,
      app,
      domProp: 'f7PieChart',
    });
    app.pieChart.update = (el, newParams) => {
      const $el = $(el);
      if ($el.length === 0) return undefined;
      const pieChart = app.pieChart.get(el);
      if (!pieChart) return undefined;
      pieChart.update(newParams);
      return pieChart;
    };
  },
};
