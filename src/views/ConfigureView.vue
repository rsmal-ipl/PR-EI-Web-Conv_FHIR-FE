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

import RadioGroupForm from '@/components/common/RadioGroupForm.vue'
const alertDialog = inject('alertDialog')

const router = useRouter()
const storeAuth = useAuthStore()
const storeConvert = useConvertStore()

const showModal = ref(false)

const preview = () => {
  router.push("/load")
}

const previewJson = () => {

  if (storeConvert.jsonText == "") {
    toast({
      title: "No JSON loaded!",
      description: "Please load or enter a JSON file.",
      variant: 'destructive'
    })
    return
  } 
  showModal.value = true
}

const resources = [
  { value: 'patient', label: 'Patient' },
  { value: 'DiagnosticReport', label: 'Diagnostic Report' },
  { value: 'Encounter', label: 'Encounter' },
  { value: 'Boundle', label: 'Boundle' },
]

const options = [
  { value: 'JSON', label: 'JSON' },
  { value: 'XML', label: 'XML' }
]

const convert = () => {
  alertDialog.value.open(
        convertConfirmed,
        'Are you sure?', 'Cancel', `Yes, convert `,
        `This will convert the JSON to FHIR format. Do you want to continue?`,)
}

const convertConfirmed = () => {
  console.log("Convert confirmed")
}


onMounted(() => {
    if (!storeAuth.user || !storeConvert.jsonText) {
        router.push("/login")
    }
})

const versions = [
  { label: 'HL7v2', value: 'HL7 v2' },
  { label: 'CDA', value: 'CDA' },
  { label: 'Custom', value: 'Custom' },
]

const selected = ref()

</script>


<template>
  <div class="flex flex-col justify-center items-center py-12 px-5 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <span class="text-5xl block w-fit mx-auto select-none">⚙️</span>
      <h2 class="mt-5 text-center text-2xl/9 font-bold tracking-tight text-gray-900 dark:text-white">Configure</h2>
    </div>

    <div class="p-6 max-w-3xl w-full">

      <Button @click="previewJson" class="w-full mb-3">Preview JSON</Button>

      <p class="block font-medium my-3 mb-2 text-gray-900 dark:text-white">Select a Resource</p>
      <ComboboxSelect v-model="selected" :items="resources" placeholder="&nbsp;" class="w-full mb-5 !dark:text-white !text-black"/>

      <p class="block font-medium my-3 text-gray-900 dark:text-white">Select a FHIR Version</p>
      <SelectForm :items="versions" placeholder="&nbsp;" class="w-full bg-red-200"/>

      <p class="block font-medium mt-3 mb-2 text-gray-900 dark:text-white">Select the Output Format</p>
      <RadioGroupForm :options="options" defaultValue="JSON" name="outputFormat"/>

      <div class="flex wrap gap-2 mt-5">
        <Button @click="preview" class="w-full mb-3">Previous</Button>
        <Button @click="convert" class="w-full mb-3">Convert</Button>
      </div>
    </div>
    
    <PreviewJson :isVisible="showModal" :json="storeConvert.jsonText" @close="showModal = false"/>

  </div>

</template>