<script setup>
import Input from '@/components/ui/input/Input.vue'
import Button from '@/components/ui/button/Button.vue'
import { ref } from 'vue'
import { toast } from '@/components/ui/toast'

const jsonText = ref('')
const showModal = ref(false)
const formattedJson = ref('')
const isDragging = ref(false)

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
      title: "Invalid file type!",
      description: "Only JSON files are accepted.",
      variant: 'destructive'
    })
  }
}

const previewJson = () => {
  try {
    const json = JSON.parse(jsonText.value)
    formattedJson.value = JSON.stringify(json, null, 2)
    showModal.value = true
  } catch (e) {
    toast({
      title: "Invalid JSON format!",
      description: "Please check your input.",
      variant: 'destructive'
    })
  }
}

const inputFile = ref(null)

const removeFile = () => {
  jsonText.value = ''
  showModal.value = false

  if (inputFile.value?.inputRef) {
    inputFile.value.inputRef.value = ''
  }
}
</script>

<template>
  <div class="flex flex-col justify-center items-center py-12 px-5 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <span class="text-5xl block w-fit mx-auto select-none">⚙️</span>
      <h2 class="mt-5 text-center text-2xl/9 font-bold tracking-tight text-gray-900 dark:text-white">Convert</h2>
    </div>

    <div class="p-6 max-w-3xl w-full">
      <div class="mb-4">
        <p class="block font-medium my-3 text-gray-900 dark:text-white">Load JSON File</p>
        <div class="flex">
            <Input type="file" accept="application/json" @change="handleFileUpload" ref="inputFile" class="p-2 mb-3 dark:bg-white" />
            <Button v-if="jsonText" @click="removeFile" class="ml-2">Clear</Button>
        </div>
      </div>

      <div @dragover.prevent="isDragging = true" @dragleave.prevent="isDragging = false" @drop.prevent="handleDrop" class="border-2 border-dashed p-6 rounded text-center transition mb-4"
        :class="isDragging ? 'border-gray-200 bg-gray-200 dark:bg-gray-500' : 'border-gray-300'">
        <p class="text-gray-800 dark:text-white">Drag a JSON file here</p>
        <p class="text-sm text-gray-500 dark:text-gray-400">(or use the button)</p>
      </div>

      <div class="mb-4">
        <p class="block font-medium my-3 text-gray-900 dark:text-white">Edit JSON manually</p>
        <textarea
          v-model="jsonText"
          rows="8"
          class="w-full border rounded p-2 bg-gray-50 dark:bg-gray-700 dark:text-white">
        </textarea>
      </div>

      <Button @click="previewJson" class="w-full mb-3">Preview JSON</Button>
    </div>

    <div v-if="showModal" class="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
      <div class="bg-white dark:bg-gray-900 p-6 rounded max-w-2xl w-full dark:text-white">
        <h1 class="text-xl font-bold mb-4">JSON Preview</h1>
        <pre class="bg-gray-100 dark:bg-gray-800 p-4 text-sm max-h-[60vh] overflow-auto rounded">{{ formattedJson }}</pre>

        <Button @click="showModal = false" class="mt-4">Close</Button>
      </div>
    </div>
  </div>
</template>
