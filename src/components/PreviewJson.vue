<script setup>
import Button from '@/components/ui/button/Button.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps({
  isVisible: Boolean,
  json: String,
  title: String
})
</script>

<template>
  <div v-if="isVisible" class="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
    <div
      class="bg-white dark:bg-darkSecondary p-6 rounded min-w-64 w-fit max-w-6xl max-h-[90vh] overflow-auto dark:text-white">
      <h1 class="text-xl font-bold mb-4">{{ title }}</h1>
      <pre class="bg-gray-100 dark:bg-gray-800 p-4 text-sm max-h-[60vh] overflow-auto rounded">{{ json }}</pre>
      <Button @click="$emit('close')" class="mt-4">{{ t('Close') }}</Button>
    </div>
  </div>
</template>
