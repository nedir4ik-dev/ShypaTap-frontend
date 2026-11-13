<script setup>
defineProps({
    doctor: {
        type: Object,
        required: true
    }
})
</script>

<template>
    <div
        class="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all flex flex-col justify-between">
        <div>
            <div class="flex items-center space-x-4 mb-4">
                <img v-if="doctor.photo" :src="doctor.photo" :alt="doctor.name"
                    class="h-14 w-14 rounded-2xl object-cover" />
                <div v-else
                    class="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-xl font-bold text-emerald-800">
                    {{ doctor.name ? doctor.name.charAt(0) : 'L' }}
                </div>
                <div>
                    <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100">{{ doctor.name }}</h3>
                    <p class="text-xs font-semibold text-emerald-700 dark:text-blue-400">
                        {{ doctor.specialization?.name || doctor.specialization }}
                    </p>
                    <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Klinika: {{ doctor.clinic?.name || 'Merkezi Klinika' }}
                    </p>
                </div>
            </div>

            <div
                class="space-y-2 text-xs text-slate-600 dark:text-slate-300 mb-6 border-t border-slate-100 dark:border-slate-800 pt-4">
                <div class="flex justify-between">
                    <span>Iş tejribesi:</span>
                    <span class="font-medium">
                        {{ doctor.experience_years ?? '—' }} {{ doctor.experience_years == null ? '' : 'ýyl' }}
                    </span>
                </div>
                <div class="flex justify-between">
                    <span>Kabul ediş bahasy:</span>
                    <span class="font-medium text-emerald-600 dark:text-emerald-400">
                        {{ doctor.consultation_fee ?? 'Bahasy görkezilmedi' }}
                        {{ doctor.consultation_fee == null ? '' : (doctor.currency || 'TMT') }}
                    </span>
                </div>
            </div>
        </div>

        <router-link :to="`/doctors/${doctor.id}`" class="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-500 text-white text-center text-sm
             font-medium rounded-xl shadow-lg shadow-slate-500/30 transition-all block">
            Profili we wagtlary görmek
        </router-link>
    </div>
</template>