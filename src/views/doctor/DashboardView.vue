<script setup>
import { onMounted, ref } from 'vue'
import api from '@/services/api'

const appointments = ref([])
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
    const parts = dateString.split('T')[0]
    return parts
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
    loading.value = true
    error.value = ''
    try {
        const { data } = await api.client.get('/doctor/appointments')
        appointments.value = data.data || []
    } catch (e) {
        error.value = e.response?.data?.message || 'Maglumatlary alyp bolmady.'
    } finally {
        loading.value = false
    }
}

async function change(a, newStatus) {
    try {
        await api.client.patch(`/doctor/appointments/${a.id}/status`, { status: newStatus })
        await load()
    } catch (e) {
        error.value = e.response?.data?.message || 'Ýagdaýy üýtgedip bolmady.'
    }
}

onMounted(load)
</script>

<template>
    <section class="mx-auto max-w-7xl px-4 py-10">
        <h1 class="mb-2 text-3xl font-bold">Lukman paneli</h1>
        <p class="mb-8 text-slate-500">Kabul ýazgylaryňyzy dolandyryň.</p>
        <div v-if="error" class="mb-4 rounded-xl bg-red-50 p-4 text-red-700">{{ error }}</div>
        <div class="mb-6 flex flex-wrap gap-3">
            <button @click="load" class="rounded-xl bg-emerald-700 px-4 py-2 text-white">Täzele</button>
            <router-link to="/doctor/schedule"
                class="rounded-xl border border-emerald-700 px-4 py-2 text-emerald-800 dark:text-emerald-300">Iş
                tertibi</router-link>
        </div>
        <div v-if="loading" class="py-8 text-center">Ýüklenýär...</div>
        <div v-else
            class="glass-card overflow-x-auto p-4 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-lg">
            <h2 class="mb-4 text-xl font-semibold text-slate-900 dark:text-slate-100">Kabul ýazgylary</h2>
            <table class="w-full text-left text-sm">
                <thead>
                    <tr class="border-b border-slate-200 dark:border-slate-800 text-slate-500">
                        <th class="p-3">Näsag</th>
                        <th class="p-3">Sene</th>
                        <th class="p-3">Wagt</th>
                        <th class="p-3">Ýagdaýy</th>
                        <th class="p-3">Hereket</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="a in appointments" :key="a.id"
                        class="border-t border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200">
                        <td class="p-3 font-medium">{{ a.patient?.name || 'Näsag' }}</td>
                        <td class="p-3">{{ formatDate(a.appointment_date) }}</td>
                        <td class="p-3">{{ a.start_time }}</td>
                        <td class="p-3">
                            <span class="px-2.5 py-1 rounded-full text-xs font-semibold"
                                :class="getStatusClass(a.status)">
                                {{ status[a.status] || a.status }}
                            </span>
                        </td>
                        <td class="p-3 flex flex-wrap gap-2">
                            <button v-if="a.status === 'pending'" @click="change(a, 'confirmed')"
                                class="text-emerald-600 hover:underline font-medium">Tassykla</button>
                            <button v-if="a.status === 'pending'" @click="change(a, 'rejected')"
                                class="text-red-600 hover:underline font-medium">Ret et</button>
                            <button v-if="a.status === 'confirmed'" @click="change(a, 'completed')"
                                class="text-emerald-600 hover:underline font-medium">Tamamla</button>
                            <button v-if="a.status === 'confirmed'" @click="change(a, 'no_show')"
                                class="text-amber-600 hover:underline font-medium">Gelmedi</button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <p v-if="!appointments.length" class="py-8 text-center text-slate-500">Kabul ýazgysy ýok.</p>
        </div>
    </section>
</template>