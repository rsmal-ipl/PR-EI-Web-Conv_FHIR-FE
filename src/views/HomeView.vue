<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<template>
  <section class="relative min-h-screen flex flex-col items-center px-4 py-12 overflow-hidden">
    <div class="text-center w-full mx-auto flex flex-col items-center">
      <div class="flex flex-col-reverse md:flex-row w-fit gap-6 items-center justify-between px-4 mx-auto mb-8">
        <div class="flex-1 text-center md:text-left text-black dark:text-white">
          <h1 class="text-3xl font-extrabold mb-3">{{ t('title') }}</h1>
          <div class="mb-4 max-w-xl mx-auto md:mx-0">
            <h2 class="text-xl font-semibold mb-1">{{ t('contextTitle') }}</h2>
            <p class="text-base leading-relaxed">{{ t('contextDescription') }}</p>
          </div>
        </div>
        <div class="flex-shrink-0">
          <img src="@/assets/homeSchemaLight.svg" alt="JSON to FHIR" class="w-full max-w-xs h-auto dark:hidden" />
          <img src="@/assets/homeSchemaDark.svg" alt="JSON to FHIR" class="w-full max-w-xs h-auto hidden dark:block" />
        </div>
      </div>

      <div class="max-w-4xl w-full mx-auto mb-8 text-black dark:text-white px-4">
        <h2 class="font-bold text-3xl mb-8 text-center">{{ t('advantagesTitle') }}</h2>
        <div class="flex flex-wrap items-center gap-6 justify-center">
          <div class="flex flex-col h-40 backdrop-blur-md bg-white/70 dark:bg-darkSecondary p-6 rounded-2xl shadow-lg w-full max-w-sm transition-transform transform hover:scale-105">
            <h3 class="font-semibold text-xl mb-2">{{ t('advStandardizationTitle') }}</h3>
            <p class="text-md text-black dark:text-white">{{ t('advStandardizationText') }}</p>
          </div>
          <div class="h-40 backdrop-blur-md bg-white/70 dark:bg-darkSecondary p-6 rounded-2xl shadow-lg w-full max-w-sm transition-transform transform hover:scale-105">
            <h3 class="font-semibold text-xl mb-2">{{ t('advInteroperabilityTitle') }}</h3>
            <p class="text-md text-black dark:text-white">{{ t('advInteroperabilityText') }}</p>
          </div>
          <div class="h-40 backdrop-blur-md bg-white/70 dark:bg-darkSecondary p-6 rounded-2xl shadow-lg w-full max-w-sm transition-transform transform hover:scale-105">
            <h3 class="font-semibold text-xl mb-2">{{ t('advComplianceTitle') }}</h3>
            <p class="text-md text-black dark:text-white">{{ t('advComplianceText') }}</p>
          </div>
        </div>
      </div>

      <hr class="border-gray-300 mb-12 rounded" />

      <div class="max-w-4xl w-full text-black dark:text-white px-4 mx-auto">
        <h2 class="font-bold text-3xl mb-6 text-center">{{ t('instructionsTitle') }}</h2>
        
        <div class="grid gap-6 sm:grid-cols-1 md:grid-cols-3">
          <div class="backdrop-blur-md bg-white/70 dark:bg-darkSecondary p-6 rounded-2xl shadow-lg flex flex-col items-start transition-transform transform hover:scale-105">
            <div class="text-2xl font-bold mb-2">1.</div>
            <h3 class="font-semibold text-lg mb-1">{{ t('step1Title') }}</h3>
            <p class="text-md text-black dark:text-white">{{ t('step1Text') }}</p>
          </div>

          <div class="backdrop-blur-md bg-white/70 dark:bg-darkSecondary p-6 rounded-2xl shadow-lg flex flex-col items-start transition-transform transform hover:scale-105">
            <div class="text-2xl font-bold mb-2">2.</div>
            <h3 class="font-semibold text-lg mb-1">{{ t('step2Title') }}</h3>
            <p class="text-md text-black dark:text-white">{{ t('step2Text') }}</p>
          </div>

          <div class="backdrop-blur-md bg-white/70 dark:bg-darkSecondary p-6 rounded-2xl shadow-lg flex flex-col items-start transition-transform transform hover:scale-105">
            <div class="text-2xl font-bold mb-2">3.</div>
            <h3 class="font-semibold text-lg mb-1">{{ t('step3Title') }}</h3>
            <p class="text-md text-black dark:text-white">{{ t('step3Text') }}</p>
          </div>
        </div>
      </div>

      <hr class="border-gray-300 my-12 rounded" />

      <div class="max-w-4xl w-full mb-12 text-black dark:text-white px-4 mx-auto">
        <div class="backdrop-blur-md bg-white/70 dark:bg-darkSecondary p-8 rounded-2xl shadow-lg flex flex-col gap-4 transition-transform transform hover:scale-105">
          <h2 class="font-bold text-3xl mb-2 flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
            </svg>
            {{ t('aboutTitle') }}
          </h2>
          <p class="text-base leading-relaxed text-black dark:text-white">{{ t('aboutText') }}</p>
        </div>
      </div>

    </div>
  </section>
</template>
