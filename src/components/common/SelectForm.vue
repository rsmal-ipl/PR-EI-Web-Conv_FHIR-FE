<script setup>
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
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  items: Array,
  placeholder: String
})

const emit = defineEmits(['update:modelValue'])

const handleSelect = (value) => {
  emit('update:modelValue', value)
}
</script>

<template>
  <Select @update:modelValue="handleSelect">
    <SelectTrigger data-testid="select-trigger" class="w-full px-4 font-semibold bg-white">
      <SelectValue :placeholder="placeholder || t('SelectAnOption')" />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectItem
          v-for="item in items"
          :key="item.value"
          :value="item.value"
          :data-testid="`select-option-${item.value}`"
        >
          {{ item.label }}
        </SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
</template>