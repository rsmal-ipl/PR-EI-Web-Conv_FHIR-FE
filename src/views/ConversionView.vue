<script setup>
import { ref, onMounted, inject, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useConvertStore } from '@/stores/convert'
import { toast } from '@/components/ui/toast'
import PageHeader from '@/components/PageHeader.vue'
import PreviewJson from '@/components/PreviewJson.vue'
import { useI18n } from 'vue-i18n'
import Button from '@/components/ui/button/Button.vue'
import { useAuthStore } from '@/stores/auth.js'
import EditJson from '@/components/EditJson.vue'

const alertDialog = inject('alertDialog')
const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const convertStore = useConvertStore()
const storeAuth = useAuthStore()

const id = ref(route.params.id ?? null)
const loading = ref(true)
const conversion = ref(null)

const showModal = ref(false)
const modalContent = ref('')
const modalTitle = ref('')

const isEditing = ref(false)
const copyOutputContent = ref('')

const loadConversion = async () => {
    try {
        loading.value = true

        const result = await convertStore.getConversion(id.value)
        conversion.value = result

    } catch (err) {
        toast({
            title: t('Error'),
            description: t('ErrorLoadingConversionDetails'),
            variant: 'destructive',
        })
        router.push({ name: 'History' })
    } finally {
        loading.value = false
    }
}

const previewInput = () => {
    if (!conversion.value.originalContent) {
        toast({
            title: t('InputContentNotAvailableTitle'),
            description: t('InputContentNotAvailableMessage'),
            variant: 'destructive'
        })
        return
    }
    modalTitle.value = t('Input')
    modalContent.value = conversion.value.originalContent
    showModal.value = true
}

const previewOutput = () => {
    if (!conversion.value.convertedContent) {
        toast({
            title: t('OutputContentNotAvailableTitle'),
            description: t('OutputContentNotAvailableMessage'),
            variant: 'destructive'
        })
        return
    }
    modalTitle.value = t('Output')
    modalContent.value = conversion.value.convertedContent
    showModal.value = true
}

const minHeight = 8 * 24

const autoResize = () => {
    const el = autoResizeTextarea.value
    if (el) {
        el.style.height = 'auto'
        el.style.height = Math.max(el.scrollHeight, minHeight) + 'px'
    }
}

const autoResizeTextarea = ref(null)

watch(copyOutputContent, () => {
    nextTick(() => autoResize())
})

const edit = () => {
    console.log("Edit output clicked")
    if (!conversion.value.convertedContent) {
        toast({
            title: t('OutputContentNotAvailableTitle'),
            description: t('OutputContentNotAvailableMessage'),
            variant: 'destructive'
        })
        return
    }

    isEditing.value = !isEditing.value
    const content = conversion.value.convertedContent
    copyOutputContent.value = typeof content === 'object' ? JSON.stringify(content, null, 2) : content
    nextTick(() => autoResize())
}
const closeEditModal = () => {
    isEditing.value = false
    copyOutputContent.value = conversion.value.convertedContent
}

const saveChangesConfirmed = async () => {
    const result = await convertStore.changeOutput(copyOutputContent.value, id.value)
    if (result) {
        isEditing.value = false
        loadConversion()
    }
}

const saveChanges = async () => {
    if (conversion.value.outputFormat.toUpperCase().trim() === 'JSON') {
        try {
            const json = JSON.parse(copyOutputContent.value)
            copyOutputContent.value = JSON.stringify(json, null, 2)
        } catch (e) {
            toast({
                title: t('InvalidJsonFormat'),
                description: t('InvalidJsonFormatMessage'),
                variant: 'destructive'
            })
            return
        }
    }
    alertDialog.value.open(
        saveChangesConfirmed,
        t('AreYouSure'),
        t('Cancel'),
        "Yes, Save",
        "Are you sure you want to apply the changes?", ""
    )
}

const cancelChangesConfirmed = () => {
    isEditing.value = false
    copyOutputContent.value = conversion.value.originalContent
}

