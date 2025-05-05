<script setup lang="ts">
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { defineProps, defineEmits } from 'vue'

const props = defineProps<{
  items: { label: string, value: string }[]
  placeholder?: string
}>()

const emit = defineEmits(['update:modelValue'])

const handleSelect = (value: string) => {
  emit('update:modelValue', value)
}
</script>

<template>
  <Select @update:modelValue="handleSelect">
    <SelectTrigger class="w-full px-4 font-semibold bg-white">
      <SelectValue :placeholder="placeholder || 'Select an option'" />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectItem
          v-for="item in items"
          :key="item.value"
          :value="item.value"
        >
          {{ item.value }}
        </SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
</template>