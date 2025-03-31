<script setup>
import { RouterView } from 'vue-router'
import { useTemplateRef, provide } from 'vue'
import Toaster from '@/components/ui/toast/Toaster.vue'
import GlobalAlertDialog from '@/components/common/GlobalAlertDialog.vue'
import NavbarComponent from './components/navbarComponent.vue';
import FooterComponent from './components/footerComponent.vue';

const alertDialog = useTemplateRef('alert-dialog')
provide('alertDialog', alertDialog)
</script>

<template>
  <Toaster />
  <GlobalAlertDialog ref="alert-dialog"></GlobalAlertDialog>

  <div>
    <NavbarComponent></NavbarComponent>
    <main>
      <RouterView />
    </main>
    <FooterComponent></FooterComponent>
  </div>

</template>

<style scoped>
  div {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  main {
    flex: 1;
  }
</style>
