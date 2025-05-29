<script setup>
import { ref, onMounted } from 'vue'
import PageHeader from '@/components/PageHeader.vue';
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth.js'
import { useRouter } from 'vue-router'
import BarChart from '@/components/charts/BarChart.vue'
import PieChart from '@/components/charts/PieChart.vue'
import axios from 'axios';

const storeAuth = useAuthStore()
const { t } = useI18n()
const router = useRouter()
const statistics = ref(null)

const barColors = ['#0097A7'];
const pieResourceColors = ['#1A237E'];
const pieFhirColors = ['#D32F2F', '#FF3D00', '#B71C1C', '#C2185B'];
const pieSourceColors = ['#2E7D32', '#76FF03', '#1B5E20', '#00C853'];
const userBarColors = ['#00ACC1'];

onMounted(() => {
    if (!storeAuth.user) {
        router.push({ name: 'login' });
        return;
    }

    if (storeAuth.user?.roles?.includes('User')) {
        router.push({ name: 'home' });
        return;
    }

    axios.get('/Convert/stats').then(response => {
        statistics.value = response.data;
    }).catch(error => {
        console.error('Error fetching statistics:', error);
    });
});
</script>

<template>
    <div class="flex flex-col justify-center items-center py-12 px-5 lg:px-8 mx-auto">
        <PageHeader :title="t('Statistics')" />

        <div class="flex flex-col justify-center items-center gap-4 mt-8">
            <div class="flex flex-wrap justify-center items-center gap-4">
                <div class="bg-white shadow-md rounded-lg p-4">
                    <h2 class="text-xl font-semibold text-center">{{ t('TotalConversions') }}</h2>
                    <p class="text-2xl font-bold text-center mt-2">{{ statistics?.totalConversions || 0 }}</p>
                </div>
            </div>
        </div>

        <h1 class="text-lg font-bold mt-4 text-center">{{ t('ConversionsLast30Days') }}</h1>

        <BarChart v-if="statistics?.charts" :labels="statistics.charts.conversionsPerDay.labels"
            :values="statistics.charts.conversionsPerDay.values"
            :colors="barColors.slice(0, statistics.charts.conversionsPerDay.labels.length)" :maxWidth="'700px'"
            :height="'300px'" :chartTitle="t('TotalConversions')"/>

        <h1 class="text-lg font-bold text-center mt-5">{{ t('ResourceDistribution') }}</h1>
        <BarChart v-if="statistics?.charts" :labels="statistics.charts.resourceDistribution.labels"
            :values="statistics.charts.resourceDistribution.values"
            :colors="pieResourceColors.slice(0, statistics.charts.resourceDistribution.labels.length)"
            :maxWidth="'700px'" :height="'400px'" :chartTitle="t('TotalConversions')" />

        <div class="sm:flex flex-wrap justify-center items-center mt-8 w-full">
            <div>
                <h1 class="text-lg font-bold text-center mt-5">{{ t('FHIRVersion') }}</h1>
                <PieChart v-if="statistics?.charts" :labels="statistics.charts.fhirVersionDistribution.labels"
                    :values="statistics.charts.fhirVersionDistribution.values"
                    :colors="pieFhirColors.slice(0, statistics.charts.fhirVersionDistribution.labels.length)"
                    :maxWidth="'400px'" :height="'300px'"/>
            </div>
            <div>
                <h1 class="text-lg font-bold text-center mt-5">{{ t('JSONSourceFormat') }}</h1>
                <PieChart v-if="statistics?.charts" :labels="statistics.charts.jsonSourceFormatDistribution.labels"
                    :values="statistics.charts.jsonSourceFormatDistribution.values"
                    :colors="pieSourceColors.slice(0, statistics.charts.jsonSourceFormatDistribution.labels.length)"
                    :maxWidth="'400px'" :height="'300px'"/>
            </div>
        </div>

        <div class="flex flex-wrap justify-center items-center mt-5 w-full">
            <div class="w-full" v-if="statistics?.charts">
                <h1 class="text-lg font-bold text-center">{{ t('ConversionsByUser') }}</h1>
                <BarChart v-if="statistics?.charts" :labels="statistics.charts.conversionsByUser.labels"
                    :values="statistics.charts.conversionsByUser.values"
                    :colors="userBarColors.slice(0, statistics.charts.conversionsByUser.labels.length)"
                    :maxWidth="'700px'" :height="'300px'" :chartTitle="t('TotalConversions')"/>
            </div>
        </div>
    </div>
</template>
