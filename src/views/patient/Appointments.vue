<template>
    <section class="mx-auto max-w-7xl px-4 py-10">
        <h1 class="mb-6 text-3xl font-bold">Kabul ýazgylarym</h1>
        <p v-if="error" class="mb-4 text-red-600">{{ error }}</p>
        <div v-if="loading" class="py-10 text-center">Ýüklenýär...</div>
        <div v-else class="glass-card overflow-x-auto p-4">
            <table class="w-full text-left text-sm">
                <thead>
                    <tr>
                        <th class="p-3">Lukman</th>
                        <th class="p-3">Klinika</th>
                        <th class="p-3">Sene</th>
                        <th class="p-3">Wagt</th>
                        <th class="p-3">Ýagdaýy</th>
                        <th class="p-3">Hereket</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="a in rows" :key="a.id" class="border-t">
                        <td class="p-3">{{ a.doctor?.user?.name }}</td>
                        <td class="p-3">{{ a.clinic?.name }}</td>
                        <td class="p-3">{{ a.appointment_date }}</td>
                        <td class="p-3">{{ a.start_time }}</td>
                        <td class="p-3">{{ status[a.status] || a.status }}</td>
                        <td class="p-3"><button v-if="['pending', 'confirmed'].includes(a.status)" @click="cancel(a)"
                                class="text-red-600">Ýatyr</button><button v-if="a.status === 'completed'"
                                @click="review(a)" class="text-emerald-700">Baha ber</button></td>
                    </tr>
                </tbody>
            </table>
            <p v-if="!rows.length" class="py-8 text-center text-slate-500">Kabul ýazgylaryňyz ýok.</p>
        </div>
    </section>
</template>
<script setup>
import { onMounted, ref } from 'vue'; import api from '@/services/api'
const rows = ref([]), loading = ref(true), error = ref('')
const status = { pending: 'Garaşylýar', confirmed: 'Tassyklanan', rejected: 'Ret edilen', completed: 'Tamamlanan', cancelled: 'Ýatyrylan', no_show: 'Gelmedi' }
async function load() { try { const { data } = await api.getMyAppointments(); rows.value = data.data || [] } catch (e) { error.value = e.response?.data?.message || 'Kabul ýazgylaryny alyp bolmady.' } finally { loading.value = false } }
async function cancel(a) { if (!confirm('Kabul ýazgysyny ýatyrmak isleýärsiňizmi?')) return; try { await api.cancelAppointment(a.id); await load() } catch (e) { error.value = e.response?.data?.message || 'Ýatyryp bolmady.' } }
async function review(a) { const rating = Number(prompt('1-den 5-e çenli baha beriň:')); if (!rating || rating < 1 || rating > 5) return; try { await api.client.post(`/appointments/${a.id}/review`, { rating }); alert('Bahaňyz kabul edildi.') } catch (e) { error.value = e.response?.data?.message || 'Baha iberilmedi.' } }
onMounted(load)
</script>
