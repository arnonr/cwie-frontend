<template>
  <!--begin::Authentication Layout -->
  <div class="d-flex flex-column flex-lg-row flex-column-fluid">
    <!--begin::Body-->
    <div
      class="d-flex flex-column flex-lg-row-fluid w-lg-50 p-10 order-2 order-lg-1"
    >
      <!--begin::Form-->
      <div
        class="d-flex flex-center flex-column flex-lg-row-fluid"
      >
        <!--begin::Wrapper-->
        <div class="w-lg-500px p-10">
          <router-view></router-view>
        </div>
        <!--end::Wrapper-->
      </div>
      <!--end::Form-->

      <!--begin::Footer-->
      <!-- <div class="d-flex flex-center flex-wrap px-5">
        <div class="d-flex fw-semibold text-primary fs-base">
          <a href="#" class="px-5" target="_blank">Terms</a>

          <a href="#" class="px-5" target="_blank">Plans</a>

          <a href="#" class="px-5" target="_blank">Contact Us</a>
        </div>
      </div> -->
      <!--end::Footer-->
    </div>
    <!--end::Body-->
  </div>
  <!--end::Authentication Layout -->
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent, onMounted, computed } from "vue";
import LayoutService from "@/core/services/LayoutService";
import { useBodyStore } from "@/stores/body";

export default defineComponent({
  name: "auth-layout",
  components: {},
  setup() {
    const store = useBodyStore();

    onMounted(() => {
      LayoutService.emptyElementClassesAndAttributes(document.body);

      store.addBodyClassname("app-blank");
      store.addBodyClassname("bg-body");
      store.addBodyClassname("bg-img-auth");

      
    });

    return {
      getAssetPath,
    };
  },
});
</script>

<style>
.bg-img-auth {
  background-image: url("/media/auth/cwie-auth-bg-1.png");
  background-size: cover;
  background-position: center;
}
</style>
