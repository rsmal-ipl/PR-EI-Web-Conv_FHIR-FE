import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useToast } from '@/components/ui/toast/use-toast'
import { useRouter } from "vue-router";
import axios from 'axios';
import { useErrorStore } from "@/stores/error.js";

export const useConvertStore = defineStore('convert', () => {
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
        { value: 'CDA', label: 'CDA' },
        { value: 'Custom', label: 'Custom' },
    ]

    const FHIRversion = [
        { value: 'FHIRR4', label: 'FHIR R4' },
        { value: 'STU3', label: 'STU3' },
        { value: 'Other', label: 'Other Version' },
    ]

    const resources = [
        { value: 'Patient', label: 'Patient' },
        { value: 'DiagnosticReport', label: 'Diagnostic Report' },
        { value: 'Encounter', label: 'Encounter' },
        { value: 'Boundle', label: 'Boundle' },
    ]

    const options = [
        { value: 'JSON', label: 'JSON' },
        { value: 'XML', label: 'XML' }
    ]

    const getConversion = async (id) => {
        try {
            const response = await axios.get(`/convert/${id}`);
            return response.data;
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to get conversion details.',
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
                title: 'Error',
                description: 'Failed to get conversions.',
                variant: 'destructive',
            })
            return
        }
    };

    const convert = async() => {
        if (!jsonText.value) {
            toast({
                title: 'Error',
                description: 'Please enter JSON text to convert.',
                variant: 'destructive',
            })
            return
        }
        if (!selectedJSONSchema.value) {
            toast({
                title: 'Error',
                description: 'Please select a JSON schema.',
                variant: 'destructive',
            })
            return
        }
        if (!selectedFHIRVersion.value) {
            toast({
                title: 'Error',
                description: 'Please select a FHIR version.',
                variant: 'destructive',
            })
            return
        }
        if (!selectedResource.value) {
            toast({
                title: 'Error',
                description: 'Please select a resource type.',
                variant: 'destructive',
            })
            return
        }
        if (!selectedOutputFormat.value) {
            toast({
                title: 'Error',
                description: 'Please select an output format.',
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
                title: "Conversion Success!",
                description: "Your conversion was successful. Please check the results.",
            })

            jsonText.value = null
            selectedJSONSchema.value = null
            selectedFHIRVersion.value = null
            selectedResource.value = null
            selectedOutputFormat.value = null

            router.push({name: 'Conversion', params: { id: response.data }})
            return;
        } catch (e) {
            storeError.setErrorMessages(e.response?.data, e.response?.data.errors, e.response?.status, 'Conversion Error')
            toast({
                title: 'Error',
                description: 'Conversion failed. Please try again.',
                variant: 'destructive',
            })
            return false;
        }
    }

    return {
        jsonText, FHIRversion, jsonSchema, resources, options,
        selectedJSONSchema, selectedFHIRVersion, selectedResource, selectedOutputFormat,
        FHIRServerIP,
        convert, getAllConversions, getConversion
    }
})