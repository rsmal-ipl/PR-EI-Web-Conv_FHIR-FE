<script setup>
import Button from '@/components/ui/button/Button.vue'

defineProps({
  isVisible: Boolean,
  json: String
})
</script>

<template>
    <div v-if="isVisible" class="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-900 p-6 rounded max-w-2xl w-full dark:text-white">
        <h1 class="text-xl font-bold mb-4">JSON Preview</h1>
        <pre class="bg-gray-100 dark:bg-gray-800 p-4 text-sm max-h-[60vh] overflow-auto rounded">{{ json }}</pre>
        <Button @click="$emit('close')" class="mt-4">Close</Button>
      </div>
    </div>
</template>
  
