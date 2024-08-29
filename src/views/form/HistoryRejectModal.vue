<template>
  <div
    class="modal fade"
    tabindex="-1"
    ref="mainModalRef"
    id="main-modal"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered modal-xl">
      <div class="modal-content">
        <div class="modal-header" v-if="!isLoading">
          <h3 class="modal-title">ประวัติการ Comment</h3>
          <button
            @click="onClose({ reload: false })"
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>

        <div class="modal-body" v-if="!isLoading">
          <div class="row">
            <table
              v-if="items"
              class="table table-bordered table-striped bg-sky"
            >
              <thead class="bg-primary">
                <tr>
                  <th class="text-center">วันที่</th>
                  <th class="text-center">ผู้ Comment</th>
                  <th class="text-center">รายละเอียด</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="it in items" :key="it.id">
                  <td class="text-center">
                    {{ convertDate(it.created_at) }}
                  </td>
                  <td class="text-center">
                    {{ it.user_id }}
                  </td>
                  <td class="text-center">{{ it.comment }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="text-center mt-6">
            <button
              @click="onClose({ reload: false })"
              type="button"
              class="btn btn-danger me-2 mt-6"
            >
              ปิด
            </button>
          </div>
        </div>
        <Preloader :isLoading="isLoading" :position="'absolute'" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  reactive,
  onMounted,
  onUnmounted,
  toRefs,
} from "vue";
import ApiService from "@/core/services/ApiService";
// Import Modal Bootstrap
import { Modal } from "bootstrap";

// Use Composables
import Preloader from "@/components/preloader/Preloader.vue";
import useDateData from "@/composables/useDateData";

export default defineComponent({
  name: "history-reject-modal",
  props: {
    id: {
      type: Number,
      required: true,
    },
  },
  components: {
    Preloader,
  },

  setup(props, { emit }) {
    // UI
    const isLoading = ref<any>(true);
    const mainModalRef = ref<any>(null);
    const mainModalObj = ref<any>(null);

    // Variable
    const items = ref<any>([]);

    const fetchItems = async () => {
      try {
        const { data } = await ApiService.query("reject-log/", {
          params: { form_id: props.id, perPage: 100 },
        });

        items.value = data.data;
      } catch (error) {
        console.log(error);
      }
    };

    // Event
    const onClose = ({ reload = false }: { reload?: boolean }) => {
      mainModalObj.value.hide();
      emit("close-modal");
    };

    // Mounted
    onMounted(async () => {
      mainModalObj.value = new Modal(mainModalRef.value, {});
      mainModalObj.value.show();
      mainModalRef.value.addEventListener("hidden.bs.modal", () =>
        onClose({ reload: false })
      );
      await fetchItems();
      isLoading.value = false;
    });

    onUnmounted(() => {
      if (mainModalRef.value) {
        mainModalRef.value.addEventListener("hidden.bs.modal", () =>
          onClose({ reload: false })
        );
      }
      mainModalObj.value.hide();
      emit("close-modal");
    });
    // Return
    return {
      isLoading,
      mainModalRef,
      convertDate: useDateData().convertDate,
      onClose,
      items,
    };
  },
});
</script>

<style scoped>
.separator.separator-dotted {
  border-bottom-color: #ccc;
}
th {
  vertical-align: middle;
}
</style>
