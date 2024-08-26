<template>
  <div v-if="isLoading" class="preloader" :style="`position: ${position}`" >
    <!-- You can use a spinner or any other preloader animation -->
    <div class="spinner"></div>
  </div>
</template>

<script lang="ts">
import { computed } from "vue";

export default {
  props: {
    isLoading: {
      default: undefined, // ตั้งค่า default เป็น undefined
    },
    position: {
      default: "fixed",
    },
  },
  setup(props) {
    // สร้าง computed property เพื่อให้แน่ใจว่า isLoading มีค่า default เป็น false ถ้า undefined
    // const computedIsLoading = computed(() => props.isLoading ?? false);
    // return {
    //   computedIsLoading,
    //   position: props.position,
    // };
  },
};
</script>

<style scoped>
/* Customize your preloader styles here */
.preloader {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99999;
}

.spinner {
  border: 10px solid #f3f3f3;
  border-top: 10px solid #3498db;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
