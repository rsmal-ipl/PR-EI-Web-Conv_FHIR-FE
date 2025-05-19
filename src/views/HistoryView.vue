<script setup>
import { ref, onMounted, watch } from 'vue';
import { useConvertStore } from '@/stores/convert';
import { useRouter } from 'vue-router';
import { toast } from '@/components/ui/toast';
import PageHeader from '@/components/PageHeader.vue';
import Button from '@/components/ui/button/Button.vue'
import SelectForm from '@/components/common/SelectForm.vue'
import Input from '@/components/ui/input/Input.vue';
import { useAuthStore } from '@/stores/auth.js'
import Label from '@/components/ui/label/Label.vue';
import Checkbox from '@/components/ui/checkbox/Checkbox.vue';
import { useI18n } from 'vue-i18n'

const { t } = useI18n();
const storeConvert = useConvertStore();
const router = useRouter();
const storeAuth = useAuthStore();

const filters = ref({
    userName: '',
    outputFormat: '',
    fhirVersion: '',
    resource: '',
    dateFrom: '',
    dateTo: '',
    showAll: false
});

const conversions = ref([]);
const pagination = ref({ totalCount: 0, totalPages: 1, page: 1, pageSize: 10 });

const loadConversions = async () => {
    try {
        const { page, pageSize } = pagination.value;
        const data = await storeConvert.getAllConversions({
            ...filters.value,
            page,
            pageSize
        });
        conversions.value = data.data;
        Object.assign(pagination.value, data);
    } catch {
        toast({ title: t('Error'), description: t('ErrorLoadingConversions'), variant: 'destructive' });
    }
};

const changePage = (p) => {
    if (p >= 1 && p <= pagination.value.totalPages) {
        pagination.value.page = p;
        loadConversions();
    }
};

watch(filters, () => { pagination.value.page = 1; loadConversions(); }, { deep: true });

onMounted(() => {
    if (!storeAuth.user) {
        router.push("/login")
        return
    }
    loadConversions();
});
</script>

<template>

    <div class="flex flex-col justify-center items-center py-12 px-5 lg:px-8">
        <PageHeader :title="t('ConversionHistory')" />

        <div class="grid md:grid-cols-2 gap-4 w-full max-w-4xl my-6 items-end">
            <div class="flex gap-2" v-if="filters.showAll && storeAuth.user?.roles?.includes('Admin')">
                <Input v-model="filters.userName" :placeholder="t('Username')" class="font-semibold !placeholder-gray-500" />
                <Button v-if="filters.userName" @click="filters.userName = ''" class="w-fit p-3">X</Button>
            </div>
            <div class="flex gap-2">
                <SelectForm v-model="filters.outputFormat" :items="storeConvert.options" :placeholder="t('OutputFormat')"
                    class="w-full" />
                <Button v-if="filters.outputFormat" @click="filters.outputFormat = ''" class="w-fit p-3">X</Button>
            </div>
            <div class="flex gap-2">
                <SelectForm v-model="filters.fhirVersion" :items="storeConvert.FHIRversion" :placeholder="t('FHIRVersion')"
                    class="w-full" />
                <Button v-if="filters.fhirVersion" @click="filters.fhirVersion = ''" class="w-fit p-3">X</Button>
            </div>
            <div class="flex gap-2">
                <SelectForm v-model="filters.resource" :items="storeConvert.resources" :placeholder="t('Resource')"
                    class="w-full" />
                <Button v-if="filters.resource" @click="filters.resource = ''" class="w-fit p-3">X</Button>
            </div>            
            <div>
                <Label class="mx-1 text-sm font-medium text-gray-900 dark:text-white">{{ t('DateFrom') }}</Label>
                <div class="flex gap-2">
                    <Input type="date" v-model="filters.dateFrom" class="input" />
                    <Button v-if="filters.dateFrom" @click="filters.dateFrom = ''" class="w-fit p-3">X</Button>
                </div>
            </div>
            <div>
                <Label class="mx-1 text-sm font-medium text-gray-900 dark:text-white">{{ t('DateTo') }}</Label>
                <div class="flex gap-2">
                    <Input type="date" v-model="filters.dateTo" class="input" />
                    <Button v-if="filters.dateTo" @click="filters.dateTo = ''" class="w-fit p-3">X</Button>
                </div>
            </div>
        </div>
        <div class="flex items-center justify-center space-x-2 mb-5" v-if="storeAuth.user.roles.includes('Admin')">
            <Checkbox id="showAll" v-model="filters.showAll" v-if="storeAuth.user?.roles?.includes('Admin')" />
            <Label for="showAll" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {{ t('ShowAllConversions') }}
            </Label>
        </div>

        <div v-if="conversions?.length > 0" class="w-full">
            <div class="w-full overflow-x-auto">
                <table
                    class="min-w-[900px] text-sm mx-auto text-left border text-center bg-white dark:bg-darkSecondary dark:text-white">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th class="py-3 px-6" v-if="storeAuth.user?.roles?.includes('User') || (storeAuth.user?.roles?.includes('Admin') && filters.showAll)">{{t('User')}}</th>
                            <th class="py-3 px-6">{{ t('ConversionDate') }}</th>
                            <th class="py-3 px-6">{{ t('Resource') }}</th>
                            <th class="py-3 px-6">{{ t('FHIRVersion') }}</th>
                            <th class="py-3 px-6">{{ t('JSONSourceFormat') }}</th>
                            <th class="py-3 px-6">{{ t('OutputFormat') }}</th>
                            <th class="py-3 px-6">{{ t('Details') }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="conv in conversions" :key="conv.id"
                            class="bg-white dark:bg-darkSecondary dark:text-white border-b">
                            <td class="py-4 px-2" v-if="storeAuth.user?.roles?.includes('User') || (storeAuth.user?.roles?.includes('Admin') && filters.showAll)">{{ conv.userName }}</td>
                            <td class="py-4 px-2">{{ new Date(conv.createdAtUtc).toLocaleString() }}</td>
                            <td class="py-4 px-2">{{ conv.resource }}</td>
                            <td class="py-4 px-2">{{ conv.fhirVersion }}</td>
                            <td class="py-4 px-2">{{ conv.jsonSourceFormat }}</td>
                            <td class="py-4 px-2">{{ conv.outputFormat }}</td>
                            <td class="py-4 px-2 cursor-pointer"
                                @click="router.push({ name: 'Conversion', params: { id: conv.id } })">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                    stroke-width="1.5" stroke="currentColor" class="size-6 mx-auto">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                </svg>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="flex justify-center items-center flex-wrap gap-5 px-5 mx-auto mt-5 mb-10 max-w-4xl">
                <Button @click="changePage(pagination.page - 1)" :disabled="pagination.page === 1">
                    {{ t('PreviousPage') }}
                </Button>
                <span class="text-sm dark:text-white text-black">
                    {{t('Page')}} {{ pagination.page }} : {{ pagination.totalPages }} ({{ t('Total') }}:
                    {{ pagination.totalCount }})
                </span>
                <Button @click="changePage(pagination.page + 1)" :disabled="pagination.page === pagination.totalPages">
                    {{ t('NextPage') }}
                </Button>
            </div>
        </div>
        <div v-else class="flex flex-col justify-center items-center mt-5">
            <p class="text-lg text-gray-500 dark:text-white">{{ t('NoConversionsFound') }}</p>
        </div>
    </div>
</template>
