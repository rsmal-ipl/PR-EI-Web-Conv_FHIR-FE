<script setup>
import { cn } from '@/lib/utils';
import { ComboboxInput, useForwardPropsEmits } from 'reka-ui';
import { computed } from 'vue';

const props = defineProps({
  displayValue: { type: Function, required: false },
  modelValue: { type: String, required: false },
  autoFocus: { type: Boolean, required: false },
  disabled: { type: Boolean, required: false },
  asChild: { type: Boolean, required: false },
  as: { type: null, required: false },
  class: { type: null, required: false },
});

const emits = defineEmits(['update:modelValue']);

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});

const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
  <ComboboxInput
    v-bind="forwarded"
    :class="
      cn(
        'flex h-9 w-full rounded-md font-bold bg-transparent px-3 py-1 text-sm transition-colors file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50  dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300',
        props.class,
      )
    "
  >
    <slot />
  </ComboboxInput>
</template>
