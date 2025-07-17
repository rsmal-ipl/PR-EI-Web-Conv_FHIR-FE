import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useToast } from '@/components/ui/toast/use-toast'
import { useI18n } from 'vue-i18n'

export const useErrorStore = defineStore('error', () => {
  const { toast } = useToast()
  const { t } = useI18n()

  const _message = ref('')
  const _fieldErrorMessages = ref({})
  const _statusCode = ref(0)
  const _title = ref('')

  const message = computed(() => _message.value.trim())
  const statusCode = computed(() => _statusCode.value)
  const title = computed(() => _title.value.trim())

  const fieldMessage = (fieldName) => {
    const list = _fieldErrorMessages.value?.[fieldName] || []
    const msg = list[0] || ''
    const translated = t(msg)
    return translated !== msg ? translated : msg
  }
  
  const fieldMessages = (fieldName) => {
    const list = _fieldErrorMessages.value?.[fieldName] || []
    return list.map(msg => {
      const translated = t(msg)
      return translated !== msg ? translated : msg
    })
  }

  const resetMessages = () => {
    _message.value = ''
    _fieldErrorMessages.value = {}
    _statusCode.value = 0
    _title.value = ''
  }

  const setErrorMessages = (mainMessage, fieldMessagesRaw = {}, status = 0, titleMessage = '') => {
    _message.value = mainMessage
    _fieldErrorMessages.value = fieldMessagesRaw
    _statusCode.value = status
    _title.value = titleMessage

    let translatedMessage = ''

    if (mainMessage) {
      const maybeTranslation = t(mainMessage)
      translatedMessage = maybeTranslation !== mainMessage ? maybeTranslation : mainMessage
    }

    switch (status) {
      case 401:
        translatedMessage = translatedMessage || t('Unauthorized')
        break
      case 403:
        translatedMessage = translatedMessage || t('Forbidden')
        break
      case 404:
        translatedMessage = translatedMessage || t('ResourceNotFound')
        break
      case 422:
        translatedMessage = t('DataIsInvalid')
        break
      default:
        translatedMessage = translatedMessage || t('AnErrorOccurred')
    }

    toast({
      title: titleMessage,
      description: translatedMessage,
      variant: 'destructive'
    })
  }

  return {
    message,
    statusCode,
    title,
    fieldMessage,
    fieldMessages,
    resetMessages,
    setErrorMessages
  }
})
