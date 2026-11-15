<script setup>
import { ref, onBeforeUnmount } from 'vue'
import api from '@/services/api'

const props = defineProps({
  user: { type: Object, required: true }
})
const emit = defineEmits(['updated'])
const input = ref(null)
const preview = ref('')
const busy = ref(false)
const error = ref('')
const message = ref('')
let previewObjectUrl = null

function clearPreview() {
  if (previewObjectUrl) URL.revokeObjectURL(previewObjectUrl)
  previewObjectUrl = null
  preview.value = ''
}

onBeforeUnmount(clearPreview)

function chooseFile() {
  input.value?.click()
}

async function upload(event) {
  const file = event.target.files?.[0]
  if (!file) return

  error.value = ''
  message.value = ''
  if (!['image/jpeg', 'image/png'].includes(file.type)) {
    error.value = 'Diňe JPG, JPEG ýa-da PNG surat saýlaň.'
    event.target.value = ''
    return
  }
  if (file.size > 3 * 1024 * 1024) {
    error.value = 'Suratyň ölçegi 3 MB-dan geçmeli däl.'
    event.target.value = ''
    return
  }

  clearPreview()
  previewObjectUrl = URL.createObjectURL(file)
  preview.value = previewObjectUrl
  const form = new FormData()
  form.append('avatar', file)
  busy.value = true
  try {
    const { data } = await api.client.post('/profile/avatar', form)
    emit('updated', data.user)
    message.value = data.message || 'Profil suraty täzelendi.'
  } catch (e) {
    error.value = e.response?.data?.errors?.avatar?.[0] || e.response?.data?.message || 'Suraty ýükläp bolmady.'
  } finally {
    clearPreview()
    busy.value = false
    event.target.value = ''
  }
}

async function removeAvatar() {
  if (!props.user?.avatar_url || busy.value) return
  busy.value = true
  error.value = ''
  message.value = ''
  try {
    const { data } = await api.client.delete('/profile/avatar')
    emit('updated', data.user)
    message.value = data.message || 'Profil suraty aýryldy.'
  } catch (e) {
    error.value = e.response?.data?.message || 'Suraty aýryp bolmady.'
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
    <div
      class="h-24 w-24 shrink-0 overflow-hidden rounded-full border-2 border-emerald-200 bg-emerald-100 dark:border-emerald-900 dark:bg-emerald-950">
      <img v-if="preview || user?.avatar_url" :src="preview || user.avatar_url" alt="Profil suraty"
        class="h-full w-full object-cover">
      <div v-else
        class="flex h-full w-full items-center justify-center text-4xl font-extrabold text-emerald-800 dark:text-emerald-300">
        {{ (user?.name || 'Ş').trim().charAt(0).toLocaleUpperCase() }}
      </div>
    </div>
    <div class="space-y-2">
      <p class="text-sm font-semibold text-slate-800 dark:text-slate-100">Profil suraty</p>
      <p class="text-xs text-slate-500 dark:text-slate-400">JPG ýa-da PNG, iň köp 3 MB. Serwerde WebP görnüşine
        öwrülýär.</p>
      <div class="flex flex-wrap gap-2">
        <button type="button" @click="chooseFile" :disabled="busy"
          class="rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600 disabled:opacity-50">
          {{ busy ? 'Işlenýär...' : 'Suraty saýla' }}
        </button>
        <button v-if="user?.avatar_url" type="button" @click="removeAvatar" :disabled="busy"
          class="rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50">
          Suraty aýyr
        </button>
      </div>
      <input ref="input" type="file" accept=".jpg,.jpeg,.png,image/jpeg,image/png" class="hidden" @change="upload">
      <p v-if="message" class="text-xs text-emerald-700 dark:text-emerald-400">{{ message }}</p>
      <p v-if="error" class="text-xs text-red-600 dark:text-red-400">{{ error }}</p>
    </div>
  </div>
</template>
