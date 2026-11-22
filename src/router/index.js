import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/authStore";
import PublicLayout from "@/layouts/PublicLayout.vue";
import HomeView from "@/views/public/HomeView.vue";
import DoctorsView from "@/views/public/DoctorsView.vue";
import DoctorsDetail from "@/views/public/DoctorsDetail.vue";
import LoginView from "@/views/public/LoginView.vue";
import RegisterView from "@/views/public/RegisterView.vue";
import PatientDashboard from "@/views/patient/DashboardView.vue";
import PatientAppointments from "@/views/patient/Appointments.vue";
import DoctorDashboard from "@/views/doctor/DashboardView.vue";
import DoctorSchedule from "@/views/doctor/ScheduleView.vue";
import DoctorAppointments from "@/views/doctor/AppointmentsView.vue";
import DoctorCalendar from "@/views/doctor/CalendarView.vue";
import RoleDashboard from "@/views/shared/RoleDashboard.vue";
import AccountView from "@/views/shared/AccountView.vue";
import ClinicsView from "@/views/public/ClinicsView.vue";
import DoctorProfileView from "@/views/doctor/DoctorProfileView.vue";
import AppointmentDetailView from "@/views/doctor/AppointmentDetailView.vue";
import PreferencesView from "@/views/shared/PreferencesView.vue";
import ReceptionistPaymentsView from "@/views/receptionist/PaymentsView.vue";
const routes = [
  {
    path: "/",
    component: PublicLayout,
    children: [
      { path: "", name: "home", component: HomeView },
      { path: "doctors", name: "doctors", component: DoctorsView },
      { path: "clinics", name: "clinics", component: ClinicsView },
      { path: "doctors/:id", name: "doctor-detail", component: DoctorsDetail },
      {
        path: "login",
        name: "login",
        component: LoginView,
        meta: { guestOnly: true },
      },
      {
        path: "register",
        name: "register",
        component: RegisterView,
        meta: { guestOnly: true },
      },
      {
        path: "patient/dashboard",
        component: PatientDashboard,
        meta: { requiresAuth: true, role: "patient" },
      },
      {
        path: "patient/appointments",
        component: PatientAppointments,
        meta: { requiresAuth: true, role: "patient" },
      },
      {
        path: "patient/profile",
        component: AccountView,
        props: { mode: "profile" },
        meta: { requiresAuth: true, role: "patient" },
      },
      {
        path: "patient/settings",
        component: PreferencesView,
        meta: { requiresAuth: true, role: "patient" },
      },
      {
        path: "patient/password",
        component: AccountView,
        props: { mode: "password" },
        meta: { requiresAuth: true, role: "patient" },
      },
      {
        path: "patient/notifications",
        component: AccountView,
        props: { mode: "notifications" },
        meta: { requiresAuth: true, role: "patient" },
      },
      {
        path: "doctor/dashboard",
        component: DoctorDashboard,
        meta: { requiresAuth: true, role: "doctor" },
      },
      {
        path: "doctor/settings",
        component: PreferencesView,
        meta: { requiresAuth: true, role: "doctor" },
      },
      {
        path: "doctor/schedule",
        component: DoctorSchedule,
        meta: { requiresAuth: true, role: "doctor" },
      },
      {
        path: "doctor/calendar",
        component: DoctorCalendar,
        meta: { requiresAuth: true, role: "doctor" },
      },
      {
        path: "doctor/appointments/:id",
        component: AppointmentDetailView,
        meta: { requiresAuth: true, role: "doctor" },
      },
      {
        path: "doctor/appointments",
        component: DoctorAppointments,
        meta: { requiresAuth: true, role: "doctor" },
      },
      {
        path: "doctor/notifications",
        component: AccountView,
        props: { mode: "notifications" },
        meta: { requiresAuth: true, role: "doctor" },
      },
      {
        path: "doctor/profile",
        component: DoctorProfileView,
        meta: { requiresAuth: true, role: "doctor" },
      },
      {
        path: "receptionist/settings",
        component: PreferencesView,
        meta: { requiresAuth: true, role: "receptionist" },
      },
      {
        path: "receptionist/payments",
        component: ReceptionistPaymentsView,
        meta: { requiresAuth: true, role: "receptionist" },
      },
      {
        path: "receptionist/profile",
        component: AccountView,
        props: { mode: "profile" },
        meta: { requiresAuth: true, role: "receptionist" },
      },
      {
        path: "receptionist/:section?",
        component: RoleDashboard,
        meta: { requiresAuth: true, role: "receptionist" },
      },
      {
        path: "receptionist/dashboard",
        component: RoleDashboard,
        meta: { requiresAuth: true, role: "receptionist" },
      },
    ],
  },
];
const router = createRouter({ history: createWebHistory(), routes });
let hydrated = false;
router.beforeEach(async (to) => {
  const auth = useAuthStore();
  if (!hydrated) {
    await auth.hydrate();
    hydrated = true;
  }
  if (to.meta.guestOnly && auth.token) return auth.dashboardPath();
  if (to.meta.requiresAuth && !auth.token) return "/login";
  if (to.meta.role && auth.user?.role !== to.meta.role)
    return auth.token ? auth.dashboardPath() : "/";
});
export default router;
