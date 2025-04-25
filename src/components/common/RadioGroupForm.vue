<script setup lang="ts">
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { defineProps } from 'vue'

interface Option {
  label: string
  value: string
}

const props = defineProps<{
  options: Option[]
  defaultValue?: string
  name?: string
}>()

</script>

<template>
  <RadioGroup :default-value="defaultValue">
    <div
      v-for="(option, index) in options"
      :key="option.value"
      class="flex items-center space-x-2"
    >
      <RadioGroupItem :id="`${name}-option-${index}`" :value="option.value" />
      <Label :for="`${name}-option-${index}`">{{ option.label }}</Label>
    </div>
  </RadioGroup>
</template>
