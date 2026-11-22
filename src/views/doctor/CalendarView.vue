<script setup>
import { computed, onMounted, ref } from 'vue'
import api from '@/services/api'

const today = new Date()
const localDate = (d) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
const from = ref(localDate(today))
const to = ref(localDate(new Date(today.getFullYear(), today.getMonth(), today.getDate()+13)))
const clinicId = ref('')
const rows = ref([])
const loading = ref(false)
const error = ref('')
const statusLabels = { pending: 'Garaşylýar', confirmed: 'Tassyklanan', rejected: 'Ret edilen', cancelled: 'Ýatyrylan', completed: 'Tamamlanan', no_show: 'Gelmedi' }
const grouped = computed(() => rows.value.reduce((acc, row) => {
  (acc[String(row.appointment_date).slice(0, 10)] ||= []).push(row)
  return acc
}, {}))
const days = computed(() => Object.entries(grouped.value).sort(([a],[b]) => a.localeCompare(b)))

async function load() {
  loading.value = true
  error.value = ''
  try {
    const params = { from: from.value, to: to.value }
    if (clinicId.value) params.clinic_id = clinicId.value
    const { data } = await api.client.get('/doctor/calendar', { params })
    rows.value = data.data || []
  } catch (e) {
    error.value = e.response?.data?.message || 'Kalendary ýükläp bolmady.'
  } finally {
    loading.value = false
  }
}
function dateLabel(value) {
  const [y,m,d] = value.split('-').map(Number)
  return new Intl.DateTimeFormat('tk-TM', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(y,m-1,d))
}
onMounted(load)
</script>

<template>
  <section class="mx-auto max-w-7xl space-y-6 px-4 py-10">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div><h1 class="text-3xl font-extrabold text-slate-900 dark:text-white">Bron kalendary</h1>
        <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Klinika wagty boýunça kabul ýazgylaryňyzy görüň.</p></div>
      <router-link to="/doctor/appointments" class="text-sm font-semibold text-emerald-700 hover:underline">Kabul ýazgylarynyň sanawy →</router-link>
    </div>
    <div class="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 sm:grid-cols-[1fr_1fr_auto]">
      <label class="text-sm text-slate-600 dark:text-slate-300">Başlangyç sene<input v-model="from" type="date" class="mt-1 block w-full rounded-xl border border-slate-200 bg-transparent p-2 dark:border-slate-700"></label>
      <label class="text-sm text-slate-600 dark:text-slate-300">Soňky sene<input v-model="to" type="date" :min="from" class="mt-1 block w-full rounded-xl border border-slate-200 bg-transparent p-2 dark:border-slate-700"></label>
      <button @click="load" :disabled="loading || !from || !to || to < from" class="self-end rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50">{{ loading ? 'Ýüklenýär...' : 'Görkez' }}</button>
    </div>
    <p v-if="error" class="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">{{ error }}</p>
    <div v-if="loading" class="py-12 text-center text-slate-500">Kalendary ýüklenýär...</div>
    <div v-else-if="!days.length" class="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500 dark:border-slate-800 dark:bg-slate-900">Saýlanan döwürde bron ýok.</div>
    <div v-else class="space-y-4">
      <section v-for="[day, appointments] in days" :key="day" class="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <header class="border-b border-slate-100 bg-slate-50 px-5 py-3 font-bold text-slate-800 dark:border-slate-800 dark:bg-slate-950 dark:text-white">{{ dateLabel(day) }} <span class="ml-2 text-xs font-normal text-slate-500">{{ appointments.length }} kabul</span></header>
        <div class="divide-y divide-slate-100 dark:divide-slate-800">
          <article v-for="a in appointments" :key="a.id" class="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div class="flex items-center gap-4"><div class="min-w-20 rounded-xl bg-emerald-50 px-3 py-2 text-center font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">{{ String(a.start_time).slice(0,5) }}<span class="block text-xs font-normal">– {{ String(a.end_time).slice(0,5) }}</span></div>
              <div><p class="font-semibold text-slate-900 dark:text-white">{{ a.patient?.name || 'Näsag' }}</p><p class="text-xs text-slate-500">{{ a.clinic?.name || 'Klinika' }} · {{ a.booking_code }}</p></div></div>
            <div class="flex items-center gap-3"><span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">{{ statusLabels[a.status] || a.status }}</span><router-link :to="`/doctor/appointments/${a.id}`" class="text-sm font-semibold text-emerald-700 hover:underline">Jikme-jiklik</router-link></div>
          </article>
        </div>
      </section>
    </div>
  </section>
</template>
