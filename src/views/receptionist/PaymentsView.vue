<script setup>
import { onMounted, ref, watch } from 'vue'
import api from '@/services/api'

const rows = ref([])
const clinics = ref([])
const clinicId = ref('')
const loading = ref(true)
const error = ref('')
const labels = { pending: 'Garaşylýar', paid: 'Tölenen', refunded: 'Yzyna gaýtarylan', cancelled: 'Ýatyrylan' }
async function load() {
  loading.value = true
  try { const params = clinicId.value ? { clinic_id: clinicId.value } : {}; const [payments, dashboard] = await Promise.all([api.client.get('/receptionist/payments', { params }), api.client.get('/receptionist/dashboard')]); rows.value = payments.data.data || []; clinics.value = dashboard.data.clinics || [] }
  catch (e) { error.value = e.response?.data?.message || 'Tölegleri alyp bolmady.' }
  finally { loading.value = false }
}

watch(clinicId, load)
onMounted(load)
</script>
<template>
  <section class="mx-auto max-w-7xl space-y-6 px-4 py-10">
    <div>
      <h1 class="text-3xl font-extrabold">Klinikanyň tölegleri</h1>
      <p class="mt-1 text-sm text-slate-500">Töleg taryhyny diňe görüp bilersiňiz. Töleg ýagdaýyny üýtgetmek we yzyna gaýtarmak bu rola rugsat berilmeýär.</p>
    </div>
    <label class="block text-sm font-semibold">Klinika<select v-model="clinicId" class="ml-2 rounded-xl border bg-white p-2 dark:bg-slate-900"><option value="">Ähli klinikalar</option><option v-for="c in clinics" :key="c.id" :value="String(c.id)">{{c.name}}</option></select></label>
    <p v-if="error" class="rounded-xl bg-red-50 p-4 text-red-700">{{ error }}</p>
    <div v-if="loading" class="py-12 text-center">Ýüklenýär...</div>
    <div v-else class="overflow-x-auto rounded-3xl border bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <table class="w-full text-left text-sm">
        <thead>
          <tr class="border-b text-slate-500">
            <th class="p-3">Bron</th>
            <th class="p-3">Näsag</th>
            <th class="p-3">Lukman</th>
            <th class="p-3">Mukdar</th>
            <th class="p-3">Ýagdaý</th>
            
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in rows" :key="p.id" class="border-b dark:border-slate-800">
            <td class="p-3">{{ p.appointment?.booking_code }}</td>
            <td class="p-3">{{ p.appointment?.patient?.name }}</td>
            <td class="p-3">{{ p.appointment?.doctor?.user?.name }}</td>
            <td class="p-3">{{ p.amount }} {{ p.currency }}</td>
            <td class="p-3">{{ labels[p.status] || p.status }}</td>

          </tr>
        </tbody>
      </table>
      <p v-if="!rows.length" class="p-8 text-center text-slate-500">Töleg ýok.</p>
    </div>
  </section>
</template>
