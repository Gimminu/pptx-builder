/**
 * Chart Generator
 * Creates charts and visualizations for presentations
 */

export function createBarChart(slide, data, options = {}) {
  const {
    x = 1,
    y = 2,
    w = 8,
    h = 4,
    title = '',
    chartColors = ['0088CC', '99CCFF', '005588']
  } = options;
  
  // Prepare chart data
  const chartData = data.map((item, index) => ({
    name: item.label || `Item ${index + 1}`,
    labels: [item.label],
    values: [item.value]
  }));
  
  slide.addChart('bar', chartData, {
    x, y, w, h,
    chartColors,
    showTitle: !!title,
    title: title,
    titleFontSize: 18,
    titleColor: '1e3a8a',
    showLegend: true,
    legendPos: 'b',
    barDir: 'col',
    barGrouping: 'clustered',
    catAxisLabelFontSize: 12,
    valAxisLabelFontSize: 12,
    showValue: true,
    dataLabelFontSize: 11,
    dataLabelColor: '000000'
  });
}

export function createLineChart(slide, data, options = {}) {
  const {
    x = 1,
    y = 2,
    w = 8,
    h = 4,
    title = '',
    chartColors = ['0088CC', '99CCFF']
  } = options;
  
  slide.addChart('line', data, {
    x, y, w, h,
    chartColors,
    showTitle: !!title,
    title: title,
    titleFontSize: 18,
    titleColor: '1e3a8a',
    showLegend: true,
    legendPos: 'b',
    lineDataSymbol: 'circle',
    lineDataSymbolSize: 8,
    lineSmooth: true,
    showValue: false
  });
}

export function createPieChart(slide, data, options = {}) {
  const {
    x = 2,
    y = 2,
    w = 6,
    h = 4,
    title = ''
  } = options;
  
  const chartData = [{
    name: 'Distribution',
    labels: data.map(d => d.label),
    values: data.map(d => d.value)
  }];
  
  slide.addChart('pie', chartData, {
    x, y, w, h,
    showTitle: !!title,
    title: title,
    titleFontSize: 18,
    titleColor: '1e3a8a',
    showLegend: true,
    legendPos: 'r',
    showPercent: true,
    dataLabelFontSize: 12,
    dataLabelColor: 'FFFFFF',
    holeSize: 30
  });
}

export function createActivityTimeline(slide, timelineData, options = {}) {
  const {
    x = 1,
    y = 2,
    w = 8,
    h = 4,
    title = 'Development Activity'
  } = options;
  
  // Convert timeline data to chart format
  const chartData = [{
    name: 'Commits',
    labels: timelineData.map(d => d.month),
    values: timelineData.map(d => d.commits)
  }];
  
  slide.addChart('line', chartData, {
    x, y, w, h,
    chartColors: ['3b82f6'],
    showTitle: true,
    title: title,
    titleFontSize: 20,
    titleColor: '1e3a8a',
    showLegend: false,
    lineDataSymbol: 'circle',
    lineDataSymbolSize: 6,
    lineSmooth: false,
    lineSize: 3,
    catAxisLabelFontSize: 11,
    valAxisLabelFontSize: 11,
    valAxisTitle: 'Commits',
    showValue: true,
    dataLabelPosition: 't',
    dataLabelFontSize: 10
  });
}

export function createLanguageChart(slide, languages, options = {}) {
  const {
    x = 2.5,
    y = 2,
    w = 5,
    h = 4,
    title = 'Technology Stack'
  } = options;
  
  const data = languages.map(lang => ({
    label: lang.name,
    value: lang.percentage
  }));
  
  createPieChart(slide, data, { x, y, w, h, title });
}

export function createContributorChart(slide, contributors, options = {}) {
  const {
    x = 1,
    y = 2,
    w = 8,
    h = 4,
    title = 'Top Contributors'
  } = options;
  
  const data = contributors.slice(0, 5).map(c => ({
    label: c.login,
    value: c.contributions
  }));
  
  createBarChart(slide, data, { x, y, w, h, title });
}

export default {
  createBarChart,
  createLineChart,
  createPieChart,
  createActivityTimeline,
  createLanguageChart,
  createContributorChart
};
