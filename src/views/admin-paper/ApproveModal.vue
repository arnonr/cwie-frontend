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
        <div class="modal-header">
          <h3 class="modal-title">ยกเลิก/ตอบรับข้อเสนอ</h3>
          <button
            @click="onClose({ reload: false })"
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>

        <div class="modal-body">
          <div class="row">
            <div class="mb-7 col-12 col-lg-12 text-end">
              <button
                class="btn btn-primary"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#flush-collapseOne"
                aria-expanded="false"
                aria-controls="flush-collapseOne"
              >
                ดูข้อมูล
              </button>
            </div>

            <div class="mb-7 col-12 col-lg-12">
              <div class="accordion accordion-flush" id="accordionFlushExample">
                <div class="accordion-item">
                  <div
                    id="flush-collapseOne"
                    class="accordion-collapse collapse"
                    aria-labelledby="flush-headingOne"
                    data-bs-parent="#accordionFlushExample"
                  >
                    <div class="accordion-body" style="padding: 0">
                      <DetailPage v-if="item.id" :paper_id="item.id" />
                      <hr />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!--  -->
            <div class="form">
              <div class="mb-7 col-12 col-lg-12">
                <label for="" class="form-label">สถานะ</label>
                <v-select
                  id="slt-status-id"
                  name="slt-status-id"
                  label="name_th"
                  placeholder="สถานะ"
                  :options="statuses.filter((x: any) => {return x.id == 4 || x.id == 5})"
                  v-model="approved_item.status_id"
                  class="form-control"
                  :clearable="true"
                ></v-select>
              </div>
              <div class="mb-7 col-12 col-lg-12">
                <label for="" class="form-label">หมายเหตุ</label>
                <textarea
                  v-model="approved_item.detail"
                  rows="10"
                  type="text"
                  class="form-control"
                  placeholder=""
                  aria-label=""
                />
              </div>
            </div>

            <div class="mx-auto text-center mt-5">
              <button
                @click="onClose({ reload: false })"
                type="button"
                class="btn btn-danger me-2"
              >
                ยกเลิก
              </button>
              <button @click="onSubmit" type="button" class="btn btn-success">
                ยืนยัน
              </button>
            </div>
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
// Import Modal Bootstrap
import { Modal } from "bootstrap";
import ApiService from "@/core/services/ApiService";
// Use Toast Composables
import useToast from "@/composables/useToast";
import { useRouter } from "vue-router";

// Import Vue-select
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";

// Use Composables
import Preloader from "@/components/preloader/Preloader.vue";
import useDateData from "@/composables/useDateData";

// Import Component
import DetailPage from "@/views/admin-paper/Detail.vue";
import useStatusData from "@/composables/useStatusData";

export default defineComponent({
  name: "aprove-paper-modal",
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  components: {
    Preloader,
    DetailPage,
    vSelect,
  },
  setup(props, { emit }) {
    // UI
    const isLoading = ref<any>(true);
    const mainModalRef = ref<any>(null);
    const mainModalObj = ref<any>(null);
    const router = useRouter();
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    let { statuses } = useStatusData();

    // Variable
    const { item } = toRefs(props);

    const approved_item = reactive<any>({
      user_id: userData.id,
      approved_detail: "",
      status_id: null,
    });

    //Fetch

    // Event
    const onClose = ({ reload = false }: { reload?: boolean }) => {
      mainModalObj.value.hide();
      if (reload === true) {
        emit("reload");
      }
      emit("close-modal");
    };

    const onSubmit = async () => {
      isLoading.value = true;
      let data_item: any = {
        approved_at: new Date(),
        approved_user_id: approved_item.user_id,
        approved_detail: approved_item.approved_detail,
        status_id: approved_item.status_id?.id,
      };

      await ApiService.put("paper/" + item.value.id, data_item)
        .then(({ data }) => {
          if (data.msg != "success") {
            throw new Error("ERROR");
          }
          isLoading.value = false;
          onClose({ reload: true });
          useToast("บันทึกข้อมูลเสร็จสิ้น");
          router.push({ name: "admin-paper" });
        })
        .catch(({ response }) => {
          isLoading.value = false;
          console.log(response);
        });
    };

    // Mounted
    onMounted(async () => {
      mainModalObj.value = new Modal(mainModalRef.value, {});
      mainModalObj.value.show();
      mainModalRef.value.addEventListener("hidden.bs.modal", () =>
        onClose({ reload: false })
      );
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
      item,
      approved_item,
      statuses,
      onClose,
      onSubmit,
    };
  },
});
</script>

<style scoped>
.separator.separator-dotted {
  border-bottom-color: #ccc;
}
</style>
