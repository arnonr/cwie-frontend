import { ref } from "vue";
import { defineStore } from "pinia";
import ApiService from "@/core/services/ApiService";
import JwtService from "@/core/services/JwtService";

export interface User {
  name: string;
  surname: string;
  email: string;
  password: string;
  role_id: number;
  api_token: string;
  token: string;
  level: number;
}

export const useAuthStore = defineStore("auth", () => {
  const errors = ref({});
  const user = ref<User>({} as User);
  const isAuthenticated = ref(!!JwtService.getToken());
  const userData = localStorage.getItem("userData");
  const isAdmin = ref<boolean>(
    userData ? JSON.parse(userData)?.level === 1 : false
  );

  function setAuth(authUser: User) {
    isAuthenticated.value = true;
    user.value = authUser;
    errors.value = {};
    JwtService.saveToken(user.value.token);
    isAdmin.value = user.value.level == 1 ? true : false;
    // JwtService.saveToken(user.value.api_token);
  }

  function setError(error: any) {
    errors.value = { ...error };
  }

  function purgeAuth() {
    isAuthenticated.value = false;
    isAdmin.value = false;
    user.value = {} as User;
    errors.value = [];
    JwtService.destroyToken();
  }

  function login(credentials: User) {
    return ApiService.post("auth/login", credentials)
      .then(({ data }) => {
        setAuth(data);
        localStorage.setItem(
          "userData",
          JSON.stringify({
            ...data,
          })
        );

        localStorage.setItem("id_token", data.token);
      })
      .catch(({ response }) => {
        if (response.data.msg != "success") {
          setError({
            name: response.data.msg,
          });
        }
      });
  }

  function logout() {
    purgeAuth();
    localStorage.removeItem("userData");
    localStorage.removeItem("id_token");
  }

  function register(credentials: User) {
    return ApiService.post("register", credentials)
      .then(({ data }) => {
        setAuth(data);
      })
      .catch(({ response }) => {
        setError(response.data.errors);
      });
  }

  function forgotPassword(email: string) {
    return ApiService.post("forgot_password", email)
      .then(() => {
        setError({});
      })
      .catch(({ response }) => {
        setError(response.data.errors);
      });
  }

  function verifyAuth() {
    // if (JwtService.getToken()) {
    //   ApiService.setHeader();
    //   ApiService.post("verify_token", { api_token: JwtService.getToken() })
    //     .then(({ data }) => {
    //       setAuth(data);
    //     })
    //     .catch(({ response }) => {
    //       setError(response.data.errors);
    //       purgeAuth();
    //     });
    // } else {
    //   purgeAuth();
    // }
  }

  return {
    errors,
    user,
    isAuthenticated,
    isAdmin,
    login,
    logout,
    register,
    forgotPassword,
    verifyAuth,
  };
});
