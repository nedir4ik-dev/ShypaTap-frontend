<template>
  <section class="mx-auto max-w-7xl px-4 py-8">
    <div class="mb-8 flex flex-wrap items-center justify-between gap-4">
      <div>
        <p class="text-sm text-emerald-700">ŞypaTap</p>
        <h1 class="text-3xl font-bold">{{ title }}</h1>
        <p class="mt-1 text-slate-500">Ulgamyň hakyky maglumatlary</p>
      </div>
      <button @click="load" class="rounded-xl bg-emerald-700 px-4 py-2 text-white">Täzele</button>
    </div>
    <div v-if="error" class="rounded-xl bg-red-50 p-4 text-red-700">{{ error }}</div>
    <div v-if="loading" class="py-10 text-center text-slate-500">Maglumatlar ýüklenýär...</div>
    <template v-else>
      <div v-if="section === 'dashboard'" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <article v-for="(value, key) in stats" :key="key" class="glass-card p-5">
          <p class="text-sm text-slate-500">{{ labels[key] || key }}</p>
          <p class="mt-2 text-3xl font-bold text-emerald-700">{{ value }}</p>
        </article>
      </div>
      <div v-else class="glass-card overflow-hidden p-4">
        <h2 class="mb-4 text-xl font-semibold">{{ labels[section] || section }}</h2>
        <p v-if="!rows.length" class="py-8 text-center text-slate-500">Görkezmäge maglumat ýok.</p>
        <div v-else class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead>
              <tr>
                <th class="p-3">ID</th>
                <th class="p-3">Ady / Maglumat</th>
                <th class="p-3">Ýagdaýy</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in rows" :key="row.id" class="border-t border-slate-200/70">
                <td class="p-3">{{ row.id }}</td>
                <td class="p-3">{{ row.name || row.booking_code || row.email || row.title || '—' }}</td>
                <td class="p-3">{{ statusLabels[row.status] || row.status || (row.is_active ? 'Işjeň' : '—') }}</td>
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
const route = useRoute(), loading = ref(true), error = ref(''), stats = ref({}), rows = ref([])
const section = computed(() => route.params.section || 'dashboard')
const admin = route.path.startsWith('/admin')
const title = computed(() => admin ? 'Administrator paneli' : 'Registratura paneli')
const statusLabels = { pending: 'Garaşylýar', confirmed: 'Tassyklanan', cancelled: 'Ýatyrylan', rejected: 'Ret edilen', completed: 'Tamamlanan', no_show: 'Gelmedi', paid: 'Tölenen', refunded: 'Yzyna gaýtarylan' }
const labels = { users: 'Ulanyjylar', doctors: 'Lukmanlar', clinics: 'Klinikalar', specializations: 'Hünär ugurlary', appointments: 'Kabul ýazgylary', patients: 'Näsaglar', payments: 'Tölegler', dashboard: 'Dolandyryş paneli', receptionist: 'Registratura', pending: 'Garaşylýar', confirmed: 'Tassyklanan', today: 'Şu gün' }
async function load() {
  loading.value = true; error.value = ''
  try {
    if (admin && section.value === 'dashboard') { const { data } = await api.client.get('/admin/dashboard'); stats.value = data.data || data }
    else if (admin) { const { data } = await api.client.get(`/admin/${section.value}`); rows.value = data.data?.data || data.data || data }
    else if (section.value === 'dashboard') { const { data } = await api.client.get('/receptionist/dashboard'); stats.value = data }
    else if (section.value === 'appointments') { const { data } = await api.client.get('/receptionist/appointments'); rows.value = data.data || [] }
    else if (section.value === 'patients') { const { data } = await api.client.get('/receptionist/patients'); rows.value = data.data || [] }
    else if (section.value === 'doctors') { const { data } = await api.client.get('/receptionist/doctors'); rows.value = data.data || [] }
  } catch (e) { error.value = e.response?.data?.message || 'Maglumatlary alyp bolmady. API rugsadyny ýa-da serweri barlaň.' }
  finally { loading.value = false }
}
onMounted(load)
</script>
