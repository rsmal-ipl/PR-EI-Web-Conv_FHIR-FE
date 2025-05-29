<script setup>
import { ref, onMounted, watch, inject} from 'vue';
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

const alertDialog = inject('alertDialog')
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

const deleteConversion =  (id) => {
    alertDialog.value.open(
        () => deleteConversionConfirmed(id),
        t('AreYouSure'),
        "No",
        "Yes, Delete",
        "Are you sure you want to delete this conversion?",
        ""
    )
}

const deleteConversionConfirmed = async (id) => {
    await storeConvert.deleteConversion(id)
    loadConversions()
}

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
                <Input v-model="filters.userName" :placeholder="t('Username')"
                    class="font-semibold !placeholder-gray-500" />
                <Button v-if="filters.userName" @click="filters.userName = ''" class="w-fit p-3">X</Button>
            </div>
            <div class="flex gap-2">
                <SelectForm v-model="filters.outputFormat" :items="storeConvert.options"
                    :placeholder="t('OutputFormat')" class="w-full" />
                <Button v-if="filters.outputFormat" @click="filters.outputFormat = ''" class="w-fit p-3">X</Button>
            </div>
            <div class="flex gap-2">
                <SelectForm v-model="filters.fhirVersion" :items="storeConvert.FHIRversion"
                    :placeholder="t('FHIRVersion')" class="w-full" />
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
        <div class="flex items-center justify-center space-x-2 mb-5" v-if="storeAuth?.user?.roles.includes('Admin')">
            <Checkbox id="showAll" v-model="filters.showAll" v-if="storeAuth.user?.roles?.includes('Admin')" />
            <Label for="showAll"
                class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {{ t('ShowAllConversions') }}
            </Label>
        </div>

        <div v-if="conversions?.length > 0" class="w-full">
            <div class="w-full overflow-x-auto">
                <table
                    class="min-w-[900px] text-sm mx-auto text-left border text-center bg-white dark:bg-darkSecondary dark:text-white">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th class="py-3 sm:px-6" v-if="storeAuth.user?.roles?.includes('Admin') && filters.showAll">
                                {{ t('User') }}</th>
                            <th class="py-3 sm:px-6">{{ t('ConversionDate') }}</th>
                            <th class="py-3 sm:px-6">{{ t('Resource') }}</th>
                            <th class="py-3 sm:px-6">{{ t('FHIRVersion') }}</th>
                            <th class="py-3 sm:px-6">{{ t('JSONSourceFormat') }}</th>
                            <th class="py-3 sm:px-6">{{ t('OutputFormat') }}</th>
                            <th class="py-3 sm:px-6">{{ t('Actions') }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="conv in conversions" :key="conv.id"
                            class="bg-white dark:bg-darkSecondary dark:text-white border-b">
                            <td class="py-4 sm:px-2" v-if="storeAuth.user?.roles?.includes('Admin') && filters.showAll">
                                {{ conv.userName }}</td>
                            <td class="py-4 sm:px-2">{{ new Date(conv.createdAtUtc).toLocaleString() }}</td>
                            <td class="py-4 sm:px-2">{{ conv.resource }}</td>
                            <td class="py-4 sm:px-2">{{ conv.fhirVersion }}</td>
                            <td class="py-4 sm:px-2">{{ conv.jsonSourceFormat }}</td>
                            <td class="py-4 sm:px-2">{{ conv.outputFormat }}</td>
                            <td class="py-4 sm:px-2 cursor-pointer flex justify-center items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" @click="router.push({ name: 'Conversion', params: { id: conv.id } })"
                                    stroke-width="1.5" stroke="currentColor" class="size-6 mx-auto">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                </svg>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" v-if="storeAuth.user?.roles?.includes('Owner') || storeAuth.user?.roles?.includes('Admin')" @click="deleteConversion(conv.id)"
                                    stroke-width="1.5" stroke="currentColor" class="size-6 me-2 ">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
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
                    {{ t('Page') }} {{ pagination.page }} : {{ pagination.totalPages }} ({{ t('Total') }}:
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
