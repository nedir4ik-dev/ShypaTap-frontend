<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'

const router = useRouter()
const clinics = ref([])
const loading = ref(true)
const error = ref('')

onMounted(async () => {
    try {
        const { data } = await api.getClinics()
        clinics.value = data.data || data || []
    } catch (e) {
        error.value = 'Klinikalaryň maglumatlaryny alyp bolmady.'
    } finally {
        loading.value = false
    }
})

const goToClinicDoctors = (clinicName) => {
    router.push({ path: '/doctors', query: { clinic: clinicName } })
}
</script>

<template>
    <section class="mx-auto max-w-7xl px-4 py-10 space-y-8">
        <div class="text-center max-w-2xl mx-auto space-y-3">
            <span
                class="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider border border-emerald-200/60 dark:border-emerald-800/60">
                <i class="ti ti-building-hospital text-base"></i> Hyzmatdaş Merkezler
            </span>
            <h1 class="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100">
                Lukmançylyk klinikalar
            </h1>
            <p class="text-slate-500 dark:text-slate-400 text-sm md:text-base">
                Şäherimizdäki öňdebaryjy we döwrebap klinika merkezleri bilen tanyş boluň.
            </p>
        </div>

        <div v-if="loading" class="py-20 text-center text-slate-500 space-y-2">
            <i class="ti ti-loader animate-spin text-4xl text-emerald-600"></i>
            <p>Klinikalar ýüklenýär...</p>
        </div>

        <div v-else-if="error"
            class="rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 p-4 text-red-700 dark:text-red-300 text-sm text-center">
            {{ error }}
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="clinic in clinics" :key="clinic.id"
                class="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all flex flex-col justify-between space-y-6">

                <div class="space-y-4">
                    <div class="flex items-start justify-between gap-3">
                        <div
                            class="w-14 h-14 rounded-2xl bg-teal-600/15 text-teal-700 dark:text-teal-400 flex items-center justify-center text-2xl shrink-0 shadow-inner">
                            <i class="ti ti-building-hospital"></i>
                        </div>
                        <span
                            class="text-xs px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium flex items-center gap-1">
                            <i class="ti ti-map-pin"></i> {{ clinic.city || 'Aşgabat' }}
                        </span>
                    </div>

                    <div class="space-y-1.5">
                        <h2 class="text-xl font-bold text-slate-900 dark:text-slate-100">{{ clinic.name }}</h2>
                        <p class="text-xs text-slate-500 dark:text-slate-400 flex items-start gap-1.5 pt-1">
                            <i class="ti ti-map-pins text-sm shrink-0 mt-0.5"></i>
                            <span>{{ clinic.address || 'Salgysy görkezilmedik' }}</span>
                        </p>
                        <p v-if="clinic.phone"
                            class="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                            <i class="ti ti-phone text-sm shrink-0"></i>
                            <span>{{ clinic.phone }}</span>
                        </p>
                    </div>
                </div>

                <button @click="goToClinicDoctors(clinic.name)"
                    class="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition shadow-md shadow-emerald-600/25 flex items-center justify-center gap-2 cursor-pointer">
                    <i class="ti ti-users text-base"></i> Klinikanyň lukmanlaryny görmek
                </button>
            </div>
        </div>

        <div v-if="!loading && !clinics.length"
            class="text-center py-16 bg-white/50 dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800">
            <i class="ti ti-hospital-off text-4xl text-slate-400 mb-2"></i>
            <p class="text-slate-500 dark:text-slate-400 text-sm">Häzirlikçe hyzmatdaş klinika ýok.</p>
        </div>
    </section>
</template>