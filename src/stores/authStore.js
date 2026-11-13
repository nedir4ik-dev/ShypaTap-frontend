import { defineStore } from "pinia";
import { ref } from "vue";
import api from "@/services/api";

export const useAuthStore = defineStore("auth", () => {
  const user = ref(JSON.parse(localStorage.getItem("user") || "null"));
  const token = ref(localStorage.getItem("token"));
  const loading = ref(false);
  const setSession = (u, t) => {
    user.value = u;
    token.value = t;
    localStorage.setItem("user", JSON.stringify(u));
    localStorage.setItem("token", t);
  };
  const clearSession = () => {
    user.value = null;
    token.value = null;
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };
  const hydrate = async () => {
    if (!token.value) return false;
    try {
      const { data } = await api.me();
      user.value = data.user;
      localStorage.setItem("user", JSON.stringify(user.value));
      return true;
    } catch {
      clearSession();
      return false;
    }
  };
  const login = async (credentials) => {
    loading.value = true;
    try {
      const { data } = await api.login(credentials);
      setSession(data.user, data.token);
      return { success: true, user: data.user };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Giriş maglumatlary nädogry.",
      };
    } finally {
      loading.value = false;
    }
  };
  const register = async (payload) => {
    const { data } = await api.register(payload);
    return data;
  };
  const logout = async () => {
    try {
      if (token.value) await api.logout();
    } finally {
      clearSession();
    }
  };
  const dashboardPath = () =>
    ({
      admin: "/admin/dashboard",
      doctor: "/doctor/dashboard",
      receptionist: "/receptionist/dashboard",
      patient: "/patient/dashboard",
    })[user.value?.role] || "/";
  return {
    user,
    token,
    loading,
    login,
    register,
    logout,
    hydrate,
    dashboardPath,
  };
});
