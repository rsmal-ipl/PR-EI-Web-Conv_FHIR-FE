import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useToast } from '@/components/ui/toast/use-toast'
import { useRouter } from "vue-router";


export const useConvertStore = defineStore('convert', () => {
    const { toast } = useToast()
    const router = useRouter();

    const jsonText = ref(null)

    return {
        jsonText
    }
})