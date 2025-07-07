<template>
  <div class="w-full p-4 relative" style="min-height:300px;">
    <canvas ref="chartRef" class="w-full h-full" />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import {
  Chart,
  CategoryScale,
  LinearScale,
  Tooltip,
  Title,
  BarElement,
} from 'chart.js'
import { BoxPlotController, BoxAndWiskers } from '@sgratzl/chartjs-chart-boxplot'

Chart.register(
  CategoryScale,
  LinearScale,
  Tooltip,
  Title,
  BarElement,
  BoxPlotController,
  BoxAndWiskers,
)

const props = defineProps({
  chartData: {
    type: Array,
    required: true,
    default: () => [],
  },
  chartTitle: {
    type: String,
    default: '',
  },
  color: {
    type: String,
    default: '#60A5FA',
  },
  borderColor: {
    type: String,
    default: '#3B82F6',
  },
})

const chartRef = ref(null)
let chartInstance = null

function buildDataset() {
  const labels = props.chartData.map((d) => d.label ?? d.year ?? '')

  const datasetData = props.chartData.map((d) => ({
    min: d.min ?? 0,
    q1: d.q1,
    median: d.median,
    q3: d.q3,
    mean: d.mean,
    max: d.max ?? 0,
    outliers: d.outliers ?? [],
  }))

  return { labels, datasetData }
}

function renderChart() {
  if (!chartRef.value) return

  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }

  const ctx = chartRef.value.getContext('2d')
  const { labels, datasetData } = buildDataset()

  if (!labels.length) {
    return
  }

  chartInstance = new Chart(ctx, {
    type: 'boxplot',
    data: {
      labels,
      datasets: [
        {
          label: props.chartTitle || 'BoxPlot',
          backgroundColor: props.color,
          borderColor: props.borderColor,
          borderWidth: 1,
          data: datasetData,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        tooltip: {
          enabled: true,
        },
        title: {
          display: !!props.chartTitle,
          text: props.chartTitle,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Valor',
          },
        },
      },
    },
  })
}

onMounted(renderChart)

watch(
  () => [props.chartData, props.chartTitle],
  renderChart,
  { deep: true },
)
</script>
