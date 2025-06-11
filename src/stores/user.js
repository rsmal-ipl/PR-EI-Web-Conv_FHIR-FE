import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useToast } from '@/components/ui/toast/use-toast'
import { useI18n } from 'vue-i18n'
import axios from 'axios'
import { useErrorStore } from "@/stores/error.js";


export const useUsersStore = defineStore('users', () => {

    const storeError = useErrorStore()
    const { toast } = useToast()
    const { t } = useI18n()

    const roles = [
        { value: 'Owner', label: 'Owner' },
        { value: 'Admin', label: 'Admin' },
        { value: 'User', label: 'User' },
    ]

    const getAllUsers = async (params = {}) => {
        try {
            const response = await axios.get('/user', { params });
            return response.data;
        } catch (err) {
            toast({
                title: t('Error'),
                description: t('FailedToGetUsers'),
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

    const changeRole = async (userId, role) => {
        try {
            const response = await axios.put(`/user/${userId}`, { Role: role });
            toast({
                title: t('Success'),
                description: t('UserRoleChangedSuccessfully'),
                variant: 'default',
            })
            return;
        } catch (e) {
            storeError.setErrorMessages(e.response.data, e.response.data.errors, e.response.status, "Error");
            return;
        }
    }

    return {
        roles,
        getAllUsers,
        changeRole,
    }
})