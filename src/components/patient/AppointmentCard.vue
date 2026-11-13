<template>
    <div
        class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

            <!-- Doctor & Clinic Info -->
            <div class="flex items-start space-x-4">
                <div
                    class="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-lg shrink-0">
                    {{ appointment.doctorName ? appointment.doctorName.charAt(0) : 'L' }}
                </div>
                <div>
                    <h3 class="text-base font-semibold text-slate-900 dark:text-slate-100">
                        {{ appointment.doctorName }}
                    </h3>
                    <p class="text-sm text-blue-600 dark:text-blue-400 font-medium">
                        {{ appointment.specialization }}
                    </p>
                    <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Klinika: {{ appointment.clinicName }}
                    </p>
                </div>
            </div>

            <!-- Date, Time & Status -->
            <div class="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                <div class="flex items-center space-x-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-slate-400" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{{ appointment.date }} | {{ appointment.startTime }}</span>
                </div>

                <!-- Status Badge -->
                <span :class="['text-xs px-3 py-1 rounded-full font-medium', getStatusClass(appointment.status)]">
                    {{ getStatusText(appointment.status) }}
                </span>
            </div>

        </div>

        <!-- Actions (Cancel Button if Pending / Confirmed) -->
        <div v-if="canCancel" class="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button @click="$emit('cancel', appointment.id)"
                class="px-4 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors">
                Brony ýatyrmak
            </button>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    appointment: {
        type: Object,
        required: true,
        // mysal üçin: { id: 1, doctorName: 'Dr. Serdar', specialization: 'Kardiolog', clinicName: 'Central Clinic', date: '2026-11-15', startTime: '10:00', status: 'Confirmed' }
    }
})

defineEmits(['cancel'])

// Dokumentasiýadaky statuslara laýyklykda reňkler
const getStatusClass = (status) => {
    switch (status) {
        case 'confirmed':
            return 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400'
        case 'pending':
            return 'bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400'
        case 'cancelled':
            return 'bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400'
        case 'completed':
            return 'bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400'
        default:
            return 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
    }
}

const getStatusText = (status) => {
    switch (status) {
        case 'confirmed': return 'Tassyklanan'
        case 'pending': return 'Garaşylýär'
        case 'cancelled': return 'Ýatyrylan'
        case 'completed': return 'Tamamlanan'
        default: return status
    }
}

const canCancel = computed(() => {
    return props.appointment.status === 'Pending' || props.appointment.status === 'Confirmed'
})
</script>