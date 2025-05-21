<script setup>
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { defineProps, ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import axios from 'axios'

const { locale } = useI18n()

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  placeholder: {
    type: String,
    default: 'Select an option',
  },
})

const selected = ref(
  props.items.find(i => i.flag === locale.value)?.value || props.items[0].value
)

watch(selected, (val) => {
  const lang = props.items.find(i => i.value === val)?.flag
  if (lang) {
    locale.value = lang
    axios.defaults.headers.common['Accept-Language'] = lang
  }
})

const selectedItem = computed(() =>
  props.items.find((item) => item.value === selected.value)
)
</script>


<template>
  <Select v-model="selected">
    <SelectTrigger class="w-fit p-2 bg-white border border-gray-300 rounded-lg shadow-sm flex items-center justify-between">
      <template v-if="selectedItem">
        <img
          :src="`/flags/${selectedItem.flag}.png`"
          alt=""
          class="w-5 h-5 object-contain pe-1"
        />
      </template>
      <template v-else>
        <span class="text-muted-foreground text-xs">
          {{ placeholder }}
        </span>
      </template>
    </SelectTrigger>

    <SelectContent>
      <SelectGroup>
        <SelectItem
          v-for="item in props.items"
          :key="item.value"
          :value="item.value">

          <div class="flex items-center gap-2">
            <img
              :src="`/flags/${item.flag}.png`"
              alt=""
              class="w-5 h-5 object-contain"/>
            <span class="mx-2">{{ item.label }}</span>
          </div>
        </SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
</template>
