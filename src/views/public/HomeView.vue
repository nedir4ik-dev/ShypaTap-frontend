<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
    <section class="relative overflow-hidden bg-linear-to-br from-emerald-700 via-teal-800
       to-slate-900 rounded-3xl p-8 md:p-14 text-white shadow-2xl border border-white/10 
       flex flex-col lg:flex-row items-center justify-between gap-10">

      <div class="absolute -top-24 -right-24 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none">
      </div>
      <div class="absolute -bottom-24 -left-24 w-80 h-80 bg-teal-400/20 rounded-full blur-3xl pointer-events-none">
      </div>

      <div class="max-w-xl space-y-6 relative z-10">
        <span class="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md text-emerald-100
           text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-wider border border-white/20">
          <span class="w-2 h-2 rounded-full bg-emerald-300 animate-ping"></span>
          Onlaýn Lukman Kabul Edişi
        </span>

        <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
          Özüňize amatly wagtda <span class="text-emerald-300">lukmana ýazylyň</span>
        </h1>

        <p class="text-emerald-100/90 text-base md:text-lg leading-relaxed">
          Nobat garaşyp wagt ýitirmäň. Häzir tejribeli lukmany we klinikany saýlap, boş wagtyňyza göni onlaýn bron ediň.
        </p>

        <div class="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-2 rounded-2xl shadow-xl
           border border-white/40 dark:border-slate-700/60 flex flex-col sm:flex-row gap-2">
          <div class="flex items-center gap-3 px-4 py-2.5 flex-1 text-slate-700 dark:text-slate-200">
            <i class="ti ti-search text-xl text-emerald-600 shrink-0"></i>
            <input v-model="searchQuery" type="text" placeholder="Lukmanyň ady, hünäri ýa-da klinika..." class="w-full bg-transparent focus:outline-none text-sm text-slate-900 dark:text-slate-100
               placeholder-slate-400" @keyup.enter="handleSearch">
          </div>
          <button @click="handleSearch"
            class="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-7 py-3 rounded-xl
          transition-all text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30 cursor-pointer">
            <i class="ti ti-search text-lg"></i> Gözlemek
          </button>
        </div>
      </div>

      <div class="w-full lg:w-5/12 flex justify-center relative z-10">
        <div
          class="w-full max-w-sm bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl space-y-5">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div
                class="w-12 h-12 rounded-2xl bg-emerald-400/20 border border-emerald-300/30 flex items-center justify-center text-2xl text-emerald-300">
                <i class="ti ti-stethoscope"></i>
              </div>
              <div>
                <h3 class="font-bold text-white text-base">Çalt Bron Ulgamy</h3>
                <p class="text-xs text-emerald-200">Şu günki boş wagtlar elýeterli</p>
              </div>
            </div>
          </div>

          <div class="space-y-2.5">
            <div class="p-3 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-between text-sm">
              <span class="text-emerald-100">1. Lukmany saýlaň</span>
              <span class="text-emerald-300 font-bold"><i class="ti ti-check"></i></span>
            </div>
            <div class="p-3 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-between text-sm">
              <span class="text-emerald-100">2. Boş wagty belläň</span>
              <span class="text-emerald-300 font-bold"><i class="ti ti-check"></i></span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-100">Meşhur hünär ugurlary</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400">Gerekli lukmançylyk ugruny saýlap hünärmenleri görüň</p>
        </div>
        <router-link to="/doctors" class="text-sm font-semibold text-emerald-700 dark:text-emerald-400 hover:underline">
          Ählisini görmek &rarr;
        </router-link>
      </div>

      <div class="splide spec-slider">
        <div class="splide__track">
          <ul class="splide__list">
            <li v-for="(spec, index) in specializations" :key="spec.id" class="splide__slide pb-2">
              <div @click="selectSpecialization(spec.name)"
                class="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 hover:shadow-xl hover:border-emerald-500/50 transition-all flex flex-col items-center text-center cursor-pointer group h-full">
                <div
                  class="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition shadow-inner">
                  <i :class="getSpecIcon(spec.name, index)"></i>
                </div>
                <h3 class="font-semibold text-sm text-slate-800 dark:text-slate-200">{{ spec.name }}</h3>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <section v-if="doctors.length > 0" class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-100">Saýlanan Lukmanlar</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400">Ýokary tejribeli hünärmenleriň kabul edişine ýazylyň</p>
        </div>
        <router-link to="/doctors" class="text-sm font-semibold text-emerald-700 dark:text-emerald-400 hover:underline">
          Ähli lukmanlar &rarr;
        </router-link>
      </div>

      <div class="splide doctor-slider">
        <div class="splide__track">
          <ul class="splide__list">
            <li v-for="doctor in doctors" :key="doctor.id" class="splide__slide pb-2">
              <div
                class="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all flex flex-col justify-between h-full">
                <div>
                  <div class="flex items-center gap-4 mb-4">
                    <div
                      class="w-14 h-14 rounded-2xl bg-emerald-600/15 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-bold text-xl flex items-center justify-center shrink-0">
                      {{ (doctor.user?.name || doctor.name || 'L').charAt(0) }}
                    </div>
                    <div>
                      <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100 line-clamp-1">
                        {{ doctor.user?.name || doctor.name }}
                      </h3>
                      <p
                        class="text-xs font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1 mt-0.5">
                        <i class="ti ti-stethoscope"></i> {{ doctor.specialization?.name || doctor.specialization }}
                      </p>
                    </div>
                  </div>

                  <div
                    class="space-y-2 text-xs text-slate-600 dark:text-slate-300 mb-6 border-t border-slate-200/60 dark:border-slate-800 pt-4">
                    <div class="flex justify-between items-center">
                      <span>Iş tejribesi:</span>
                      <span class="font-semibold">{{ doctor.experience_years || 5 }} ýyl</span>
                    </div>
                    <div class="flex justify-between items-center">
                      <span>Bahasy:</span>
                      <span class="font-semibold text-emerald-600 dark:text-emerald-400">{{ doctor.consultation_fee ||
                        100 }} TMT</span>
                    </div>
                  </div>
                </div>

                <router-link :to="`/doctors/${doctor.id}`"
                  class="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white text-center text-sm font-medium rounded-xl shadow-md transition-all flex items-center justify-center gap-2">
                  <i class="ti ti-calendar-event"></i> Profili görmek
                </router-link>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <section v-if="clinics.length > 0" class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-100">Hyzmatdaş Klinikalar</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400">Şäheriň öňdebaryjy lukmançylyk merkezleri</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="clinic in clinics" :key="clinic.id"
          class="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-lg space-y-4">
          <div class="flex items-start justify-between gap-3">
            <div
              class="w-12 h-12 rounded-2xl bg-teal-600/15 text-teal-700 dark:text-teal-400 flex items-center justify-center text-2xl shrink-0">
              <i class="ti ti-building-hospital"></i>
            </div>
            <span
              class="text-xs px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
              {{ clinic.city || 'Aşgabat' }}
            </span>
          </div>
          <div>
            <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100">{{ clinic.name }}</h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">📍 {{ clinic.address || 'Salgysy görkezilmedik'
            }}</p>
          </div>
          <button @click="selectClinic(clinic.name)"
            class="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-emerald-600 hover:text-white dark:bg-slate-800 dark:hover:bg-emerald-600 text-slate-700 dark:text-slate-200 text-xs font-semibold transition cursor-pointer">
            Lukmanlary görmek
          </button>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import api from '@/services/api'
