<script setup>
import { onMounted, ref } from 'vue'
import api from '@/services/api'

const form = ref({ theme: 'system', timezone: 'Asia/Ashgabat', notifications_enabled: true, appointment_reminders: true, email_notifications: false })
const loading = ref(true)
const saving = ref(false)
const message = ref('')
const error = ref('')

onMounted(async () => {
  try {
    const { data } = await api.client.get('/settings/me')
    const values = data.data || data
    form.value = {
      ...form.value, ...values,
      notifications_enabled: values.notifications_enabled === true || values.notifications_enabled === '1' || values.notifications_enabled === 1,
      appointment_reminders: values.appointment_reminders === true || values.appointment_reminders === '1' || values.appointment_reminders === 1,
      email_notifications: values.email_notifications === true || values.email_notifications === '1' || values.email_notifications === 1
    }
  } catch (e) { error.value = e.response?.data?.message || 'Sazlamalary alyp bolmady.' }
  finally { loading.value = false }
})
async function save() {
  saving.value = true; message.value = ''; error.value = ''
  try {
    await api.client.patch('/settings/me', form.value)
    if (form.value.theme !== 'system') {
      document.documentElement.classList.toggle('dark', form.value.theme === 'dark')
      localStorage.setItem('theme', form.value.theme)
    } else {
      localStorage.removeItem('theme')
    }
    message.value = 'Şahsy sazlamalar saklandy.'
  }
  catch (e) { error.value = e.response?.data?.message || 'Saklap bolmady.' }
  finally { saving.value = false }
}
</script>

<template>
  <section class="mx-auto max-w-3xl px-4 py-10">
    <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
      <h1 class="text-2xl font-extrabold">Şahsy sazlamalar</h1>
      <p class="mt-1 text-sm text-slate-500">Diňe öz hasabyňyza degişli sazlamalary üýtgedip bilersiňiz.</p>
      <p v-if="message" class="mt-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">{{ message }}</p>
      <p v-if="error" class="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{{ error }}</p>
      <p v-if="loading" class="py-8 text-center">Ýüklenýär...</p>
      <form v-else @submit.prevent="save" class="mt-6 space-y-5">
        <label class="block text-sm font-semibold">Tema
          <select v-model="form.theme"
            class="mt-2 w-full rounded-xl border p-3 dark:border-slate-700 dark:bg-slate-800">
            <option value="system">Ulgam boýunça</option>
            <option value="light">Açyk</option>
            <option value="dark">Garaňky</option>
          </select>
        </label>
        <label class="block text-sm font-semibold">Wagt zolagy
          <input v-model="form.timezone"
            class="mt-2 w-full rounded-xl border p-3 dark:border-slate-700 dark:bg-slate-800"
            placeholder="Asia/Ashgabat" />
        </label>
        <label class="flex items-center gap-3"><input v-model="form.notifications_enabled" type="checkbox"
            class="accent-emerald-600" /> Bildirişleri almak</label>
        <label class="flex items-center gap-3"><input v-model="form.appointment_reminders" type="checkbox"
            class="accent-emerald-600" /> Kabul ýatlatmalary</label>
        <label class="flex items-center gap-3"><input v-model="form.email_notifications" type="checkbox"
            class="accent-emerald-600" /> E-poçta bildirişleri</label>
        <button :disabled="saving"
          class="rounded-xl bg-emerald-700 px-5 py-3 font-semibold text-white disabled:opacity-50">{{ saving ?
            'Saklanýar...' : 'Sazlamalary sakla' }}</button>
      </form>
    </div>
  </section>
</template>
