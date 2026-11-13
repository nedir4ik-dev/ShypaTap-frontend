<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'
import SearchFilter from '@/components/public/SearchFilter.vue'
import DoctorCard from '@/components/public/DoctorCard.vue'

const route = useRoute()
const router = useRouter()

const doctors = ref([])
const specializations = ref([])
const clinics = ref([])
const loading = ref(true)

const searchQuery = ref(String(route.query.search || ''))
const selectedSpecialization = ref(String(route.query.specialization || ''))
const selectedClinic = ref(String(route.query.clinic || ''))

onMounted(async () => {
    try {
        const [docRes, specRes, clinicRes] = await Promise.all([
            api.getDoctors(),
            api.getSpecializations ? api.getSpecializations() : Promise.resolve({ data: [] }),
            api.getClinics ? api.getClinics() : Promise.resolve({ data: [] })
        ])

        doctors.value = (docRes.data.data || docRes.data || []).map(d => ({
            ...d,
            name: d.user?.name || d.name,
            clinic: d.clinics?.[0] || d.clinic,
            photo: d.photo_url
        }))
        specializations.value = specRes.data.data || specRes.data || []
        clinics.value = clinicRes.data.data || clinicRes.data || []
    } catch (error) {
        console.error('Maglumatlary bazadan alyp bolmady:', error)
    } finally {
        loading.value = false
    }
})

watch(() => route.query, (newQuery) => {
    searchQuery.value = String(newQuery.search || '')
    selectedSpecialization.value = String(newQuery.specialization || '')
    selectedClinic.value = String(newQuery.clinic || '')
})

watch([searchQuery, selectedSpecialization, selectedClinic], ([newSearch, newSpec, newClinic]) => {
    const query = {}
    if (newSearch) query.search = newSearch
    if (newSpec) query.specialization = newSpec
    if (newClinic) query.clinic = newClinic
    router.replace({ query })
})

const filteredDoctors = computed(() => {
    return doctors.value.filter(doc => {
        const docName = doc.name || ''
        const docSpec = doc.specialization?.name || doc.specialization || ''

        const doctorClinicsList = doc.clinics?.length
            ? doc.clinics.map(c => c.name)
            : [doc.clinic?.name || doc.clinicName || '']

        const matchesSearch = docName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            docSpec.toLowerCase().includes(searchQuery.value.toLowerCase())

        const matchesSpec = selectedSpecialization.value === '' || docSpec === selectedSpecialization.value

        const matchesClinic = selectedClinic.value === '' || doctorClinicsList.includes(selectedClinic.value)

        return matchesSearch && matchesSpec && matchesClinic
    })
})
</script>

<template>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <SearchFilter v-model:searchQuery="searchQuery" v-model:selectedSpecialization="selectedSpecialization"
            v-model:selectedClinic="selectedClinic" :specializations="specializations" :clinics="clinics" />

        <div v-if="loading" class="text-center py-12 text-slate-500">
            Maglumatlar bazadan çekilýär...
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DoctorCard v-for="doctor in filteredDoctors" :key="doctor.id" :doctor="doctor" />
        </div>

        <div v-if="!loading && filteredDoctors.length === 0"
            class="text-center py-12 text-slate-500 dark:text-slate-400">
            Gözlegiňize görä hiç hili lukman tapylmady.
        </div>
    </div>
</template>