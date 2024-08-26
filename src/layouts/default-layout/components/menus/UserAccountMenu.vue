<template>
  <!--begin::Menu-->
  <div
    class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-semibold py-4 fs-6 w-275px"
    data-kt-menu="true"
  >
    <!--begin::Menu item-->
    <div class="menu-item px-3">
      <div class="menu-content d-flex align-items-center px-3">
        <!--begin::Avatar-->
        <div class="symbol symbol-50px me-5">
          <img alt="Logo" :src="getAssetPath('media/avatars/blank.png')" />
        </div>
        <!--end::Avatar-->

        <!--begin::Username-->
        <div class="">
          <div class="fw-bold align-items-center fs-7">
            {{ userData.name }}
          </div>
          <!-- <a href="#" class="fw-semibold text-muted fs-7">{{
            userData.email
          }}</a> -->
        </div>

        <!--end::Username-->
      </div>
    </div>
    <!--end::Menu item-->

    <!--begin::Menu separator-->
    <div class="separator my-2"></div>
    <!--end::Menu separator-->

    <!--begin::Menu item-->
    <div class="menu-item px-5">
      <a @click="signOut()" class="menu-link px-5"> ออกจากระบบ </a>
    </div>
    <!--end::Menu item-->
  </div>
  <!--end::Menu-->
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "kt-user-menu",
  components: {},
  setup() {
    // UI Variable
    const router = useRouter();
    const store = useAuthStore();
    // Variable
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");

    // Event
    const signOut = () => {
      store.logout();
      router.push({ name: "sign-in" });
    };

    return {
      signOut,
      getAssetPath,
      userData,
    };
  },
});
</script>
