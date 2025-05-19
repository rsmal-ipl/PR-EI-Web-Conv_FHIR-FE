<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useConvertStore } from '@/stores/convert'
import { toast } from '@/components/ui/toast'
import PageHeader from '@/components/PageHeader.vue'
import PreviewJson from '@/components/PreviewJson.vue'
import { useI18n } from 'vue-i18n'
import Button from '@/components/ui/button/Button.vue'
import { useAuthStore } from '@/stores/auth.js'

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
    if (!conversion.value.outputContent) {
        toast({
            title: t('OutputContentNotAvailableTitle'),
            description: t('OutputContentNotAvailableMessage'),
            variant: 'destructive'
        })
        return
    }
    modalTitle.value = t('Output')
    modalContent.value = conversion.value.outputContent
    showModal.value = true
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
    <div class="flex flex-col justify-center items-center py-12 px-5 lg:px-8 max-w-fit mx-auto">
        <PageHeader :title="t('ConversionDetails')" />

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

        <div class="flex flex-wrap sm:flex-nowrap gap-2 mt-5 sm:mb-0 mb-2 w-full">
            <Button @click="previewInput" class="w-full mb-3">{{ t('PreviewInput') }}</Button>
            <Button @click="previewOutput" class="w-full mb-3">{{ t('PreviewOutput') }}</Button>
        </div>

        <Button @click="router.push({ name: 'History' })" class="w-full">{{ t('Cancel') }}</Button>

        <PreviewJson :isVisible="showModal" :json="modalContent" @close="showModal = false" :title="modalTitle" />
    </div>
</template>