import { useRouter } from 'vue-router'

const router = useRouter()
const searchQuery = ref('')

const specializations = ref([])
const doctors = ref([])
const clinics = ref([])

const fallbackIcons = ['ti ti-heartbeat', 'ti ti-dental', 'ti ti-baby-bottle', 'ti ti-brain', 'ti ti-pill', 'ti ti-eye', 'ti ti-stethoscope', 'ti ti-virus']

const getSpecIcon = (name, index) => {
  const n = (name || '').toLowerCase()
  if (n.includes('kardio')) return 'ti ti-heartbeat'
  if (n.includes('stomato') || n.includes('diş')) return 'ti ti-dental'
  if (n.includes('pediatr') || n.includes('çaga')) return 'ti ti-baby-bottle'
  if (n.includes('newro')) return 'ti ti-brain'
  return fallbackIcons[index % fallbackIcons.length]
}

onMounted(async () => {
  try {
    const [specRes, docRes, clinicRes] = await Promise.all([
      api.getSpecializations(),
      api.getDoctors(),
      api.getClinics()
    ])
    specializations.value = specRes.data.data || specRes.data || []
    doctors.value = docRes.data.data || docRes.data || []
    clinics.value = clinicRes.data.data || clinicRes.data || []

    await nextTick()

    if (document.querySelector('.spec-slider')) {
      new Splide('.spec-slider', {
        type: 'loop',
        perPage: 4,
        perMove: 1,
        gap: '1rem',
        drag: 'free',
        snap: true,
        autoplay: true,
        interval: 3000,
        arrows: false,
        pagination: false,
        breakpoints: {
          1024: { perPage: 4 },
          768: { perPage: 3 },
          640: { perPage: 2 }
        }
      }).mount()
    }

    if (document.querySelector('.doctor-slider')) {
      new Splide('.doctor-slider', {
        type: 'loop',
        perPage: 3,
        perMove: 1,
        gap: '1rem',
        drag: 'free',
        snap: true,
        autoplay: true,
        interval: 3000,
        arrows: false,
        pagination: false,
        breakpoints: {
          1024: { perPage: 2 },
          640: { perPage: 1 }
        }
      }).mount()
    }

  } catch (error) {
    console.error('Maglumatlar ýüklenmedi:', error)
  }
})

const handleSearch = () => {
  router.push({ path: '/doctors', query: { search: searchQuery.value } })
}

const selectSpecialization = (specName) => {
  router.push({ path: '/doctors', query: { specialization: specName } })
}

const selectClinic = (clinicName) => {
  router.push({ path: '/doctors', query: { clinic: clinicName } })
}
</script>