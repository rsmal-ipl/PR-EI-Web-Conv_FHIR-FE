import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useToast } from '@/components/ui/toast/use-toast'
import { useI18n } from 'vue-i18n'

export const useErrorStore = defineStore('error', () => {
    const { toast } = useToast()
    const { t } = useI18n()

    const _message = ref('');
    const _fieldErrorMessages = ref([]);
    const _statusCode = ref(0)
    const _title = ref('')

    const message = computed(() => {
        return _message.value.trim()
    })

    const statusCode = computed(() => {
        return _statusCode.value
    })

    const title = computed(() => {
        return _title.value.trim()
    })    

    const fieldMessage = (fieldName) => {
        const errorsOfField = _fieldErrorMessages.value ? _fieldErrorMessages.value[fieldName] : ''
        return errorsOfField ? errorsOfField[0] : '';
    }

    const resetMessages = () => {
        _message.value = ''
        _fieldErrorMessages.value = [];
        _statusCode.value = 0
        _title.value = ''
    }
    
    const setErrorMessages = (mainMessage, fieldMessages, status = 0, titleMessage = '') => {
        _message.value = mainMessage
        _fieldErrorMessages.value = fieldMessages;
        _statusCode.value = status
        _title.value = titleMessage

        let toastMessage = mainMessage
        switch (status) {
            case 401:
                toastMessage =  mainMessage || t('Unauthorized')
                break
            case 403:
                toastMessage = mainMessage || t('Forbidden')
                break
            case 404:
                toastMessage = mainMessage || t('ResourceNotFound')
                break
            case 422:
                toastMessage = t('DataIsInvalid')
                break
            default:
                toastMessage = mainMessage || t('AnErrorOccurred')
        }
        toast({
                title: titleMessage,
                description: toastMessage,
                variant: 'destructive'
            })
    }
    return {
        message, statusCode, title,
        fieldMessage, resetMessages, setErrorMessages
    }
})