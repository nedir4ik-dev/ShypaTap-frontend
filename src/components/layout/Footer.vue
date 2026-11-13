<script setup>
</script>
<template>
    <footer
        class="mt-20 border-t border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-950/50 backdrop-blur-md transition-colors duration-300">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">

                <div class="space-y-4 md:col-span-1">
                    <div class="flex items-center space-x-3">
                        <div
                            class="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-emerald-500/30">
                            Ş
                        </div>
                        <span
                            class="text-lg font-bold bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                            ŞypaTap
                        </span>
                    </div>
                    <p class="text-sm text-slate-500 dark:text-slate-400">
                        Näsaglar we lukmanlar için iň amatly sanly kabul ediş we bron ulgamy.
                    </p>
                </div>

                <div>
                    <h4 class="text-sm font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-4">
                        Sahypalar</h4>
                    <ul class="space-y-2 text-sm">
                        <li>
                            <router-link to="/"
                                class="text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Baş
                                sahypa</router-link>
                        </li>
                        <li>
                            <router-link to="/doctors"
                                class="text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Lukmanlar</router-link>
                        </li>
                        <li>
                            <router-link to="/clinics"
                                class="text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Klinikalar</router-link>
                        </li>
                    </ul>
                </div>

                <div>
                    <h4 class="text-sm font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-4">
                        Hünär ugurlary</h4>
                    <ul class="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                        <li>Kardiologiýa</li>
                        <li>Stomatologiýa</li>
                        <li>Pedatriýa</li>
                        <li>Newrologiýa</li>
                    </ul>
                </div>

                <div>
                    <h4 class="text-sm font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-4">
                        Habarlaşmak</h4>
                    <p class="text-sm text-slate-600 dark:text-slate-400 mb-2">Email: info@sypatap.tm</p>
                    <p class="text-sm text-slate-600 dark:text-slate-400">Telefon: +993 (12) 00-00-00</p>
                </div>

            </div>

            <div
                class="pt-8 border-t border-slate-200/50 dark:border-slate-800/50 flex flex-col sm:flex-row items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                <p>&copy; 2026 ŞypaTap. Ähli hukuklar goralan.</p>
            </div>
        </div>
    </footer>
</template>