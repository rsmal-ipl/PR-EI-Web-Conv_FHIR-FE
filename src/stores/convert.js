import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useToast } from '@/components/ui/toast/use-toast'
import { useRouter } from "vue-router";
import axios from 'axios';
import { useErrorStore } from "@/stores/error.js";
import { useI18n } from 'vue-i18n'

export const useConvertStore = defineStore('convert', () => {

    const { t } = useI18n()
    const { toast } = useToast()
    const router = useRouter();
    const storeError = useErrorStore();

    const jsonText = ref(null)
    const selectedJSONSchema = ref(null)
    const selectedFHIRVersion = ref(null)
    const selectedResource = ref(null)
    const selectedOutputFormat = ref(null)
    const FHIRServerIP = ref(null)

    const jsonSchema = [
        { value: 'HL7v2', label: 'HL7 v2' },
        // { value: 'CDA', label: 'CDA' },
        // { value: 'Custom', label: 'Custom' },
    ]

    const FHIRversion = [
        { value: 'FHIRR4', label: 'FHIR R4' },
        // { value: 'STU3', label: 'STU3' },
        // { value: 'Other', label: 'Other Version' },
    ]

    const resources = [
        { value: 'Patient', label: 'Patient' },
        { value: 'DiagnosticReport', label: 'DiagnosticReport' },
        { value: 'Encounter', label: 'Encounter' },
        { value: 'Bundle', label: 'Bundle' },
    ] 
    const options = [
        { value: 'JSON', label: 'JSON' },
        { value: 'XML', label: 'XML'}
    ]

    const deleteConversion = async (id) => {
        try {
            await axios.delete(`/convert/${id}`);
            toast({
                title: t('Success'),
                description: t('ConversionDeletedSuccessfully'),
                variant: 'default',
            })
            router.push('/history')
            return true
        } catch (error) {
            toast({
                title: t('Error'),
                description: t('FailedToDeleteConversion'),
                variant: 'destructive',
            })
            return false
        }
    }

    const changeOutput = async (newOutput, id) => {
        try {
            await axios.put(`/convert/${id}`, { newOutput })
            toast({
                title: t('Success'),
                description: t('OutputContentUpdatedSuccessfully'),
                variant: 'default',
            })
            return true
        } catch (error) {
            console.error('Error changing output:', error);
            toast({
                title: t('Error'),
                description: t('FailedToChangeOutput'),
                variant: 'destructive',
            })
            return false
        }
    }

    const getConversion = async (id) => {
        try {
            const response = await axios.get(`/convert/${id}`);
            return response.data;
        } catch (error) {
            toast({
                title: t('Error'),
                description: t('FailedToGetConversionDetails'),
                variant: 'destructive',
            })
            router.push('/history')
        }
    }

    const getAllConversions = async (params = {}) => {
        try {
            const response = await axios.get('/convert', { params });
            return response.data;
        } catch (err) {
            toast({
                title: t('Error'),
                description: t('FailedToGetAllConversions'),
                variant: 'destructive',
            })
            return {
                data: [],
                totalCount: 0,
                totalPages: 1,
                page: params.page || 1,
                pageSize: params.pageSize || 10,
            }
        }
    };

    const convert = async () => {
        if (!jsonText.value) {
            toast({
                title: t('Error'),
                description: t('PleaseEnterJSONTextToConvert'),
                variant: 'destructive',
            })
            return
        }
        if (!selectedJSONSchema.value) {
            toast({
                title: t('Error'),
                description: t('PleaseSelectJsonSchema'),
                variant: 'destructive',
            })
            return
        }
        if (!selectedResource.value) {
            toast({
                title: t('Error'),
                description: t('PleaseSelectResource'),
                variant: 'destructive',
            })
            return
        }
        if (!selectedFHIRVersion.value) {
            toast({
                title: t('Error'),
                description: t('PleaseSelectFHIRVersion'),
                variant: 'destructive',
            })
            return
        }
        if (!selectedOutputFormat.value) {
            toast({
                title: t('Error'),
                description: t('PleaseSelectOutputFormat'),
                variant: 'destructive',
            })
            return
        }

        try {
            const response = await axios.post('convert', {
                Content: jsonText.value,
                JsonSourceFormat: selectedJSONSchema.value,
                FHIRVersion: selectedFHIRVersion.value,
                Resource: selectedResource.value.label,
                OutputFormat: selectedOutputFormat.value
            })
            toast({
                title: t('ConversionSuccessful'),
                description: t('ConversionSuccessMessage'),
            })

            jsonText.value = null
            selectedJSONSchema.value = null
            selectedFHIRVersion.value = null
            selectedResource.value = null
            selectedOutputFormat.value = null

            router.push({ name: 'Conversion', params: { id: response.data } })
            return;
        } catch (e) {
            storeError.setErrorMessages(e.response?.data, e.response?.data.errors, e.response?.status, 'Conversion Error')
            toast({
                title: t('Error'),
                description: t('ConversionFailed'),
                variant: 'destructive',
            })
            return false;
        }
    }

    return {
        jsonText, FHIRversion, jsonSchema, resources, options,
        selectedJSONSchema, selectedFHIRVersion, selectedResource, selectedOutputFormat, FHIRServerIP,
        convert, getAllConversions, getConversion, changeOutput, deleteConversion
    }
})