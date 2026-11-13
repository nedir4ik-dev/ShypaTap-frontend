<template>
    <div v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
        <div
            class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">

            <!-- Modal Header -->
            <div class="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
                <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    <slot name="title">Maglumat</slot>
                </h3>
                <button @click="$emit('close')"
                    class="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <!-- Modal Body -->
            <div class="p-6 text-slate-600 dark:text-slate-300">
                <slot />
            </div>

            <!-- Modal Footer -->
            <div v-if="$slots.footer"
                class="px-6 py-4 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-200 dark:border-slate-800 flex justify-end space-x-3">
                <slot name="footer" />
            </div>

        </div>
    </div>
</template>

<script setup>
defineProps({
    isOpen: { type: Boolean, default: false }
})

defineEmits(['close'])
</script>