<template>
  <div class="container p-0 mt-2 pb-0">
    <section>
      <div v-html="item.detail"></div>
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import ApiService from "@/core/services/ApiService";

export default defineComponent({
  name: "home",
  components: {},
  setup() {
    const item = ref({
      detail: "",
    });

    // fetchItem
    const fetchItem = async () => {
      const params = {
        orderBy: "created_at",
        order: "desc",
      };
      const { data } = await ApiService.query("about/1", {
        params: params,
      });
      item.value = data.data;
    };

    // Mounted
    onMounted(() => {
      fetchItem();
    });

    return { item };
  },
});
</script>
