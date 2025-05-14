<script setup>
import { ref, onMounted} from 'vue'
import { useAuthStore } from "@/stores/auth";
import { useRouter } from 'vue-router'
import Button from '@/components/ui/button/Button.vue'
import PreviewJson from '@/components/PreviewJson.vue';
import { useConvertStore } from "@/stores/convert.js";
import { toast } from '@/components/ui/toast'
import ComboboxSelect from '@/components/common/ComboboxTrigger.vue'
import { inject } from 'vue'
import SelectForm from '@/components/common/SelectForm.vue';
import PageHeader from '@/components/PageHeader.vue'
import { useI18n } from 'vue-i18n'

import RadioGroupForm from '@/components/common/RadioGroupForm.vue'
const alertDialog = inject('alertDialog')

const { t } = useI18n()
const router = useRouter()
const storeAuth = useAuthStore()
const storeConvert = useConvertStore()

const showModal = ref(false)
const selected = ref()

const preview = () => {
  router.push("/load")
}

const previewJson = () => {
  if (storeConvert.jsonText == "") {
    toast({
      title: t('NoJsonLoad'),
      description: t('NoJsonLoadMessage'),
      variant: 'destructive'
    })
    return
  } 
  showModal.value = true
}

const convert = () => {
  alertDialog.value.open(
        convertConfirmed,
        t('AreYouSure'), t('Cancel'), t('YesConvert'),
        t('AreYouSureMessage'),)
}

const convertConfirmed = () => {
  console.log("Convert confirmed")
}


onMounted(() => {
    if (!storeAuth.user || !storeConvert.jsonText) {
        router.push("/login")
    }
})

</script>


<template>
  <div class="flex flex-col justify-center items-center py-12 px-5 lg:px-8">
    <PageHeader :title="t('Configure')"/>

    <div class="p-6 max-w-3xl w-full">

      <Button @click="previewJson" class="w-full mb-3">{{ t('PreviewJSON') }}</Button>

      <p class="block font-medium my-3 mb-2 text-gray-900 dark:text-white">{{ t('SelectResource') }}</p>
      <ComboboxSelect v-model="selected" :items="storeConvert.resources" placeholder="&nbsp;" class="w-full mb-5 !dark:text-white !text-black"/>

      <p class="block font-medium my-3 text-gray-900 dark:text-white">{{ t('SelectFHIRVersion') }}</p>
      <SelectForm :items="storeConvert.FHIRversion" placeholder="&nbsp;" class="w-full"/>

      <p class="block font-medium mt-3 mb-2 text-gray-900 dark:text-white">{{ t('SelectOutputFormat') }}</p>
      <RadioGroupForm :options="storeConvert.options" defaultValue="JSON" name="outputFormat"/>

      <div class="flex flex-wrap sm:flex-nowrap gap-2 mt-5">
        <Button @click="preview" class="w-full mb-3">{{ t('Previous') }}</Button>
        <Button @click="convert" class="w-full mb-3">{{ t('Convert') }}</Button>
      </div>
    </div>
    
    <PreviewJson :isVisible="showModal" :json="storeConvert.jsonText" @close="showModal = false"/>

  </div>

</template>