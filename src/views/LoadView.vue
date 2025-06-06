<script setup>
import Input from '@/components/ui/input/Input.vue'
import Button from '@/components/ui/button/Button.vue'
import { ref, onMounted, inject } from 'vue'
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
const alertDialog = inject('alertDialog')

const jsonText = ref('')
const showModal = ref(false)
const formattedJson = ref('')
const isDragging = ref(false)
const inputFile = ref(null)
const isEditing = ref(false)
const copyInputContent = ref('')


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

  if(storeConvert.selectedJSONSchema == null) {
    toast({
      title: t('NoJsonSchemaSelected'),
      description: t('PleaseSelectJsonSchema'),
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

const editJson = () => {
  copyInputContent.value = jsonText.value
  isEditing.value = true
}

const saveChanges = async () => {
  try {
    const json = JSON.parse(copyInputContent.value)
    jsonText.value = JSON.stringify(json, null, 2)
    isEditing.value = false
    toast({
      title: t('ChangesSaved'),
      description: t('JsonUpdatedSuccessfully'),
      variant: 'default'
    })
  } catch (e) {
    toast({
      title: t('InvalidJsonFormat'),
      description: t('InvalidJsonFormatMessage'),
      variant: 'destructive'
    })
  }
}

const cancelChanges = () => {
  isEditing.value = false
}

onMounted(() => {
  if (!storeAuth.user) {
    router.push("/login")
  }

  if (storeConvert.jsonText) {
    jsonText.value = storeConvert.jsonText
  }
})

</script>

<template>
  <div class="flex flex-col justify-center items-center pt-12 px-5 lg:px-8">
    <PageHeader :title="t('LoadJSON')" />

    <div class="p-6 max-w-3xl w-full">
      <div class="mb-4">
        <p class="block font-medium my-3 text-gray-900 dark:text-white">{{ t('LoadJSON') }}</p>
        <div class="flex">
          <Input type="file" accept="application/json" @change="handleFileUpload" ref="inputFile"
            class="p-2 mb-3 dark:bg-white" />
          <Button v-if="jsonText" @click="removeFile" class="ml-2">{{ t('Clear') }}</Button>
        </div>
      </div>

      <div @dragover.prevent="isDragging = true" @dragleave.prevent="isDragging = false" @drop.prevent="handleDrop"
        class="border-2 border-dashed p-6 rounded text-center transition mb-4"
        :class="isDragging ? 'border-gray-200 bg-gray-200 dark:bg-gray-500' : 'border-gray-300'">
        <p class="text-gray-800 dark:text-white">{{ t('DragJSONFileHere') }}</p>
        <p class="text-sm text-gray-500 dark:text-gray-400">({{ t('OrUseButton') }})</p>
      </div>

      <p class="block font-medium my-3 text-gray-900 dark:text-white">{{ t('JSONSourceFormat') }}</p>
      <SelectForm v-model="storeConvert.selectedJSONSchema" :items="storeConvert.jsonSchema" placeholder="&nbsp;"
        class="w-full bg-red-200" />

      <div class="flex flex-wrap sm:flex-nowrap gap-2 mt-5">
        <Button v-if="!isEditing" @click="editJson" class="w-full mb-3">{{ t('EditJSONManually') }}</Button>
        <div v-else class="flex flex-wrap sm:flex-nowrap gap-2 max-w-sm w-full">
          <Button @click="saveChanges()" class="w-full mx-auto">{{ t('SaveChanges') }}</Button>
          <Button @click="cancelChanges()" class="w-full mx-auto">{{ t('CancelChanges') }}</Button>
        </div>
        <Button @click="previewJson" class="w-full mb-3">{{ t('PreviewJSON') }}</Button>
        <Button @click="next" class="w-full mb-3">{{ t('Next') }}</Button>
      </div>
    </div>

    <div class="mb-4 w-full" v-if="isEditing">
      <p class="block font-medium my-3 text-gray-900 dark:text-white text-center">{{ t('EditJSONManually') }}</p>
      <div class="w-full max-w-5xl mx-auto">
        <textarea v-model="copyInputContent" rows="25"
          class="w-full border rounded p-2 bg-gray-50 dark:bg-gray-700 dark:text-white"></textarea>
      </div>
    </div>

    <PreviewJson :isVisible="showModal" :json="formattedJson" @close="showModal = false" :title="t('PreviewJSON')" />
  </div>
</template>
