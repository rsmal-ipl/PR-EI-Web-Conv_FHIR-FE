<script setup>
import Input from '@/components/ui/input/Input.vue'
import Button from '@/components/ui/button/Button.vue'
import { ref, onMounted } from 'vue'
import { toast } from '@/components/ui/toast'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'
import { useConvertStore } from "@/stores/convert.js";
import PreviewJson from '@/components/PreviewJson.vue'
import SelectForm from '@/components/common/SelectForm.vue'
import PageHeader from '@/components/PageHeader.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()
const storeAuth = useAuthStore()
const storeConvert = useConvertStore()

const jsonText = ref('')
const showModal = ref(false)
const formattedJson = ref('')
const isDragging = ref(false)
const inputFile = ref(null)

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      jsonText.value = e.target.result
    }
    reader.readAsText(file)
  }
}

const handleDrop = (event) => {
  isDragging.value = false
  const file = event.dataTransfer.files[0]
  if (file && file.type === "application/json") {
    const reader = new FileReader()
    reader.onload = (e) => {
      jsonText.value = e.target.result
    }
    reader.readAsText(file)
  } else {
    toast({
      title: t('InvalidFileType'),
      description: t('InvalidFileTypeMessage'),
      variant: 'destructive'
    })
  }
}

const removeFile = () => {
  jsonText.value = ''
  showModal.value = false

  if (inputFile.value?.inputRef) {
    inputFile.value.inputRef.value = ''
  }
}

const previewJson = () => {

  if (!jsonText.value) {
    toast({
      title: t('NoJsonLoad'),
      description: t('NoJsonLoadMessage'),
      variant: 'destructive'
    })
    return
  }

  try {
    const json = JSON.parse(jsonText.value)
    formattedJson.value = JSON.stringify(json, null, 2)
    showModal.value = true
  } catch (e) {
    toast({
      title: t('InvalidJsonFormat'),
      description: t('InvalidJsonFormatMessage'),
      variant: 'destructive'
    })
  }
}

const next = () => {
  if (!jsonText.value) {
    toast({
      title: t('NoJsonLoad'),
      description: t('NoJsonLoadMessage'),
      variant: 'destructive'
    })
    return
  }

  try {
    const json = JSON.parse(jsonText.value)
    formattedJson.value = JSON.stringify(json, null, 2)
    showModal.value = true
  } catch (e) {
    toast({
      title: t('InvalidJsonFormat'),
      description: t('InvalidJsonFormatMessage'),
      variant: 'destructive'
    })
    return
  }

  storeConvert.jsonText = jsonText.value
  router.push({ name: 'configure' })
}

onMounted(() => {
    if (!storeAuth.user) {
        router.push("/login")
    }

    if(storeConvert.jsonText) {
        jsonText.value = storeConvert.jsonText
    }
})

</script>

<template>
  <div class="flex flex-col justify-center items-center py-12 px-5 lg:px-8">
    <PageHeader :title="t('LoadJSON')"/>

    <div class="p-6 max-w-3xl w-full">
      <div class="mb-4">
        <p class="block font-medium my-3 text-gray-900 dark:text-white">{{ t('LoadJSON') }}</p>
        <div class="flex">
            <Input type="file" accept="application/json" @change="handleFileUpload" ref="inputFile" class="p-2 mb-3 dark:bg-white" />
            <Button v-if="jsonText" @click="removeFile" class="ml-2">{{ t('Clear') }}</Button>
        </div>
      </div>

      <div @dragover.prevent="isDragging = true" @dragleave.prevent="isDragging = false" @drop.prevent="handleDrop" class="border-2 border-dashed p-6 rounded text-center transition mb-4"
        :class="isDragging ? 'border-gray-200 bg-gray-200 dark:bg-gray-500' : 'border-gray-300'">
        <p class="text-gray-800 dark:text-white">{{ t('DragJSONFileHere') }}</p>
        <p class="text-sm text-gray-500 dark:text-gray-400">({{ t('OrUseButton') }})</p>
      </div>

      <div class="mb-4">
        <p class="block font-medium my-3 text-gray-900 dark:text-white">{{ t('EditJSONManually') }}</p>
        <textarea
          v-model="jsonText"
          rows="8"
          class="w-full border rounded p-2 bg-gray-50 dark:bg-gray-700 dark:text-white">
        </textarea>
      </div>

      <p class="block font-medium my-3 text-gray-900 dark:text-white">{{ t('JSONSourceFormat') }}</p>
      <SelectForm :items="storeConvert.jsonSchema" placeholder="&nbsp;" class="w-full bg-red-200"/>

      <div class="flex flex-wrap sm:flex-nowrap gap-2 mt-5">
        <Button @click="previewJson" class="w-full mb-3">{{ t('PreviewJSON') }}</Button>
        <Button @click="next" class="w-full mb-3">{{ t('Next') }}</Button>
      </div>
    </div>

    <PreviewJson :isVisible="showModal" :json="formattedJson" @close="showModal = false"/>
  </div>
</template>
