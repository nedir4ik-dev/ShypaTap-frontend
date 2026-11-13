<template>
    <section class="mx-auto max-w-7xl px-4 py-10">
        <h1 class="mb-2 text-3xl font-bold">Lukman paneli</h1>
        <p class="mb-8 text-slate-500">Kabul ýazgylaryňyzy dolandyryň.</p>
        <div v-if="error" class="mb-4 rounded-xl bg-red-50 p-4 text-red-700">{{ error }}</div>
        <div class="mb-6 flex flex-wrap gap-3"><button @click="load"
                class="rounded-xl bg-emerald-700 px-4 py-2 text-white">Täzele</button><router-link to="/doctor/schedule"
                class="rounded-xl border border-emerald-700 px-4 py-2 text-emerald-800">Iş tertibi</router-link></div>
        <div v-if="loading" class="py-8 text-center">Ýüklenýär...</div>
        <div v-else class="glass-card overflow-x-auto p-4">
            <h2 class="mb-4 text-xl font-semibold">Kabul ýazgylary</h2>
            <table class="w-full text-left text-sm">
                <thead>
                    <tr>
                        <th class="p-3">Näsag</th>
                        <th class="p-3">Sene</th>
                        <th class="p-3">Wagt</th>
                        <th class="p-3">Ýagdaýy</th>
                        <th class="p-3">Hereket</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="a in appointments" :key="a.id" class="border-t">
                        <td class="p-3">{{ a.patient?.name }}</td>
                        <td class="p-3">{{ a.appointment_date }}</td>
                        <td class="p-3">{{ a.start_time }}</td>
                        <td class="p-3">{{ status[a.status] || a.status }}</td>
                        <td class="p-3 flex flex-wrap gap-2"><button v-if="a.status === 'pending'"
                                @click="change(a, 'confirmed')" class="text-emerald-700">Tassykla</button><button
                                v-if="a.status === 'pending'" @click="change(a, 'rejected')" class="text-red-600">Ret
                                et</button><button v-if="a.status === 'confirmed'" @click="change(a, 'completed')"
                                class="text-emerald-700">Tamamla</button><button v-if="a.status === 'confirmed'"
                                @click="change(a, 'no_show')" class="text-amber-700">Gelmedi</button></td>
                    </tr>
                </tbody>
            </table>
            <p v-if="!appointments.length" class="py-8 text-center text-slate-500">Kabul ýazgysy ýok.</p>
        </div>
    </section>
</template>
<script setup>
import { onMounted, ref } from 'vue'; import api from '@/services/api'
const appointments = ref([]), loading = ref(true), error = ref('')
const status = { pending: 'Garaşylýar', confirmed: 'Tassyklanan', rejected: 'Ret edilen', completed: 'Tamamlanan', cancelled: 'Ýatyrylan', no_show: 'Gelmedi' }
async function load() { loading.value = true; error.value = ''; try { const { data } = await api.client.get('/doctor/appointments'); appointments.value = data.data || [] } catch (e) { error.value = e.response?.data?.message || 'Maglumatlary alyp bolmady.' } finally { loading.value = false } }
async function change(a, status) { try { await api.client.patch(`/doctor/appointments/${a.id}/status`, { status }); await load() } catch (e) { error.value = e.response?.data?.message || 'Ýagdaýy üýtgedip bolmady.' } }
onMounted(load)
</script>
