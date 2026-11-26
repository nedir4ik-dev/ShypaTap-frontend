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
      <div class="flex flex-wrap gap-2">
        <router-link v-if="!admin" to="/receptionist/payments"
          class="px-5 py-2.5 rounded-2xl border border-emerald-600 text-emerald-700 dark:text-emerald-300 font-semibold text-sm">Tölegler</router-link>
        <router-link v-if="!admin" to="/receptionist/settings"
          class="px-5 py-2.5 rounded-2xl border border-slate-300 text-slate-700 dark:text-slate-200 font-semibold text-sm">Sazlamalar</router-link>
        <button @click="load"
          class="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition shadow-lg shadow-emerald-600/30 cursor-pointer flex items-center gap-2">
          <i class="ti ti-refresh text-lg"></i> Täzele
        </button>
      </div>
    </div>

    <div v-if="error"
      class="rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 p-4 text-red-700 dark:text-red-300 text-sm">
      {{ error }}
    </div>

    <div v-if="!admin && clinics.length" class="flex justify-end">
      <label class="text-sm font-semibold text-slate-600 dark:text-slate-300">Klinika
        <select v-model="clinicId" class="ml-2 rounded-xl border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
          <option value="">Ähli klinikalar</option><option v-for="clinic in clinics" :key="clinic.id" :value="String(clinic.id)">{{ clinic.name }}</option>
        </select>
      </label>
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

      <div v-if="section === 'dashboard' && !admin" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <router-link v-for="link in quickLinks" :key="link.to" :to="link.to"
          class="group flex items-center gap-3 rounded-2xl border border-slate-200/60 bg-white/70 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800/60 dark:bg-slate-900/70">
          <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-xl text-emerald-700 transition group-hover:scale-105 dark:bg-emerald-950/60 dark:text-emerald-400">
            <i :class="link.icon"></i>
          </span>
          <span class="text-sm font-semibold text-slate-800 dark:text-slate-100">{{ link.label }}</span>
        </router-link>
      </div>

      <div v-if="section !== 'dashboard'"
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
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
  </section>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/services/api'

const route = useRoute()
const loading = ref(true)
const error = ref('')
const stats = ref({})
const rows = ref([])
const clinics = ref([])
const clinicId = ref('')

const section = computed(() => route.params.section || 'dashboard')
const admin = route.path.startsWith('/admin')
const title = computed(() => admin ? 'Administrator paneli' : 'Registratura paneli')

const statusLabels = {
  pending: 'Garaşylýar',
  confirmed: 'Tassyklanan',
  checked_in: 'Geldi',
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
  checked_in: 'Geldi',
  today: 'Şu gün',
  'waiting-queue': 'Garaşýan näsaglar nobaty'
}

const quickLinks = [
  { to: '/receptionist/appointments', label: 'Kabul ýazgylary', icon: 'ti ti-calendar-event' },
  { to: '/receptionist/patients', label: 'Näsaglar', icon: 'ti ti-users' },
  { to: '/receptionist/waiting-queue', label: 'Nobat', icon: 'ti ti-hourglass' },
  { to: '/receptionist/payments', label: 'Tölegler', icon: 'ti ti-credit-card' },
  { to: '/receptionist/settings', label: 'Sazlamalar', icon: 'ti ti-settings' },
]

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
    } else {
      const params = clinicId.value ? { clinic_id: clinicId.value } : {}
      const dashboard = await api.client.get('/receptionist/dashboard', { params })
      clinics.value = dashboard.data.clinics || clinics.value
      if (section.value === 'dashboard') { const summary = { ...dashboard.data }; delete summary.clinics; stats.value = summary }
      else if (section.value === 'appointments' || section.value === 'waiting-queue') {
        const query = section.value === 'waiting-queue' ? { ...params, status: 'checked_in' } : params
        const { data } = await api.client.get('/receptionist/appointments', { params: query })
        rows.value = data.data || data || []
      } else if (section.value === 'patients') {
        const { data } = await api.client.get('/receptionist/patients', { params })
        rows.value = data.data || data || []
      } else if (section.value === 'doctors') {
        const { data } = await api.client.get('/receptionist/doctors', { params })
        rows.value = data.data || data || []
      }
    }
  } catch (e) {
    error.value = e.response?.data?.message || 'Maglumatlary alyp bolmady. API rugsadyny ýa-da serweri barlaň.'
  } finally {
    loading.value = false
  }
}
watch([section, clinicId], load)

onMounted(load)
</script>
