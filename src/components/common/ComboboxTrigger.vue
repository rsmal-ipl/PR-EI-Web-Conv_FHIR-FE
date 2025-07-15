<script setup>
import { ref, watch, computed } from 'vue'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Combobox,
  ComboboxAnchor,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxList,
  ComboboxTrigger
} from '@/components/ui/combobox'
import { Check, ChevronsUpDown, Search } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  modelValue: Object,
  items: Array,
  placeholder: String
})

const emit = defineEmits(['update:modelValue'])

const selected = ref(props.modelValue)

watch(() => props.modelValue, (val) => {
  selected.value = val
})

watch(selected, (val) => {
  emit('update:modelValue', val)
})

const placeholderText = computed(() => props.placeholder ?? 'Select an option')
</script>

<template>
  <Combobox v-model="selected" by="label">
    <ComboboxAnchor as-child>
      <ComboboxTrigger as-child>
        <Button variant="default" class="justify-between w-full bg-white text-black hover:bg-white hover:text-black dark:hover:bg-white" data-testid="combobox-resource">
          {{ selected?.label ?? placeholderText }}
          <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </ComboboxTrigger>
    </ComboboxAnchor>

    <ComboboxList>
      <div class="relative w-full max-w-sm items-center text-black rounded-sm bg-red-200">
        <ComboboxInput
          class="pl-9 focus-visible:ring-0 rounded-sm h-10 bg-white text-black"
          :placeholder="placeholderText"
        />
        <span class="absolute start-0 inset-y-0 flex items-center justify-center px-3 text-black">
          <Search class="size-4 text-muted-foreground" />
        </span>
      </div>

      <ComboboxEmpty>{{ t('NoOptionFound') }}</ComboboxEmpty>

      <ComboboxGroup>
        <ComboboxItem
          v-for="item in items"
          :key="item.value"
          :value="item"
          :data-testid="`combobox-resource-option-${item.value}`"
        >
          {{ item.label }}
          <ComboboxItemIndicator>
            <Check class="ml-auto h-4 w-4" />
          </ComboboxItemIndicator>
        </ComboboxItem>
      </ComboboxGroup>
    </ComboboxList>
  </Combobox>
</template>
