<template>
  <div :style="{ maxWidth, height, width: '100%', position: 'relative', margin: '0 auto' }">
    <Pie :data="computedChartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Pie } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, ArcElement)

const props = defineProps({
  labels: { type: Array, required: true },
  values: { type: Array, required: true },
  colors: { type: Array, default: () => ['#FF0000'] },
  chartTitle: { type: String },
  maxWidth: { type: String, default: '500px' }, 
  height: { type: String, default: '400px' }
})

const computedChartData = computed(() => ({
  labels: props.labels,
  datasets: [
    {
      backgroundColor: props.colors,
      data: props.values
    }
  ]
}))

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: true },
    title: { display: true, text: props.chartTitle }
  }
}))
</script>
