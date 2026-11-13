<template>
    <section class="mx-auto max-w-7xl space-y-6 px-4 py-10">
        <div>
            <h1 class="text-3xl font-bold">Hepdelik iş tertibi</h1>
            <p class="mt-2 text-slate-500">Klinika boýunça kabul sagatlaryňyzy we dynç günleriňizi sazlaň.</p>
        </div>
        <p v-if="error" class="rounded-xl bg-red-50 p-3 text-red-700">{{ error }}</p>
        <div class="glass-card p-6">
            <h2 class="mb-4 text-xl font-semibold">Täze iş tertibi</h2>
            <form @submit.prevent="save" class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <label class="text-sm">Klinika<select v-model="form.clinic_id" required
                        class="mt-1 w-full rounded-xl border p-3">
                        <option value="">Saýlaň</option>
                        <option v-for="c in clinics" :key="c.id" :value="c.id">{{ c.name }}</option>
                    </select></label>
                <label class="text-sm">Hepdäniň güni<select v-model.number="form.day_of_week"
                        class="mt-1 w-full rounded-xl border p-3">
                        <option v-for="d in days" :key="d.value" :value="d.value">{{ d.label }}</option>
                    </select></label>
                <label class="text-sm">Başlanýan wagt<input v-model="form.start_time" type="time" required
                        class="mt-1 w-full rounded-xl border p-3" /></label>
                <label class="text-sm">Gutaryş wagt<input v-model="form.end_time" type="time" required
                        class="mt-1 w-full rounded-xl border p-3" /></label>
                <label class="text-sm">Arakesme başlangyjy<input v-model="form.break_start" type="time"
                        class="mt-1 w-full rounded-xl border p-3" /></label>
                <label class="text-sm">Arakesme gutaryşy<input v-model="form.break_end" type="time"
                        class="mt-1 w-full rounded-xl border p-3" /></label>
                <label class="text-sm">Kabul dowamlylygy (minut)<input v-model.number="form.slot_duration_minutes"
                        type="number" min="5" max="240" class="mt-1 w-full rounded-xl border p-3" /></label>
                <div class="flex items-end"><button :disabled="saving"
                        class="w-full rounded-xl bg-emerald-700 px-4 py-3 text-white">{{ saving ? 'Saklanýar...' :
                            'Tertibi goş' }}</button></div>
            </form>
        </div>
        <div class="glass-card overflow-x-auto p-5">
            <h2 class="mb-4 text-xl font-semibold">Häzirki tertip</h2>
            <table class="w-full text-left text-sm">
                <thead>
                    <tr>
                        <th class="p-3">Gün</th>
                        <th class="p-3">Klinika</th>
                        <th class="p-3">Iş wagty</th>
                        <th class="p-3">Arakesme</th>
                        <th class="p-3">Dowamlylyk</th>
                        <th class="p-3">Hereket</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="s in schedules" :key="s.id" class="border-t">
                        <td class="p-3">{{ days[s.day_of_week - 1]?.label }}</td>
                        <td class="p-3">{{ s.clinic?.name }}</td>
                        <td class="p-3">{{ s.start_time }}–{{ s.end_time }}</td>
                        <td class="p-3">{{ s.break_start || '—' }}–{{ s.break_end || '—' }}</td>
                        <td class="p-3">{{ s.slot_duration_minutes }} min</td>
                        <td class="p-3"><button @click="remove(s)" class="text-red-600">Poz</button></td>
                    </tr>
                </tbody>
            </table>
            <p v-if="!schedules.length" class="py-6 text-center text-slate-500">Iş tertibi girizilmedi.</p>
        </div>
        <div class="glass-card p-6">
            <h2 class="mb-4 text-xl font-semibold">Aýratyn dynç güni</h2>
            <form @submit.prevent="addDayOff" class="flex flex-wrap gap-3"><select v-model="off.clinic_id" required
                    class="rounded-xl border p-3">
                    <option value="">Klinika</option>
                    <option v-for="c in clinics" :key="c.id" :value="c.id">{{ c.name }}</option>
                </select><input v-model="off.off_date" type="date" :min="today" required
                    class="rounded-xl border p-3" /><input v-model="off.reason" placeholder="Sebäbi"
                    class="min-w-40 flex-1 rounded-xl border p-3" /><button
                    class="rounded-xl bg-emerald-700 px-4 py-3 text-white">Dynç günü goş</button></form>
            <ul class="mt-4 space-y-2">
                <li v-for="d in daysOff" :key="d.id"
                    class="flex justify-between rounded-xl bg-slate-100 dark:bg-slate-950 p-3 text-sm">
                    {{ d.off_date }} · {{ d.clinic?.name }} · {{ d.reason }}<button @click="removeOff(d)"
                        class="text-red-600">Poz</button></li>
            </ul>
        </div>
    </section>
</template>
<script setup>
import { onMounted, ref } from 'vue'; import api from '@/services/api'
const days = [{ value: 1, label: 'Duşenbe' }, { value: 2, label: 'Sişenbe' }, { value: 3, label: 'Çarşenbe' }, { value: 4, label: 'Penşenbe' }, { value: 5, label: 'Anna' }, { value: 6, label: 'Şenbe' }, { value: 7, label: 'Ýekşenbe' }]
const schedules = ref([]), daysOff = ref([]), clinics = ref([]), error = ref(''), saving = ref(false), today = new Date().toLocaleDateString('en-CA')
const form = ref({ clinic_id: '', day_of_week: 1, start_time: '09:00', end_time: '17:00', break_start: '13:00', break_end: '14:00', slot_duration_minutes: 30, is_active: true })
const off = ref({ clinic_id: '', off_date: '', reason: '' })
async function load() { try { const [s, d, c] = await Promise.all([api.client.get('/doctor/schedules'), api.client.get('/doctor/days-off'), api.getClinics()]); schedules.value = s.data.data || s.data; daysOff.value = d.data.data || d.data; clinics.value = c.data.data || c.data } catch (e) { error.value = e.response?.data?.message || 'Maglumatlary alyp bolmady.' } }
async function save() { saving.value = true; try { await api.client.post('/doctor/schedules', form.value); await load() } catch (e) { error.value = e.response?.data?.message || 'Tertibi saklap bolmady.' } finally { saving.value = false } }
async function remove(s) { if (confirm('Iş tertibini pozmalymy?')) { await api.client.delete(`/doctor/schedules/${s.id}`); await load() } }
async function addDayOff() { try { await api.client.post('/doctor/days-off', off.value); off.value = { clinic_id: '', off_date: '', reason: '' }; await load() } catch (e) { error.value = e.response?.data?.message || 'Dynç günü goşulmady.' } }
async function removeOff(d) { if (confirm('Dynç günü pozmalymy?')) { await api.client.delete(`/doctor/days-off/${d.id}`); await load() } }
onMounted(load)
</script>
