<script setup>
    defineProps({
    title: {
        type: String,
        default: 'Convert'
    }
    });
</script>


<template>
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <span class="text-5xl block w-fit mx-auto select-none">⚙️</span>
      <h2 class="mt-5 text-center text-2xl/9 font-bold tracking-tight text-gray-900 dark:text-white">
        {{ title }}
      </h2>
    </div>
</template>
  

