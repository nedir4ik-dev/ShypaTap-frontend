<template>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

        <!-- Header & Search Box -->
        <div
            class="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6 md:p-8 shadow-xl">
            <h1 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">Lukmanlar we Klinikalar</h1>
            <p class="text-slate-600 dark:text-slate-400 text-sm mb-6">Özüňize iň ýakyn klinikany we hünärmeni saýlap,
                boş wagtyňyza göni onlaýn bron ediň.</p>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <!-- Search Input -->
                <div class="relative">
                    <input v-model="searchQuery" type="text" placeholder="Lukmanyň ady ýa-da hünäri..."
                        class="w-full px-4 py-3 pl-11 rounded-2xl bg-slate-100/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm" />
                    <span class="absolute left-4 top-3.5 text-slate-400">🔍</span>
                </div>

                <!-- Specialization Filter -->
                <select v-model="selectedSpecialization"
                    class="w-full px-4 py-3 rounded-2xl bg-slate-100/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm">
                    <option value="">Ähli hünär ugurlary</option>
                    <option v-for="spec in specializations" :key="spec.id" :value="spec.name">{{ spec.name }}</option>
                </select>

                <!-- Clinic Filter -->
                <select v-model="selectedClinic"
                    class="w-full px-4 py-3 rounded-2xl bg-slate-100/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm">
                    <option value="">Ähli klinikalar</option>
                    <option v-for="clinic in clinics" :key="clinic.id" :value="clinic.name">{{ clinic.name }}</option>
                </select>
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="text-center py-12 text-slate-500">
            Maglumatlar bazadan çekilýär...
        </div>

        <!-- Doctors Grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="doctor in filteredDoctors" :key="doctor.id"
                class="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all flex flex-col justify-between">
                <div>
                    <div class="flex items-center space-x-4 mb-4">
                        <img v-if="doctor.photo" :src="doctor.photo" :alt="doctor.name"
                            class="h-14 w-14 rounded-2xl object-cover" />
                        <div v-else
                            class="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-xl font-bold text-emerald-800">
                            {{ doctor.name ? doctor.name.charAt(0) : 'L' }}</div>
                        <div>
                            <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100">{{ doctor.name }}</h3>
                            <p class="text-xs font-semibold text-emerald-700 dark:text-blue-400">{{
                                doctor.specialization?.name || doctor.specialization }}</p>
                            <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Klinika: {{ doctor.clinic?.name
                                || 'Merkezi Klinika' }}</p>
                        </div>
                    </div>

                    <div
                        class="space-y-2 text-xs text-slate-600 dark:text-slate-300 mb-6 border-t border-slate-100 dark:border-slate-800 pt-4">
                        <div class="flex justify-between">
                            <span>Iş tejribesi:</span>
                            <span class="font-medium">{{ doctor.experience_years ?? '—' }} {{ doctor.experience_years ==
                                null ? '' : 'ýyl' }}</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Kabul ediş bahasy:</span>
                            <span class="font-medium text-emerald-600 dark:text-emerald-400">{{ doctor.consultation_fee
                                ?? 'Bahasy görkezilmedi' }} {{ doctor.consultation_fee == null ? '' : (doctor.currency
                                || 'TMT') }}</span>
                        </div>
                    </div>
                </div>

                <!-- Action Button -->
                <router-link :to="`/doctors/${doctor.id}`"
                    class="w-full py-2.5 px-4 bg-emerald-700 hover:bg-blue-700 text-white text-center text-sm font-medium rounded-xl shadow-lg shadow-blue-500/30 transition-all block">
                    Profili we wagtlary görmek
                </router-link>
            </div>
        </div>

        <!-- No results message -->
        <div v-if="!loading && filteredDoctors.length === 0"
            class="text-center py-12 text-slate-500 dark:text-slate-400">
            Gözlegiňize görä hiç hili lukman tapylmady.
        </div>

    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/services/api'

const route = useRoute()
const doctors = ref([])
const specializations = ref([])
const clinics = ref([])
const loading = ref(true)

const searchQuery = ref(String(route.query.search || ''))
const selectedSpecialization = ref(String(route.query.specialization || ''))
const selectedClinic = ref('')

onMounted(async () => {
    try {
        // Backend API-den hakyky maglumatlary çekmek
        const [docRes, specRes, clinicRes] = await Promise.all([
            api.getDoctors(),
            api.getSpecializations ? api.getSpecializations() : Promise.resolve({ data: [] }),
            api.getClinics ? api.getClinics() : Promise.resolve({ data: [] })
        ])

        doctors.value = (docRes.data.data || docRes.data).map(d => ({ ...d, name: d.user?.name || d.name, clinic: d.clinics?.[0] || d.clinic, photo: d.photo_url }))
        specializations.value = specRes.data
        clinics.value = clinicRes.data
    } catch (error) {
        console.error('Maglumatlary bazadan alyp bolmady:', error)
    } finally {
        loading.value = false
    }
})

const filteredDoctors = computed(() => {
    return doctors.value.filter(doc => {
        const docName = doc.name || ''
        const docSpec = doc.specialization?.name || doc.specialization || ''
        const docClinic = doc.clinic?.name || doc.clinicName || ''

        const matchesSearch = docName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            docSpec.toLowerCase().includes(searchQuery.value.toLowerCase())
        const matchesSpec = selectedSpecialization.value === '' || docSpec === selectedSpecialization.value
        const matchesClinic = selectedClinic.value === '' || docClinic === selectedClinic.value
        return matchesSearch && matchesSpec && matchesClinic
    })
})
</script>