const cancelChanges = () => {
    alertDialog.value.open(
        cancelChangesConfirmed,
        t('AreYouSure'),
        "No",
        "Yes, Cancel",
        "Are you sure you want to cancel the changes? This will delete all unsaved changes.",
        ""
    )
}

const deleteConversion =  () => {
    alertDialog.value.open(
        deleteConversionConfirmed,
        t('AreYouSure'),
        "No",
        "Yes, Delete",
        "Are you sure you want to delete this conversion?",
        ""
    )
}

const deleteConversionConfirmed = async () => {
    await convertStore.deleteConversion(id.value)
}

onMounted(() => {
    if (!storeAuth.user) {
        router.push("/login")
        return
    }
    if (!id.value) {
        router.push({ name: 'History' })
        return
    }
    loadConversion()
})
</script>

<template>
  <div class="flex flex-col justify-center items-center py-12 px-5lg:px-8 max-w-3xl mx-auto">
    <PageHeader :title="t('ConversionDetails')" />

    <div class="flex flex-wrap sm:flex-nowrap justify-center gap-2 mt-5 sm:mb-0 max-w-sm w-full">
      <Button @click="previewInput" class="w-full mx-auto">{{ t('PreviewInput') }}</Button>
      <Button @click="previewOutput" class="w-full mx-auto">{{ t('PreviewOutput') }}</Button>
    </div>

    <h1 class="mt-5 font-bold" v-if="conversion?.message" :class="{ 'text-red-500': conversion?.isSuccess == false }">{{ conversion?.message }}</h1>

    <div class="overflow-x-auto relative rounded-lg mt-5 w-full">
      <table class="mx-auto text-sm text-left border text-center bg-white dark:bg-darkSecondary dark:text-white">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th class="py-3 px-6">{{ t('Property') }}</th>
            <th class="py-3 px-6">{{ t('Value') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="conversion">
            <td class="py-3 px-6">{{ t('User') }}</td>
            <td class="py-3 px-6">{{ conversion.userName }}</td>
          </tr>
          <tr v-if="conversion">
            <td class="py-3 px-6">{{ t('ConversionDate') }}</td>
            <td class="py-3 px-6"> {{ new Date(conversion.createdAtUtc).toLocaleString() }}</td>
          </tr>
          <tr v-if="conversion">
            <td class="py-3 px-6">{{ t('JSONSourceFormat') }}</td>
            <td class="py-3 px-6">{{ conversion.jsonSourceFormat }}</td>
          </tr>
          <tr v-if="conversion">
            <td class="py-3 px-6">{{ t('Resource') }}</td>
            <td class="py-3 px-6">{{ conversion.resource }}</td>
          </tr>
          <tr v-if="conversion">
            <td class="py-3 px-6">{{ t('FHIRVersion') }}</td>
            <td class="py-3 px-6">{{ conversion.fhirVersion }}</td>
          </tr>
          <tr v-if="conversion">
            <td class="py-3 px-6">{{ t('OutputFormat') }}</td>
            <td class="py-3 px-6">{{ conversion.outputFormat }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="flex flex-wrap sm:flex-nowrap justify-center gap-2 mt-5 sm:mb-0 max-w-sm w-full"> 
      <Button 
        @click="deleteConversion" 
        class="w-full mx-auto" 
        variant="destructive" 
        v-if="storeAuth.user?.roles?.includes('Owner') || storeAuth.user?.roles?.includes('Admin')">
        Delete Conversion
      </Button>
      <Button v-if="storeAuth.user?.roles?.includes('Owner') || storeAuth.user?.roles?.includes('Admin')" @click="edit()" class="w-full mx-auto" :disabled="!conversion?.originalContent">{{ t('EditOutput') }}</Button>
    </div>

    <Button @click="router.push({ name: 'History' })" class="w-fit mx-auto mt-5">Return</Button>

    <EditJson
      :isVisible="isEditing"
      :title="t('EditOutput')"
      v-model="copyOutputContent"
      @save="saveChanges"
      @close="cancelChanges"
    />

    <PreviewJson :isVisible="showModal" :json="modalContent" @close="showModal = false" :title="modalTitle" />
  </div>
</template>
