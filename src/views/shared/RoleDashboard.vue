<template>
  <section class="mx-auto max-w-7xl px-4 py-10 space-y-8">
    <div
      class="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-xl flex flex-wrap items-center justify-between gap-6">
      <div class="space-y-1">
        <span
          class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider">
          <i class="ti ti-shield-check text-base"></i> ŞypaTap Sanly Ulgam
        </span>
        <h1 class="text-3xl font-extrabold text-slate-900 dark:text-slate-100">{{ title }}</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400">Ulgamyň hakyky wagtda işleýän maglumatlary we dolandyryş
          paneli</p>
      </div>
      <button @click="load"
        class="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition shadow-lg shadow-emerald-600/30 cursor-pointer flex items-center gap-2">
        <i class="ti ti-refresh text-lg"></i> Täzele
      </button>
    </div>

    <div v-if="error"
      class="rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 p-4 text-red-700 dark:text-red-300 text-sm">
      {{ error }}
    </div>

    <div v-if="loading" class="py-20 text-center text-slate-500 space-y-2">
      <i class="ti ti-loader animate-spin text-4xl text-emerald-600"></i>
      <p>Maglumatlar ýüklenýär...</p>
    </div>

    <template v-else>
      <div v-if="section === 'dashboard'" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <article v-for="(value, key) in stats" :key="key"
          class="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-xl space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-sm font-semibold text-slate-500 dark:text-slate-400">{{ labels[key] || key }}</span>
            <div
              class="w-10 h-10 rounded-xl bg-emerald-600/15 text-emerald-700 dark:text-emerald-400 flex items-center justify-center text-xl">
              <i :class="getStatIcon(key)"></i>
            </div>
          </div>
          <p class="text-3xl font-extrabold text-slate-900 dark:text-slate-100">{{ value }}</p>
        </article>
      </div>

      <div v-else
        class="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl overflow-hidden p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-xl space-y-4">
        <div class="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800 pb-4">
          <h2 class="text-xl font-bold text-slate-900 dark:text-slate-100">{{ labels[section] || section }}</h2>
          <span
            class="text-xs px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
            Jemi: {{ rows.length }} sany
          </span>
        </div>

        <p v-if="!rows.length" class="py-12 text-center text-slate-500">Görkezmäge maglumat ýok.</p>

        <div v-else class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead>
              <tr class="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold">
                <th class="p-3">ID</th>
                <th class="p-3">Ady / Maglumat</th>
                <th class="p-3" v-if="section === 'appointments'">Sene / Wagt</th>
                <th class="p-3">Ýagdaýy</th>
                <th class="p-3 text-right" v-if="section === 'appointments'">Hereketler</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in rows" :key="row.id"
                class="border-t border-slate-200/60 dark:border-slate-800 text-slate-800 dark:text-slate-200">
                <td class="p-3 font-mono text-xs text-slate-500">#{{ row.id }}</td>
                <td class="p-3 font-semibold">
                  {{ row.name || row.patient?.name || row.doctor?.user?.name || row.booking_code || row.email ||
                    row.title || '—' }}
                </td>
                <td class="p-3" v-if="section === 'appointments'">
                  {{ row.appointment_date?.split('T')[0] }} <span class="text-emerald-600 font-mono">{{ row.start_time
                    }}</span>
                </td>
                <td class="p-3">
                  <span class="px-3 py-1 rounded-full text-xs font-semibold" :class="getStatusClass(row.status)">
                    {{ statusLabels[row.status] || row.status || (row.is_active ? 'Işjeň' : '—') }}
                  </span>
                </td>
                <td class="p-3 text-right space-x-2" v-if="section === 'appointments'">
                  <button v-if="row.status === 'pending'" @click="changeStatus(row.id, 'confirmed')"
                    class="px-3 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded-xl text-xs font-semibold">Tassykla</button>
                  <button v-if="row.status === 'pending'" @click="changeStatus(row.id, 'rejected')"
                    class="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-800 dark:bg-red-950 dark:text-red-300 rounded-xl text-xs font-semibold">Ret
                    et</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/services/api'

const route = useRoute()
const loading = ref(true)
const error = ref('')
const stats = ref({})
const rows = ref([])

const section = computed(() => route.params.section || 'dashboard')
const admin = route.path.startsWith('/admin')
const title = computed(() => admin ? 'Administrator paneli' : 'Registratura paneli')

const statusLabels = {
  pending: 'Garaşylýar',
  confirmed: 'Tassyklanan',
  cancelled: 'Ýatyrylan',
  rejected: 'Ret edilen',
  completed: 'Tamamlanan',
  no_show: 'Gelmedi',
  paid: 'Tölenen',
  refunded: 'Yzyna gaýtarylan'
}

const labels = {
  users: 'Ulanyjylar',
  doctors: 'Lukmanlar',
  clinics: 'Klinikalar',
  specializations: 'Hünär ugurlary',
  appointments: 'Kabul ýazgylary',
  patients: 'Näsaglar',
  payments: 'Tölegler',
  dashboard: 'Dolandyryş paneli',
  receptionist: 'Registratura',
  pending: 'Garaşylýar',
  confirmed: 'Tassyklanan',
  today: 'Şu gün'
}

const getStatIcon = (key) => {
  switch (key) {
    case 'users': return 'ti ti-users'
    case 'doctors': return 'ti ti-stethoscope'
    case 'clinics': return 'ti ti-building-hospital'
    case 'appointments': return 'ti ti-calendar-event'
    case 'patients': return 'ti ti-user-heart'
    case 'today': return 'ti ti-calendar-stats'
    default: return 'ti ti-chart-bar'
  }
}

const getStatusClass = (st) => {
  switch (st) {
    case 'confirmed': case 'paid': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
    case 'pending': return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
    case 'rejected': case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
    default: return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
  }
}

async function load() {
  loading.value = true
  error.value = ''
  try {
    if (admin && section.value === 'dashboard') {
      const { data } = await api.client.get('/admin/dashboard')
      stats.value = data.data || data
    } else if (admin) {
      const { data } = await api.client.get(`/admin/${section.value}`)
      rows.value = data.data?.data || data.data || data
    } else if (section.value === 'dashboard') {
      const { data } = await api.client.get('/receptionist/dashboard')
      stats.value = data.data || data
    } else if (section.value === 'appointments') {
      const { data } = await api.client.get('/receptionist/appointments')
      rows.value = data.data || data || []
    } else if (section.value === 'patients') {
      const { data } = await api.client.get('/receptionist/patients')
      rows.value = data.data || data || []
    } else if (section.value === 'doctors') {
      const { data } = await api.client.get('/receptionist/doctors')
      rows.value = data.data || data || []
    }
  } catch (e) {
    error.value = e.response?.data?.message || 'Maglumatlary alyp bolmady. API rugsadyny ýa-da serweri barlaň.'
  } finally {
    loading.value = false
  }
}

async function changeStatus(id, newStatus) {
  try {
    await api.client.patch(`/receptionist/appointments/${id}/status`, { status: newStatus })
    await load()
  } catch (e) {
    alert('Statusy üýtgedip bolmady.')
  }
}

onMounted(load)
</script>