<template>
  <div :style="{ maxWidth, height, width: '100%', position: 'relative', margin: '0 auto' }">
    <Bar :data="computedChartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const props = defineProps({
  labels: { type: Array, required: true },
  values: { type: Array, required: true },
  colors: { type: Array, default: () => ['#42A5F5'] },
  chartTitle: { type: String },
  maxWidth: { type: String, default: '700px' },
  height: { type: String, default: '300px' }
})

const computedChartData = computed(() => ({
  labels: props.labels,
  datasets: [
    {
      label: props.chartTitle,
      backgroundColor: props.colors,
      data: props.values,
      borderRadius: 15,
      borderSkipped: false
    }
  ]
}))

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: true },
    title: { display: false, text: props.chartTitle }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 1,
        callback: value => Number.isInteger(value) ? value : null
      }
    }
  }
}))
</script>
