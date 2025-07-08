<script setup>
import { ref, onMounted } from 'vue'
import PageHeader from '@/components/PageHeader.vue';
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth.js'
import { useRouter } from 'vue-router'
import BarChart from '@/components/charts/BarChart.vue'
import PieChart from '@/components/charts/PieChart.vue'
import axios from 'axios';
import BoxPlot from '@/components/charts/BoxPlot.vue';
import { computed } from 'vue'

const storeAuth = useAuthStore()
const { t } = useI18n()
const router = useRouter()
const statistics = ref(null)
const globalStatistics = ref(null)

const barColors = ['#0097A7'];
const pieResourceColors = ['#1A237E'];
const pieFhirColors = ['#D32F2F', '#FF3D00', '#B71C1C', '#C2185B'];
const pieSourceColors = ['#2E7D32', '#76FF03', '#1B5E20', '#00C853'];
const userBarColors = ['#00ACC1'];

const examsPerPatientData = computed(() => {
    const epp = globalStatistics.value?.exams_per_patient
    if (!epp) return []

    const meanVal = epp.mean ?? (epp.min + epp.q1 + epp.median + epp.q3 + epp.max) / 5

    return [
        {
            label: "Q:" + epp.q1 + "-" + epp.q3 + "     Median:" + epp.median,
            min: epp.min,
            q1: epp.q1,
            median: epp.median,
            q3: epp.q3,
            max: epp.max,
            mean: meanVal,
        },
        {
            label: "Q:" + 3 + "-" + 9 + "     Median:" + epp.median,
            min: 1,
            q1: 3,
            median: 6,
            q3: 9,
            max: 12,
            mean: 5,
        },
        {
            label: "Q:" + 4 + "-" + 10 + "     Median:" + epp.median,
            min: 2,
            q1: 4,
            median: 8,
            q3: 10,
            max: 14,
            mean: 6,
        },
        {
            label: "Q:" + 7 + "-" + 12 + "     Median:" + epp.median,
            min: 2,
            q1: 7,
            median: 11,
            q3: 12,
            max: 17,
            mean: 5,
        },
    ]
})

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
        statistics.value = response.data.other;
        globalStatistics.value = response.data.global;
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

        <div v-if="statistics?.totalConversions != 0" class="w-full p-4 rounded">


            <h1 v-if="statistics?.charts" class="text-lg font-bold mt-4 text-center dark:text-white">{{ t('ConversionsLast30Days') }}</h1>

            <BarChart v-if="statistics?.charts" :labels="statistics.charts.conversionsPerDay.labels"
                :values="statistics.charts.conversionsPerDay.values"
                :colors="barColors.slice(0, statistics.charts.conversionsPerDay.labels.length)" :maxWidth="'700px'"
                :height="'300px'" :chartTitle="t('TotalConversions')" />
                
            <h1 v-if="statistics?.charts" class="text-lg font-bold text-center mt-5 dark:text-white">{{ t('ResourceDistribution') }}</h1>
            <BarChart v-if="statistics?.charts" :labels="statistics.charts.resourceDistribution.labels"
                :values="statistics.charts.resourceDistribution.values"
                :colors="pieResourceColors.slice(0, statistics.charts.resourceDistribution.labels.length)"
                :maxWidth="'700px'" :height="'400px'" :chartTitle="t('TotalConversions')" />

            <div class="sm:flex flex-wrap justify-center items-center mt-8 w-full">
                <div v-if="statistics?.charts">
                    <h1 class="text-lg font-bold text-center mt-5 dark:text-white">{{ t('FHIRVersion') }}</h1>
                    <PieChart :labels="statistics.charts.fhirVersionDistribution.labels"
                        :values="statistics.charts.fhirVersionDistribution.values"
                        :colors="pieFhirColors.slice(0, statistics.charts.fhirVersionDistribution.labels.length)"
                        :maxWidth="'400px'" :height="'300px'" />
                </div>
                <div v-if="statistics?.charts">
                    <h1 class="text-lg font-bold text-center mt-5 dark:text-white">{{ t('JSONSourceFormat') }}</h1>
                    <PieChart :labels="statistics.charts.jsonSourceFormatDistribution.labels"
                        :values="statistics.charts.jsonSourceFormatDistribution.values"
                        :colors="pieSourceColors.slice(0, statistics.charts.jsonSourceFormatDistribution.labels.length)"
                        :maxWidth="'400px'" :height="'300px'" />
                </div>
            </div>

            <div class="sm:flex flex-wrap justify-center items-center mt-8 w-full">
                <div class="flex flex-wrap justify-center items-center mt-5 w-full">
                    <div class="w-full" v-if="statistics?.charts">
                        <h1 class="text-lg font-bold text-center dark:text-white">{{ t('ConversionsByUser') }}</h1>
                        <BarChart v-if="statistics?.charts" :labels="statistics.charts.conversionsByUser.labels"
                            :values="statistics.charts.conversionsByUser.values"
                            :colors="userBarColors.slice(0, statistics.charts.conversionsByUser.labels.length)"
                            :maxWidth="'700px'" :height="'300px'" :chartTitle="t('TotalConversions')" />
                    </div>
                </div>

                <div class="mt-12 w-full max-w-4xl" v-if="globalStatistics?.ages?.frequency">
                    <h1 class="text-lg font-bold text-center dark:text-white">{{ t('AgeFrequency') }}</h1>
                    <BarChart :labels="Object.keys(globalStatistics.ages.frequency)"
                        :values="Object.values(globalStatistics.ages.frequency)"
                        :colors="barColors.slice(0, Object.keys(globalStatistics.ages.frequency).length)"
                        :maxWidth="'700px'" :height="'350px'" :chartTitle="t('AgeFrequency')" />
                </div>
            </div>

            <div class="mt-12 w-full max-w-4xl mx-auto" v-if="globalStatistics?.exams?.counts">
                <h1 class="text-lg font-bold text-center dark:text-white">{{ t('ExamType') }}</h1>
                <PieChart :labels="Object.keys(globalStatistics.exams.counts)"
                    :values="Object.values(globalStatistics.exams.counts)"
                    :colors="pieResourceColors.slice(0, Object.keys(globalStatistics.exams.counts).length)"
                    :maxWidth="'600px'" :height="'350px'" :chartTitle="t('ExamType')" />
            </div>

            <div class="mt-12 w-full max-w-4xl mx-auto" v-if="globalStatistics?.exams_by_date?.counts">
                <h1 class="text-lg font-bold text-center dark:text-white">{{ t('DateFrequency') }}</h1>
                <BarChart :labels="Object.keys(globalStatistics.exams_by_date.counts)"
                    :values="Object.values(globalStatistics.exams_by_date.counts)"
                    :colors="barColors.slice(0, Object.keys(globalStatistics.exams_by_date.counts).length)"
                    :maxWidth="'700px'" :height="'350px'" :chartTitle="t('DateFrequency')" />
            </div>

            <div class="mt-12 w-full max-w-4xl mx-auto" v-if="examsPerPatientData.length">
                <h1 class="text-lg font-bold text-center dark:text-white">{{ t('PacientFrequency') }}</h1>
                <BoxPlot :chartData="examsPerPatientData" :chartTitle="t('PacientFrequency')" />
            </div>

            <div class="mt-12 w-full max-w-4xl p-4 rounded mx-auto" v-if="globalStatistics?.status_ratio">
                <h1 class="text-lg font-bold text-center mb-4 dark:text-white">{{ t('StatusRatio') }}</h1>
                <div class="flex justify-center gap-10 text-center">
                    <div class="bg-white shadow-md rounded-lg p-4">
                        <h2 class="text-xl font-semibold text-center">{{ t('StatusRatioFinal') }}</h2>
                        <p class="text-2xl font-bold text-center mt-2">{{ globalStatistics?.status_ratio?.final ?? 0 }}
                        </p>
                    </div>
                    <div class="bg-white shadow-md rounded-lg p-4">
                        <h2 class="text-xl font-semibold text-center">{{ t('StatusRatioPreliminary') }}</h2>
                        <p class="text-2xl font-bold text-center mt-2">{{ globalStatistics?.status_ratio?.preliminary ??
                            0 }}</p>
                    </div>
                    <div class="bg-white shadow-md rounded-lg p-4">
                        <h2 class="text-xl font-semibold text-center">{{ t('StatusRatioTotal') }}</h2>
                        <p class="text-2xl font-bold text-center mt-2">{{ globalStatistics?.status_ratio?.total ?? 0 }}
                        </p>
                    </div>
                </div>
            </div>

            <div class="flex flex-col justify-center items-center gap-4 mt-8" v-if="globalStatistics?.unique_patients">
                <div class="flex flex-wrap justify-center items-center gap-4">
                    <div class="bg-white shadow-md rounded-lg p-4">
                        <h2 class="text-xl font-semibold text-center">{{ t('UniquePacients') }}</h2>
                        <p class="text-2xl font-bold text-center mt-2">{{ globalStatistics?.unique_patients ?? 0 }}</p>
                    </div>
                </div>
            </div>

        </div>

        <div v-else class="text-red-500 text-2xl font-bold mt-8">
            <h1>{{ t('NoStatistics') }}</h1>
        </div>

    </div>
</template>
