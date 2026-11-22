<script setup>
import { onMounted, ref } from 'vue'
import api from '@/services/api'

const rows = ref([])
const loading = ref(true)
const error = ref('')
const busy = ref(null)
const labels = { pending: 'Garaşylýar', paid: 'Tölenen', refunded: 'Yzyna gaýtarylan', cancelled: 'Ýatyrylan' }
async function load() {
  loading.value = true
  try { const { data } = await api.client.get('/receptionist/payments'); rows.value = data.data || [] }
  catch (e) { error.value = e.response?.data?.message || 'Tölegleri alyp bolmady.' }
  finally { loading.value = false }
}
async function setStatus(payment, status) {
  busy.value = payment.id; error.value = ''
  try { await api.client.patch(`/receptionist/payments/${payment.id}`, { status, note: 'Registratura panelinden üýtgedildi' }); await load() }
  catch (e) { error.value = e.response?.data?.message || 'Töleg ýagdaýyny üýtgedip bolmady.' }
  finally { busy.value = null }
}
onMounted(load)
</script>
<template>
  <section class="mx-auto max-w-7xl space-y-6 px-4 py-10">
    <div>
      <h1 class="text-3xl font-extrabold">Klinikanyň tölegleri</h1>
      <p class="mt-1 text-sm text-slate-500">Diňe öz klinikaňyza degişli tölegler görkezilýär.</p>
    </div>
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
            <th class="p-3">Hereket</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in rows" :key="p.id" class="border-b dark:border-slate-800">
            <td class="p-3">{{ p.appointment?.booking_code }}</td>
            <td class="p-3">{{ p.appointment?.patient?.name }}</td>
            <td class="p-3">{{ p.appointment?.doctor?.user?.name }}</td>
            <td class="p-3">{{ p.amount }} {{ p.currency }}</td>
            <td class="p-3">{{ labels[p.status] || p.status }}</td>
            <td class="p-3">
              <div class="flex gap-2"><button v-if="p.status === 'pending'" @click="setStatus(p, 'paid')"
                  :disabled="busy === p.id"
                  class="rounded-lg bg-emerald-700 px-3 py-1.5 text-xs text-white">Tölenen</button><button
                  v-if="p.status === 'paid'" @click="setStatus(p, 'refunded')" :disabled="busy === p.id"
                  class="rounded-lg border border-amber-400 px-3 py-1.5 text-xs text-amber-700">Yzyna
                  gaýtaryldy</button></div>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-if="!rows.length" class="p-8 text-center text-slate-500">Töleg ýok.</p>
    </div>
  </section>
</template>
