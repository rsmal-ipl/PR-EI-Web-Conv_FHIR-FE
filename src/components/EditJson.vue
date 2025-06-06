<script setup>
import Button from '@/components/ui/button/Button.vue'
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  isVisible: Boolean,
  title: String,
  modelValue: String,
})

const emit = defineEmits(['update:modelValue', 'save', 'cancel'])

const localContent = ref('')

watch(() => props.modelValue, (val) => {
  localContent.value = val
}, { immediate: true })

watch(localContent, (val) => {
  emit('update:modelValue', val)
})

</script>

<template>
  <div v-if="isVisible" class="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-darkSecondary p-6 rounded max-w-5xl w-full dark:text-white">
      <h1 class="text-xl font-bold mb-4">{{ title }}</h1>
      <textarea
        v-model="localContent"
        rows="12"
        class="w-full bg-gray-100 dark:bg-gray-800 p-4 text-sm max-h-[60vh] overflow-auto rounded resize-none text-black dark:text-white"
      ></textarea>
      <div class="flex justify-end gap-2 mt-4">
        <Button @click="$emit('close')">{{ t('Close') }}</Button>
        <Button @click="$emit('save')">{{ t('SaveChanges') }}</Button>
      </div>
    </div>
  </div>
</template>