<script setup>
import { onMounted, ref } from 'vue'
import api from '@/services/api'

const rows = ref([])
const loading = ref(true)
const error = ref('')

const status = {
    pending: 'Garaşylýar',
    confirmed: 'Tassyklanan',
    rejected: 'Ret edilen',
    completed: 'Tamamlanan',
    cancelled: 'Ýatyrylan',
    no_show: 'Gelmedi'
}
const formatDate = (dateString) => {
    if (!dateString) return '-'
    return dateString.split('T')[0]
}

const getStatusClass = (st) => {
    switch (st) {
        case 'confirmed': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
        case 'pending': return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
        case 'rejected': case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
        default: return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
    }
}

async function load() {
    try {
        const { data } = await api.getMyAppointments()
        rows.value = data.data || []
    } catch (e) {
        error.value = e.response?.data?.message || 'Kabul ýazgylaryny alyp bolmady.'
    } finally {
        loading.value = false
    }
}

async function cancel(a) {
    if (!confirm('Kabul ýazgysyny ýatyrmak isleýärsiňizmi?')) return
    try {
        await api.cancelAppointment(a.id)
        await load()
    } catch (e) {
        error.value = e.response?.data?.message || 'Ýatyryp bolmady.'
    }
}

async function review(a) {
    const rating = Number(prompt('1-den 5-e çenli baha beriň:'))
    if (!rating || rating < 1 || rating > 5) return
    try {
        await api.client.post(`/appointments/${a.id}/review`, { rating })
        alert('Bahaňyz kabul edildi.')
    } catch (e) {
        error.value = e.response?.data?.message || 'Baha iberilmedi.'
    }
}

onMounted(load)
</script>

<template>
    <section class="mx-auto max-w-7xl px-4 py-10 space-y-6">
        <div>
            <h1 class="text-3xl font-extrabold text-slate-900 dark:text-slate-100">Kabul ýazgylarym</h1>
            <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Ähli bron eden kabul edişleriňizi we olaryň
                statusyny yzarlaň.</p>
        </div>

        <div v-if="error"
            class="rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 p-4 text-red-700 dark:text-red-300 text-sm">
            {{ error }}
        </div>

        <div v-if="loading" class="py-12 text-center text-slate-500">Ýüklenýär...</div>

        <div v-else
            class="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md overflow-x-auto p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-xl">
            <table class="w-full text-left text-sm">
                <thead>
                    <tr class="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold">
                        <th class="p-3">Lukman</th>
                        <th class="p-3">Klinika</th>
                        <th class="p-3">Sene</th>
                        <th class="p-3">Wagt</th>
                        <th class="p-3">Ýagdaýy</th>
                        <th class="p-3 text-right">Hereket</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="a in rows" :key="a.id"
                        class="border-t border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200">
                        <td class="p-3 font-semibold">{{ a.doctor?.user?.name || 'Lukman' }}</td>
                        <td class="p-3 text-slate-600 dark:text-slate-400">{{ a.clinic?.name || 'Merkezi Klinika' }}
                        </td>
                        <td class="p-3">{{ formatDate(a.appointment_date) }}</td>
                        <td class="p-3 font-mono text-emerald-600 dark:text-emerald-400">{{ a.start_time }}</td>
                        <td class="p-3">
                            <span class="px-3 py-1 rounded-full text-xs font-semibold"
                                :class="getStatusClass(a.status)">
                                {{ status[a.status] || a.status }}
                            </span>
                        </td>
                        <td class="p-3 text-right flex items-center justify-end gap-2">
                            <button v-if="['pending', 'confirmed'].includes(a.status)" @click="cancel(a)"
                                class="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-950/50 dark:hover:bg-red-900 text-red-600 dark:text-red-400 text-xs font-semibold transition">
                                Ýatyr
                            </button>
                            <button v-if="a.status === 'completed'" @click="review(a)"
                                class="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:hover:bg-emerald-900 text-emerald-600 dark:text-emerald-400 text-xs font-semibold transition">
                                Baha ber
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <p v-if="!rows.length" class="py-12 text-center text-slate-500">Häzirlikçe kabul ýazgylaryňyzyň ýok.</p>
        </div>
    </section>
</template>