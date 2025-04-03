<script setup>
import { RouterView } from 'vue-router'
import { useTemplateRef, provide } from 'vue'
import Toaster from '@/components/ui/toast/Toaster.vue'
import GlobalAlertDialog from '@/components/common/GlobalAlertDialog.vue'
import NavbarComponent from './components/navbarComponent.vue'
import FooterComponent from './components/footerComponent.vue'
import { ref, onMounted } from 'vue'
import Button from '@/components/ui/button/Button.vue'

const alertDialog = useTemplateRef('alert-dialog')
provide('alertDialog', alertDialog)

const isDarkMode = ref(false)

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  document.documentElement.classList.toggle('dark', isDarkMode.value)
  localStorage.setItem('darkMode', isDarkMode.value ? 'enabled' : 'disabled')
}

onMounted(() => {
  const savedMode = localStorage.getItem('darkMode') ||  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'enabled' : 'disabled')
  isDarkMode.value = savedMode === 'enabled'
  document.documentElement.classList.toggle('dark', isDarkMode.value)
})
</script>

<template>
  <Toaster />

  <GlobalAlertDialog />

  <div class="min-h-screen flex flex-col">
    <NavbarComponent />
    
    <main class="flex-1 bg-white dark:bg-gray-700 transition-colors duration-300">
      <RouterView />
    </main>
    
    <Button @click="toggleDarkMode"
      class="fixed bottom-4 right-4 p-3 h-auto rounded-full bg-gray-200 dark:bg-gray-800 shadow-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors">
      {{ isDarkMode ? '🌙' : '☀️' }}
    </Button>

    <FooterComponent/>
  </div>

</template>
