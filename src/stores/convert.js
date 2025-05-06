import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useToast } from '@/components/ui/toast/use-toast'
import { useRouter } from "vue-router";


export const useConvertStore = defineStore('convert', () => {
    const { toast } = useToast()
    const router = useRouter();

    const jsonText = ref(null)

    const jsonSchema = [
        { label: 'HL7v2', value: 'HL7 v2' },
        { label: 'CDA', value: 'CDA' },
        { label: 'Custom', value: 'Custom' },
    ]

    const FHIRversion = [
        { label: 'FHIRR4', value: 'FHIR R4' },
        { label: 'STU3', value: 'STU3' },
        { label: 'Other', value: 'Other Version' },
    ]

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

    return {
        jsonText, FHIRversion, jsonSchema, resources, options,
    }
})