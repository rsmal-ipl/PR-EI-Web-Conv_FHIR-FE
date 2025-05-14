<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>

    <h1 class="text-3xl font-bold dark:text-white text-center mt-10">{{ t('Home') }}</h1>
</template>
